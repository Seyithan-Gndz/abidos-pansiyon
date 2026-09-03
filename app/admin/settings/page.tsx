import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { BusinessSettingsForm } from "@/components/admin/BusinessSettingsForm";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { BusinessSettings } from "@/types/settings";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ayarlar | Abidos Pansiyon" };

const defaults: BusinessSettings = { id: 1, business_name: "Abidos Pansiyon", phone: "", address: "", check_in_time: "14:00", check_out_time: "11:00", currency: "TRY" };

export default async function SettingsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data: settings } = await supabase.from("business_settings").select("id,business_name,phone,address,check_in_time,check_out_time,currency").eq("id", 1).maybeSingle();

  return <AdminShell><main className="p-5 md:p-8"><div className="mx-auto max-w-[900px]"><div className="mb-6"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">YÖNETİM</p><h1 className="font-display text-2xl font-extrabold tracking-tight text-[#173545]">Ayarlar</h1><p className="mt-1 text-sm text-slate-500">İşletme bilgilerini ve çalışma düzenini yönetin.</p></div><BusinessSettingsForm settings={(settings as BusinessSettings | null) ?? defaults}/></div></main></AdminShell>;
}

