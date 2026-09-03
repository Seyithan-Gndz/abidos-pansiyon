import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { UserApprovalPanel } from "@/components/admin/UserApprovalPanel";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Yönetim Paneli | Abidos Pansiyon" };
export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,approval_status,created_at")
    .eq("role", "reception")
    .order("created_at", { ascending: false });
  return <><UserApprovalPanel users={(data ?? []) as UserProfile[]}/><AdminDashboard/></>;
}
