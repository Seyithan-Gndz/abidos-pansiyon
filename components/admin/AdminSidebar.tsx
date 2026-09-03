import Link from "next/link";
import { Banknote, BedDouble, History, LayoutDashboard, Settings, UsersRound, X } from "lucide-react";

const menu = [
  {label:"Genel Bakış",icon:LayoutDashboard,active:true}, {label:"Odalar",icon:BedDouble}, {label:"Kasa",icon:Banknote},
  {label:"Personel",icon:UsersRound}, {label:"İşlem Geçmişi",icon:History}, {label:"Ayarlar",icon:Settings},
];

export function AdminSidebar({ open, onClose }: { open:boolean; onClose:()=>void }) {
  return <><div onClick={onClose} className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm transition lg:hidden ${open?"opacity-100":"pointer-events-none opacity-0"}`}/><aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#153444] text-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}>
    <div className="flex h-20 items-center justify-between border-b border-white/10 px-6 lg:hidden"><span className="text-[10px] font-bold tracking-[.2em] text-slate-400">YÖNETİM MENÜSÜ</span><button onClick={onClose} className="text-slate-400" aria-label="Menüyü kapat"><X/></button></div>
    <nav className="space-y-1 p-3"><p className="px-3 pb-2 pt-5 text-[9px] font-bold tracking-[.18em] text-slate-500">YÖNETİM</p>{menu.map(({label,icon:Icon,active}) => <button disabled={!active} key={label} className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-[12px] font-semibold ${active?"bg-white/10 text-white":"cursor-not-allowed text-slate-500"}`}><Icon size={18}/>{label}{!active&&<span className="ml-auto text-[8px] font-medium uppercase tracking-wider">Yakında</span>}</button>)}</nav>
    <div className="mt-auto border-t border-white/10 p-4"><Link href="/reception" className="flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2.5 text-[11px] font-bold text-slate-200 hover:bg-white/10"><BedDouble size={16}/>Resepsiyona Git</Link><p className="mt-4 text-center text-[8px] tracking-wider text-slate-600">MK DIGITAL SYSTEMS</p></div>
  </aside></>;
}
