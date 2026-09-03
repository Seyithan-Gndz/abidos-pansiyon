import { Banknote, BedDouble, CircleDollarSign, DoorOpen, Gauge, Hotel } from "lucide-react";
import type { AdminSummary, AuditLog, CashSummaryData, FloorStatus } from "@/types/admin";
import { AdminShell } from "./AdminShell";
import { CashSummary } from "./CashSummary";
import { RecentTransactions } from "./RecentTransactions";
import { RoomStatusOverview } from "./RoomStatusOverview";
import { SummaryCard } from "./SummaryCard";

const number = new Intl.NumberFormat("tr-TR");

export function AdminDashboard({ summary, cash, floors, transactions }: { summary: AdminSummary; cash: CashSummaryData; floors: FloorStatus[]; transactions: AuditLog[] }) {
  return <AdminShell><main className="p-5 md:p-8"><div className="mb-5"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">GENEL BAKIŞ</p><div className="mt-1 flex flex-wrap items-end justify-between gap-2"><h2 className="font-display text-2xl font-extrabold tracking-tight text-[#173545]">İşletme özeti</h2><span className="text-[10px] text-emerald-600">Canlı Supabase verileri</span></div></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"><SummaryCard label="Toplam Oda" value={`${summary.totalRooms}`} hint="Kayıtlı oda sayısı" icon={Hotel}/><SummaryCard label="Dolu Oda" value={`${summary.occupiedRooms}`} hint="Şu anda konaklayan" icon={BedDouble} tone="red"/><SummaryCard label="Boş Oda" value={`${summary.availableRooms}`} hint="Konaklamaya hazır" icon={DoorOpen} tone="green"/><SummaryCard label="Doluluk Oranı" value={`%${summary.occupancyRate}`} hint="Anlık durum" icon={Gauge} tone="amber"/><SummaryCard label="Bugünkü Tahakkuk" value={`${number.format(summary.todayAccommodation)} ₺`} hint="Bugün verilen odalar" icon={CircleDollarSign}/><SummaryCard label="Toplam Alacak" value={`${number.format(summary.pendingCollection)} ₺`} hint="Ödenmemiş oda tutarı" icon={Banknote} tone="red"/></div><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,.7fr)]"><RoomStatusOverview floors={floors}/><CashSummary data={cash}/><RecentTransactions transactions={transactions}/></div></main></AdminShell>;
}
