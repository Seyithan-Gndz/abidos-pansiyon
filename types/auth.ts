export type UserRole = "admin" | "reception";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  approval_status: ApprovalStatus;
  created_at: string;
}

