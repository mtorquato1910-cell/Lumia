/**
 * Database Types for Supabase Tables
 * MeetSprint AI
 */

// =============================================
// PROFILES
// =============================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'member';
  organization_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;

// =============================================
// ORGANIZATIONS
// =============================================

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export type OrganizationInsert = Omit<Organization, 'id' | 'created_at' | 'updated_at'>;
export type OrganizationUpdate = Partial<Omit<Organization, 'id' | 'created_at'>>;

// =============================================
// MEETINGS
// =============================================

export type MeetingStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Meeting {
  id: string;
  user_id: string;
  organization_id: string;
  title: string;
  description: string | null;
  date: string;
  duration_minutes: number | null;
  video_url: string | null;
  transcription: string | null;
  status: MeetingStatus;
  created_at: string;
  updated_at: string;
}

export type MeetingInsert = Omit<Meeting, 'id' | 'created_at' | 'updated_at'>;
export type MeetingUpdate = Partial<Omit<Meeting, 'id' | 'created_at'>>;

// Meeting with related data
export interface MeetingWithTasks extends Meeting {
  tasks?: Task[];
}

// =============================================
// TASKS
// =============================================

export type TaskStatus = 'todo' | 'doing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  meeting_id: string;
  organization_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type TaskUpdate = Partial<Omit<Task, 'id' | 'created_at'>>;

// Task with related data
export interface TaskWithAssignee extends Task {
  assignee?: Profile | null;
  meeting?: Meeting | null;
}

// =============================================
// DASHBOARD METRICS
// =============================================

export interface DashboardMetrics {
  totalMeetings: number;
  completedMeetings: number;
  totalTasks: number;
  completedTasks: number;
  todoTasks: number;
  doingTasks: number;
  completionRate: number;
  hoursRecorded: number;
}

// =============================================
// ACTIVITY TYPES
// =============================================

export type ActivityType = 'meeting' | 'task' | 'sprint';

export interface Activity {
  id: string;
  title: string;
  time: string;
  type: ActivityType;
  relatedId?: string;
}

// =============================================
// API RESPONSE TYPES
// =============================================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

