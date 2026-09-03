"use client";

import { useActionState } from "react";
import { ShieldCheck, UserCog } from "lucide-react";
import { updateUserAccess } from "@/app/admin/settings/actions";
import type { UserProfile } from "@/types/auth";
import type { SettingsActionState } from "@/types/settings";

function UserAccessForm({ user, currentUserId }: { user: UserProfile; currentUserId: string }) {
  const [state, action, pending] = useActionState(updateUserAccess, null as SettingsActionState);
  const isCurrentUser = user.id === currentUserId;
  return <form action={action} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"><input type="hidden" name="userId" value={user.id}/><div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><p className="truncate font-bold text-slate-800">{user.full_name || "İsimsiz kullanıcı"}{isCurrentUser && <span className="ml-2 text-[10px] text-sky-700">SİZ</span>}</p><p className="truncate text-xs text-slate-500">{user.email}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${user.approval_status === "approved" ? "bg-emerald-100 text-emerald-700" : user.approval_status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{user.approval_status === "approved" ? "ONAYLI" : user.approval_status === "rejected" ? "REDDEDİLDİ" : "BEKLİYOR"}</span></div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><label className="form-field"><span>ROL</span><select name="role" defaultValue={user.role} disabled={isCurrentUser}><option value="reception">Resepsiyon</option><option value="admin">Admin</option></select>{isCurrentUser && <input type="hidden" name="role" value="admin"/>}</label><label className="form-field"><span>ERİŞİM DURUMU</span><select name="approvalStatus" defaultValue={user.approval_status} disabled={isCurrentUser}><option value="pending">Onay bekliyor</option><option value="approved">Onaylı</option><option value="rejected">Reddedildi</option></select>{isCurrentUser && <input type="hidden" name="approvalStatus" value="approved"/>}</label><button disabled={pending} className="self-end rounded-lg bg-[#287da5] px-4 py-3 text-xs font-bold text-white disabled:opacity-60">{pending ? "Kaydediliyor..." : "Yetkiyi kaydet"}</button></div>{state?.error && <p className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-700">{state.error}</p>}{state?.success && <p className="mt-3 rounded-lg bg-emerald-50 p-2 text-xs text-emerald-700">{state.success}</p>}</form>;
}

export function UserAccessManager({ users, currentUserId }: { users: UserProfile[]; currentUserId: string }) {
  const adminCount = users.filter(user => user.role === "admin").length;
  const pendingCount = users.filter(user => user.approval_status === "pending").length;
  return <section id="users" className="panel scroll-mt-6 overflow-hidden"><div className="panel-head"><div><p>KULLANICI VE YETKİ</p><h2 className="flex items-center gap-2"><UserCog size={17}/>Hesap yönetimi</h2></div><div className="flex gap-2 text-[10px] font-bold"><span className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700">{adminCount}/3 ADMIN</span><span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">{pendingCount} BEKLEYEN</span></div></div><div className="space-y-3 p-5">{users.map(user => <UserAccessForm key={user.id} user={user} currentUserId={currentUserId}/>)}{users.length === 0 && <p className="text-sm text-slate-500">Henüz kullanıcı hesabı bulunmuyor.</p>}</div><div className="border-t border-slate-100 bg-slate-50 px-5 py-4 text-xs leading-5 text-slate-500"><p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={16}/>Admin hesapları yönetim ve resepsiyon ekranlarına erişir. Onaylı resepsiyon hesapları yalnızca resepsiyon ekranına erişebilir. Admin sayısı veritabanında en fazla 3 olarak sınırlandırılmıştır.</p></div></section>;
}

