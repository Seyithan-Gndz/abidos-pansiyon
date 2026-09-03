import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/auth";

export const getCurrentProfile = cache(async (): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id,email,full_name,role,approval_status,created_at")
    .eq("id", user.id)
    .single();

  return data as UserProfile | null;
});

export async function requireApprovedUser() {
  if (!isSupabaseConfigured()) redirect("/setup");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.approval_status !== "approved") redirect("/pending");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireApprovedUser();
  if (profile.role !== "admin") redirect("/reception");
  return profile;
}
