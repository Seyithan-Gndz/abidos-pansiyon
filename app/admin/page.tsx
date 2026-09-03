import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { CashEntry, FloorStatus } from "@/types/admin";
import type { Room } from "@/types/room";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Yönetim Paneli | Abidos Pansiyon" };

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();
  const [{ data: roomRows }, { data: entryRows }, { data: profiles }] = await Promise.all([
    supabase.from("rooms").select("data"),
    supabase.from("cash_entries").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id,full_name"),
  ]);
  const rooms = (roomRows ?? []).map(row => row.data as Room);
  const entries = (entryRows ?? []) as CashEntry[];
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());
  const todayEntries = entries.filter(entry => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date(entry.created_at)) === today);
  const sum = (items: CashEntry[]) => items.reduce((total, entry) => total + Number(entry.amount), 0);
  const floors = [...new Set(rooms.map(room => room.floor))].sort((a,b) => b-a).map((floor): FloorStatus => {
    const list = rooms.filter(room => room.floor === floor);
    return { floor, total: list.length, occupied: list.filter(room => room.status === "occupied").length, available: list.filter(room => room.status === "available").length, outOfService: list.filter(room => room.status === "out_of_service").length };
  });
  const occupied = rooms.filter(room => room.status === "occupied").length;
  const available = rooms.filter(room => room.status === "available").length;
  const nameById = new Map((profiles ?? []).map(profile => [profile.id, profile.full_name]));
  const cash = { cash: sum(todayEntries.filter(entry => entry.payment_method === "cash")), card: sum(todayEntries.filter(entry => entry.payment_method === "card")), pendingPayment: sum(entries.filter(entry => entry.payment_method === "receivable")), todayCollection: sum(todayEntries.filter(entry => entry.payment_method !== "receivable")), dailyTotal: sum(todayEntries) };
  const transactions = entries.slice(0, 10).map(entry => ({ id: entry.id, action: "Oda Verildi" as const, roomNumber: entry.room_number, user: nameById.get(entry.created_by) || "Personel", timestamp: entry.created_at, checkIn: entry.check_in_date, checkOut: entry.check_out_date ?? undefined, amount: Number(entry.amount) }));

  return <AdminDashboard summary={{ totalRooms: rooms.length, occupiedRooms: occupied, availableRooms: available, occupancyRate: rooms.length ? Math.round(occupied / rooms.length * 100) : 0, todayAccommodation: sum(todayEntries), pendingCollection: cash.pendingPayment }} cash={cash} floors={floors} transactions={transactions}/>;
}
