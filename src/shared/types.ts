import type { MochaUser } from "@getmocha/users-service/shared";

export interface AppUser extends MochaUser {
  app_user_id: number;
  org_id: number | null;
  role: "admin" | "member";
}

export interface Organization {
  id: number;
  name: string;
  plan_type: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  mocha_user_id: string;
  org_id: number | null;
  email: string;
  role: "admin" | "member";
  google_refresh_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: number;
  user_id: number;
  org_id: number;
  external_meeting_id: string | null;
  meeting_title: string | null;
  meeting_url: string | null;
  meeting_time: string | null;
  video_url: string | null;
  transcription_full: string | null;
  summary: string | null;
  status: "scheduled" | "recording" | "processing" | "done" | "failed";
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  meeting_id: number | null;
  org_id: number;
  assigned_to_user_id: number | null;
  title: string;
  description: string | null;
  status: "suggestion" | "todo" | "doing" | "done";
  due_date: string | null;
  priority: "low" | "medium" | "high";
  tags: string | null;
  created_at: string;
  updated_at: string;
}
