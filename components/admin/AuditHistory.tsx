import { BedDouble, Building2, LogIn, LogOut, Settings, UserCog } from "lucide-react";
import type { AuditEntry } from "@/types/admin";

const definitions = {
  room_created: { label: "Oda eklendi", icon: BedDouble, tone: "bg-emerald-50 text-emerald-700" },
  room_updated: { label: "Oda düzenlendi", icon: BedDouble, tone: "bg-sky-50 text-sky-700" },
  check_in: { label: "Oda verildi", icon: LogIn, tone: "bg-violet-50 text-violet-700" },
  check_out: { label: "Çıkış yapıldı", icon: LogOut, tone: "bg-amber-50 text-amber-700" },
  staff_updated: { label: "Personel yetkisi değişti", icon: UserCog, tone: "bg-red-50 text-red-700" },
  settings_updated: { label: "Ayarlar güncellendi", icon: Settings, tone: "bg-slate-100 text-slate-700" },
} as const;

function detail(entry: AuditEntry) {
  const values = entry.details as { stay?: { guestName?: string }; email?: string; newRole?: string; newStatus?: string; businessName?: string };
  if (entry.action === "check_in") return values.stay?.guestName ? `${values.stay.guestName} için oda açıldı` : "Oda konaklamaya açıldı";
  if (entry.action === "check_out") return values.stay?.guestName ? `${values.stay.guestName} çıkış yaptı` : "Oda boşaltıldı";
  if (entry.action === "staff_updated") return `${values.email ?? "Personel"} · ${values.newRole ?? "—"} / ${values.newStatus ?? "—"}`;
  if (entry.action === "settings_updated") return `${values.businessName ?? "İşletme"} ayarları değiştirildi`;
  return entry.room_number ? `${entry.room_number} numaralı oda` : entry.entity_id;
}

export function AuditHistory({ entries }: { entries: AuditEntry[] }) {
  return <section className="panel overflow-hidden"><div className="panel-head"><div><p>DENETİM KAYDI</p><h2>Tüm işlemler</h2></div><span className="text-xs font-bold text-slate-400">{entries.length} kayıt</span></div><div className="divide-y divide-slate-100">{entries.map(entry => { const item = definitions[entry.action] ?? { label: entry.action, icon: Building2, tone: "bg-slate-100 text-slate-700" }; const Icon = item.icon; return <article className="flex gap-4 p-4 hover:bg-slate-50" key={entry.id}><span className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.tone}`}><Icon size={18}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold text-slate-800">{item.label}{entry.room_number && <span className="ml-2 text-[#287da5]">Oda {entry.room_number}</span>}</p><time className="text-[11px] text-slate-400">{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Istanbul" }).format(new Date(entry.created_at))}</time></div><p className="mt-1 text-sm text-slate-500">{detail(entry)}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">İşlemi yapan: {entry.actor_name || "Sistem"}</p></div></article>; })}{entries.length === 0 && <p className="p-10 text-center text-sm text-slate-500">Henüz kayıtlı işlem bulunmuyor.</p>}</div></section>;
}

