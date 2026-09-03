import { Banknote, CreditCard, Hourglass, Landmark, WalletCards } from "lucide-react";
import type { CashSummaryData } from "@/types/admin";

const format=(value:number)=>`${new Intl.NumberFormat("tr-TR").format(value)} ₺`;
export function CashSummary({ data }: { data:CashSummaryData }) {
  const rows=[{label:"Bugünkü tahsilat",value:data.todayCollection,icon:WalletCards},{label:"Nakit",value:data.cash,icon:Banknote},{label:"Kart",value:data.card,icon:CreditCard},{label:"Bekleyen ödeme",value:data.pendingPayment,icon:Hourglass}];
  return <section className="panel"><div className="panel-head"><div><p>KASA ÖZETİ</p><h2>Bugünün finansal durumu</h2></div><Landmark className="text-slate-300" size={21}/></div><div className="space-y-1 p-4">{rows.map(({label,value,icon:Icon})=><div className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-slate-50" key={label}><span className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-500"><Icon size={15}/></span><span className="text-[11px] text-slate-500">{label}</span><b className="ml-auto text-xs text-slate-700">{format(value)}</b></div>)}<div className="mt-3 flex items-center justify-between rounded-lg bg-[#173545] px-4 py-4 text-white"><span className="text-[10px] font-bold tracking-wider text-slate-300">GÜNLÜK TOPLAM</span><strong className="font-display text-xl">{format(data.dailyTotal)}</strong></div></div></section>;
}
