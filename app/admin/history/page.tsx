import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { AuditHistory } from "@/components/admin/AuditHistory";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { AuditEntry } from "@/types/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "İşlem Geçmişi | Abidos Pansiyon" };

export default async function HistoryPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: logs, error }, { data: profiles }] = await Promise.all([
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("profiles").select("id,full_name"),
  ]);
  const names = new Map((profiles ?? []).map(profile => [profile.id, profile.full_name]));
  const entries = ((logs ?? []) as AuditEntry[]).map(entry => ({ ...entry, actor_name: entry.created_by ? names.get(entry.created_by) : "Sistem" }));
  return <AdminShell><main className="p-5 md:p-8"><div className="mx-auto max-w-[1100px]"><div className="mb-6"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">YÖNETİM</p><h1 className="font-display text-2xl font-extrabold tracking-tight text-[#173545]">İşlem Geçmişi</h1><p className="mt-1 text-sm text-slate-500">Oda, personel ve ayar değişikliklerini kimin ne zaman yaptığını takip edin.</p></div>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">İşlem kayıtları yüklenemedi: {error.message}</p>}<AuditHistory entries={entries}/></div></main></AdminShell>;
}

