import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await exchangeCodeForSessionToken();
        // After successful auth, check if user has an org
        // If not, redirect to onboarding, otherwise to dashboard
        const response = await fetch("/api/users/me");
        const userData = await response.json();
        
        if (!userData.org_id) {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        navigate("/");
      }
    };

    handleCallback();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        <p className="mt-4 text-slate-600">Autenticando...</p>
      </div>
    </div>
  );
}
