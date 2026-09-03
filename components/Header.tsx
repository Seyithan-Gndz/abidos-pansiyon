import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CircleUserRound } from "lucide-react";
import type { Room } from "@/types/room";
import type { UserProfile } from "@/types/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ShieldCheck } from "lucide-react";
import { StatusLegend } from "./StatusLegend";

export function Header({ rooms, profile }: { rooms: Room[]; profile: UserProfile }) {
  const today = new Intl.DateTimeFormat("tr-TR", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).format(new Date());
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 shadow-[0_3px_20px_#1c35420a] backdrop-blur">
    <div className="mx-auto flex min-h-24 max-w-[1580px] flex-wrap items-center gap-5 px-5 py-4 md:px-10 xl:px-16">
      <div className="relative h-12 w-[150px] shrink-0 sm:w-[170px]"><Image src="/images/logo-sehitler.png" alt="Abidos Pansiyon Çanakkale" fill priority sizes="170px" className="object-contain"/></div>
      <div className="ml-auto border-l border-slate-200 pl-5 md:ml-5 md:pl-9"><p className="text-[9px] font-bold tracking-[.22em] text-slate-400">RESEPSİYON</p><h1 className="font-display text-xl font-extrabold text-[#162f3e] md:text-2xl">Oda Planı</h1></div>
      <div className="flex w-full items-center justify-between gap-3 md:ml-auto md:w-auto md:flex-col md:items-end">
        <div className="flex items-center gap-3"><div className="flex items-center gap-2 text-[11px] capitalize text-slate-500 sm:text-sm"><CalendarDays size={16}/>{today}</div><div className="flex items-center gap-1.5 border-l border-slate-200 pl-4 text-[11px] font-semibold text-slate-600"><CircleUserRound size={16}/>{profile.full_name}</div>{profile.role === "admin" && <Link href="/admin" className="flex items-center gap-1.5 rounded-lg bg-[#173545] px-3 py-2 text-xs font-bold text-white"><ShieldCheck size={15}/>Admin Paneli</Link>}<LogoutButton/></div>
        <StatusLegend rooms={rooms}/>
      </div>
    </div>
  </header>;
}
