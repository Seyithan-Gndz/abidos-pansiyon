import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { RoomDefinitionForm } from "@/components/admin/RoomDefinitionForm";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Room } from "@/types/room";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Odalar | Abidos Pansiyon" };

export default async function AdminRoomsPage() {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("rooms").select("data").order("floor", { ascending: false }).order("room_number", { ascending: true });
  const rooms = (data ?? []).map(row => row.data as Room);

  return <AdminShell><main className="p-5 md:p-8"><div className="mx-auto max-w-[1200px]"><div className="mb-6"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">YÖNETİM</p><h1 className="font-display text-2xl font-extrabold tracking-tight text-[#173545]">Odalar</h1><p className="mt-1 text-sm text-slate-500">Oda özelliklerini, kapasiteyi ve günlük/aylık fiyat türünü düzenleyin.</p></div>{error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">Odalar yüklenemedi: {error.message}</p>}<div className="space-y-3">{rooms.map(room => <RoomDefinitionForm key={room.id} room={room}/>)}</div></div></main></AdminShell>;
}
