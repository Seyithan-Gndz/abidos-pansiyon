"use client";

import { useState } from "react";
import { Banknote, BedDouble, CircleDollarSign, DoorOpen, Gauge, Hotel } from "lucide-react";
import { adminSummary, cashSummary, floorStatuses, recentTransactions } from "@/data/adminMockData";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";
import { CashSummary } from "./CashSummary";
import { RecentTransactions } from "./RecentTransactions";
import { RoomStatusOverview } from "./RoomStatusOverview";
import { SummaryCard } from "./SummaryCard";

const number = new Intl.NumberFormat("tr-TR");
export function AdminDashboard() {
  const [menuOpen,setMenuOpen]=useState(false);
  return <div className="min-h-screen bg-[#f3f5f6] lg:grid lg:grid-cols-[256px_1fr]"><AdminSidebar open={menuOpen} onClose={()=>setMenuOpen(false)}/><div className="min-w-0"><AdminHeader onMenu={()=>setMenuOpen(true)}/><main className="p-5 md:p-8">
    <div className="mb-5"><p className="text-[10px] font-bold tracking-[.16em] text-slate-400">GENEL BAKIŞ</p><div className="mt-1 flex flex-wrap items-end justify-between gap-2"><h2 className="font-display text-2xl font-extrabold tracking-tight text-[#173545]">İşletme özeti</h2><span className="text-[10px] text-slate-400">Veriler demo amaçlıdır</span></div></div>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <SummaryCard label="Toplam Oda" value={`${adminSummary.totalRooms}`} hint="5 kata dağılıyor" icon={Hotel}/><SummaryCard label="Dolu Oda" value={`${adminSummary.occupiedRooms}`} hint="Şu anda konaklayan" icon={BedDouble} tone="red"/><SummaryCard label="Boş Oda" value={`${adminSummary.availableRooms}`} hint="Konaklamaya hazır" icon={DoorOpen} tone="green"/><SummaryCard label="Doluluk Oranı" value={`%${adminSummary.occupancyRate}`} hint="Bugünkü durum" icon={Gauge} tone="amber"/><SummaryCard label="Konaklama Tutarı" value={`${number.format(adminSummary.todayAccommodation)} ₺`} hint="Bugünkü tahakkuk" icon={CircleDollarSign}/><SummaryCard label="Bekleyen Tahsilat" value={`${number.format(adminSummary.pendingCollection)} ₺`} hint="Henüz alınmamış" icon={Banknote} tone="red"/>
    </div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,.7fr)]"><RoomStatusOverview floors={floorStatuses}/><CashSummary data={cashSummary}/><RecentTransactions transactions={recentTransactions}/></div>
  </main></div></div>;
}
