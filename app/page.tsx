import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!isSupabaseConfigured()) redirect("/setup");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.approval_status !== "approved") redirect("/pending");
  redirect(profile.role === "admin" ? "/admin" : "/reception");
}
