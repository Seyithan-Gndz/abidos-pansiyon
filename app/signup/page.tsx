import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { getCurrentProfile } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (!isSupabaseConfigured()) redirect("/setup");
  if (await getCurrentProfile()) redirect("/");
  return <AuthShell title="Resepsiyon kaydı" description="Yeni hesaplar yönetici onayından sonra resepsiyon ekranına erişebilir."><AuthForm mode="signup"/></AuthShell>;
}
