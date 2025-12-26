import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";

const app = new Hono<{ Bindings: Env }>();

// OAuth redirect URL endpoint
app.get("/api/oauth/google/redirect_url", async (c) => {
  const redirectUrl = await getOAuthRedirectUrl("google", {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Exchange code for session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

// Get current user
app.get("/api/users/me", authMiddleware, async (c) => {
  const mochaUser = c.get("user");
  
  if (!mochaUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  // Check if user exists in our database
  const existingUser = await c.env.DB.prepare(
    "SELECT * FROM users WHERE mocha_user_id = ?"
  )
    .bind(mochaUser.id)
    .first();

  if (!existingUser) {
    // Create new user if they don't exist
    const result = await c.env.DB.prepare(
      "INSERT INTO users (mocha_user_id, email, role) VALUES (?, ?, ?)"
    )
      .bind(mochaUser.id, mochaUser.email, "member")
      .run();

    return c.json({
      ...mochaUser,
      app_user_id: result.meta.last_row_id,
      org_id: null,
      role: "member",
    });
  }

  return c.json({
    ...mochaUser,
    app_user_id: existingUser.id,
    org_id: existingUser.org_id,
    role: existingUser.role,
  });
});

// Logout
app.get("/api/logout", async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === "string") {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Organization endpoints
app.post("/api/organizations", authMiddleware, async (c) => {
  const mochaUser = c.get("user");
  
  if (!mochaUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const body = await c.req.json();

  if (!body.name) {
    return c.json({ error: "Organization name is required" }, 400);
  }

  const result = await c.env.DB.prepare(
    "INSERT INTO organizations (name, owner_id) VALUES (?, ?)"
  )
    .bind(body.name, mochaUser.id)
    .run();

  // Update user with org_id and set role to admin
  await c.env.DB.prepare(
    "UPDATE users SET org_id = ?, role = ? WHERE mocha_user_id = ?"
  )
    .bind(result.meta.last_row_id, "admin", mochaUser.id)
    .run();

  return c.json({ id: result.meta.last_row_id, name: body.name }, 201);
});

export default app;
