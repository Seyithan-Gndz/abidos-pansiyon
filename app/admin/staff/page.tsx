import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { UserAccessManager } from "@/components/admin/UserAccessManager";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile } from "@/types/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Personel | Abidos Pansiyon" };

export default async function StaffPage() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { data: users, error } = await supabase.from("profiles").select("id,email,full_name,role,approval_status,created_at").order("created_at", { ascending: true });

  return <AdminShell><main className="p-5 md:p-8"><div className="mx-auto max-w-[1100px]"><div className="mb-6"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">YÖNETİM</p><h1 className="font-display text-2xl font-extrabold tracking-tight text-[#173545]">Personel</h1><p className="mt-1 text-sm text-slate-500">Kullanıcı başvurularını onaylayın ve personel yetkilerini belirleyin.</p></div>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Personel kayıtları yüklenemedi: {error.message}</p>}<UserAccessManager users={(users ?? []) as UserProfile[]} currentUserId={admin.id}/></div></main></AdminShell>;
}
