import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!isSupabaseConfigured()) redirect("/setup");
  if (await getCurrentProfile()) redirect("/");
  return <AuthShell title="Giriş yap" description="Yönetim veya resepsiyon hesabınızla devam edin."><AuthForm mode="login"/></AuthShell>;
}
