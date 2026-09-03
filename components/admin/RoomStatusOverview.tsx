import Link from "next/link";
import { ArrowRight, BedDouble } from "lucide-react";
import type { FloorStatus } from "@/types/admin";

export function RoomStatusOverview({ floors }: { floors:FloorStatus[] }) {
  return <section className="panel"><div className="panel-head"><div><p>ODA DURUMU</p><h2>Katlara göre doluluk</h2></div><Link href="/reception" className="flex items-center gap-2 rounded-lg bg-[#173545] px-3 py-2 text-[10px] font-bold text-white">Oda Planına Git<ArrowRight size={14}/></Link></div>
    <div className="space-y-2 p-4">{floors.map(floor => { const rate=Math.round(floor.occupied/floor.total*100); return <div className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2.5" key={floor.floor}><span className="grid size-9 place-items-center rounded-lg bg-slate-100 font-display text-sm font-extrabold text-[#173545]">{floor.floor}</span><div className="min-w-0 flex-1"><div className="flex justify-between text-[10px]"><b>{floor.floor}. Kat</b><span className="text-slate-400">{floor.total} oda · {floor.occupied} dolu · {floor.available} boş</span></div><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#b84946]" style={{width:`${rate}%`}}/></div></div>{floor.outOfService>0&&<span title="Kullanım dışı"><BedDouble size={14} className="text-slate-400"/></span>}</div>})}</div>
  </section>;
}
