"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { SettingsActionState } from "@/types/settings";

export async function updateBusinessSettings(
  _: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  const businessName = String(formData.get("businessName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const checkInTime = String(formData.get("checkInTime") ?? "");
  const checkOutTime = String(formData.get("checkOutTime") ?? "");
  const currency = String(formData.get("currency") ?? "TRY");

  if (businessName.length < 2) return { error: "İşletme adı en az 2 karakter olmalıdır." };
  if (!/^\d{2}:\d{2}$/.test(checkInTime) || !/^\d{2}:\d{2}$/.test(checkOutTime)) {
    return { error: "Giriş ve çıkış saatleri geçerli olmalıdır." };
  }
  if (!["TRY", "EUR", "USD"].includes(currency)) return { error: "Para birimi geçersiz." };

  const supabase = await createClient();
  const { error } = await supabase.from("business_settings").update({
    business_name: businessName,
    phone,
    address,
    check_in_time: checkInTime,
    check_out_time: checkOutTime,
    currency,
  }).eq("id", 1);

  if (error) return { error: `Ayarlar kaydedilemedi: ${error.message}` };
  revalidatePath("/admin/settings");
  return { success: "İşletme ayarları kaydedildi." };
}

export async function updateUserAccess(
  _: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const currentAdmin = await requireAdmin();
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  const approvalStatus = String(formData.get("approvalStatus") ?? "");

  if (!userId || !["admin", "reception"].includes(role)) return { error: "Geçersiz kullanıcı rolü." };
  if (!["pending", "approved", "rejected"].includes(approvalStatus)) return { error: "Geçersiz onay durumu." };
  if (userId === currentAdmin.id && (role !== "admin" || approvalStatus !== "approved")) {
    return { error: "Kendi admin erişiminizi kaldıramazsınız." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({
    role,
    approval_status: approvalStatus,
  }).eq("id", userId);

  if (error) {
    const message = error.message.includes("En fazla 3 admin")
      ? "En fazla 3 admin hesabı olabilir."
      : `Kullanıcı güncellenemedi: ${error.message}`;
    return { error: message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/admin/staff");
  return { success: "Kullanıcı yetkileri güncellendi." };
}
