"use client";

import { useActionState } from "react";
import { Building2, Clock3, Save } from "lucide-react";
import { updateBusinessSettings } from "@/app/admin/settings/actions";
import type { BusinessSettings, SettingsActionState } from "@/types/settings";

export function BusinessSettingsForm({ settings }: { settings: BusinessSettings }) {
  const [state, action, pending] = useActionState(updateBusinessSettings, null as SettingsActionState);
  return <form action={action} className="panel overflow-hidden"><div className="panel-head"><div><p>İŞLETME</p><h2 className="flex items-center gap-2"><Building2 size={17}/>Genel bilgiler</h2></div></div><div className="grid gap-4 p-5 md:grid-cols-2"><label className="form-field md:col-span-2"><span>İŞLETME ADI</span><input name="businessName" defaultValue={settings.business_name} required/></label><label className="form-field"><span>TELEFON</span><input name="phone" type="tel" defaultValue={settings.phone} placeholder="+90 5xx xxx xx xx"/></label><label className="form-field"><span>PARA BİRİMİ</span><select name="currency" defaultValue={settings.currency}><option value="TRY">Türk Lirası (TRY)</option><option value="EUR">Euro (EUR)</option><option value="USD">Dolar (USD)</option></select></label><label className="form-field md:col-span-2"><span>ADRES</span><textarea name="address" rows={3} defaultValue={settings.address}/></label><label className="form-field"><span className="flex items-center gap-1"><Clock3 size={13}/>STANDART GİRİŞ SAATİ</span><input name="checkInTime" type="time" defaultValue={settings.check_in_time.slice(0,5)} required/></label><label className="form-field"><span className="flex items-center gap-1"><Clock3 size={13}/>STANDART ÇIKIŞ SAATİ</span><input name="checkOutTime" type="time" defaultValue={settings.check_out_time.slice(0,5)} required/></label>{state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{state.error}</p>}{state?.success && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 md:col-span-2">{state.success}</p>}<div className="flex justify-end md:col-span-2"><button disabled={pending} className="flex items-center gap-2 rounded-lg bg-[#173545] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"><Save size={16}/>{pending ? "Kaydediliyor..." : "Ayarları kaydet"}</button></div></div></form>;
}

