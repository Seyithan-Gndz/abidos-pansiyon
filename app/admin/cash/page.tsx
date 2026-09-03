import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { CashLedger } from "@/components/admin/CashLedger";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { CashEntry } from "@/types/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Kasa | Abidos Pansiyon" };

export default async function CashPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("cash_entries").select("*").order("created_at", { ascending: false });
  return <AdminShell><main className="p-5 md:p-8"><div className="mx-auto max-w-[1200px]"><div className="mb-6"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">FİNANS</p><h1 className="font-display text-2xl font-extrabold tracking-tight text-[#173545]">Kasa</h1><p className="mt-1 text-sm text-slate-500">Nakit, kredi kartı ve ödenmemiş oda tutarlarını takip edin.</p></div>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Kasa verileri yüklenemedi: {error.message}</p>}<CashLedger entries={(data ?? []) as CashEntry[]}/></div></main></AdminShell>;
}

