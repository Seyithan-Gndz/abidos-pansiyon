import type { LucideIcon } from "lucide-react";

export function SummaryCard({ label, value, hint, icon:Icon, tone="blue" }: { label:string; value:string; hint?:string; icon:LucideIcon; tone?:"blue"|"red"|"green"|"amber" }) {
  const tones = { blue:"bg-sky-50 text-sky-700", red:"bg-red-50 text-red-700", green:"bg-emerald-50 text-emerald-700", amber:"bg-amber-50 text-amber-700" };
  return <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_#24394608] xl:p-5"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.12em] text-slate-400">{label}</p><strong className="mt-2 block font-display text-2xl font-extrabold tracking-tight text-[#173545] xl:text-[28px]">{value}</strong></div><span className={`grid size-10 place-items-center rounded-lg ${tones[tone]}`}><Icon size={19}/></span></div>{hint && <p className="mt-2 text-[10px] text-slate-400">{hint}</p>}</article>;
}
