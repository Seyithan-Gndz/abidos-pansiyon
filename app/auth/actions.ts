"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export type AuthState = { error?: string; success?: string } | null;

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "E-posta ve şifre zorunludur." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const messages: Record<string, string> = {
      email_not_confirmed: "E-posta adresi henüz doğrulanmamış. Supabase üzerinden kullanıcıyı onaylayın.",
      invalid_credentials: "E-posta veya şifre hatalı.",
      user_banned: "Bu kullanıcı hesabı devre dışı bırakılmış.",
      over_request_rate_limit: "Çok fazla giriş denemesi yapıldı. Birkaç dakika sonra tekrar deneyin.",
    };
    return { error: messages[error.code ?? ""] ?? `Giriş başarısız: ${error.message}` };
  }
  redirect("/");
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (fullName.length < 2) return { error: "Ad soyad en az 2 karakter olmalıdır." };
  if (!email.includes("@")) return { error: "Geçerli bir e-posta girin." };
  if (password.length < 8) return { error: "Şifre en az 8 karakter olmalıdır." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) return { error: error.message };
  if (!data.session) return { success: "E-posta adresinize gelen doğrulama bağlantısını açın." };
  redirect("/pending");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function setReceptionApproval(formData: FormData) {
  const admin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!userId || !["approved", "rejected"].includes(status) || userId === admin.id) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ approval_status: status })
    .eq("id", userId)
    .eq("role", "reception");
  if (error) throw new Error("Kullanıcı durumu güncellenemedi.");
  revalidatePath("/admin");
}
