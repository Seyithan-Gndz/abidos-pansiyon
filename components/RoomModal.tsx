"use client";

import { useEffect, useState, type FormEvent } from "react";
import { BedDouble, CalendarDays, DoorOpen, Info, UsersRound, X } from "lucide-react";
import { addDays, formatDate, roomPrice } from "@/lib/room-utils";
import type { CheckInInput, Room } from "@/types/room";

interface Props { room: Room; onClose: () => void; onCheckIn: (room: Room, input: CheckInInput) => void; onCheckOut: (room: Room) => void; }

export function RoomModal({ room, onClose, onCheckIn, onCheckOut }: Props) {
  const [form, setForm] = useState<CheckInInput>({ guestName:"", checkInDate: new Date().toISOString().slice(0,10), nights:1, guestCount:1, appliedPrice:"", note:"" });
  const checkoutDate = addDays(form.checkInDate, form.nights);
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === "Escape" && onClose(); window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [onClose]);
  const submit = (event: FormEvent) => { event.preventDefault(); onCheckIn(room, form); };
  const set = <K extends keyof CheckInInput>(key: K, value: CheckInInput[K]) => setForm(previous => ({ ...previous, [key]: value }));

  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#0a202dbf] p-5 backdrop-blur-sm" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section role="dialog" aria-modal="true" aria-labelledby="room-title" className="max-h-[calc(100vh-40px)] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
      <div className="mb-5 flex items-start justify-between border-b border-slate-200 pb-5"><div><span className="text-[9px] font-extrabold tracking-[.2em] text-slate-400">ODA</span><h2 id="room-title" className="font-display text-4xl font-extrabold text-[#173545]">{room.roomNumber}</h2></div><button onClick={onClose} className="grid size-10 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200" aria-label="Kapat"><X/></button></div>
      <div className="mb-3 flex flex-wrap items-center gap-4 rounded-lg bg-slate-100 px-3 py-3 text-[11px] font-semibold text-slate-600"><span className="flex items-center gap-1.5"><UsersRound size={16}/>{room.capacity} kişi</span><span className="flex items-center gap-1.5"><BedDouble size={16}/>{room.bedInfo}</span><span>{roomPrice(room)}</span></div>
      {room.note && <div className="mb-4 flex items-start gap-2 border-l-3 border-slate-400 bg-slate-50 px-3 py-2.5 text-[11px] text-slate-500"><Info className="shrink-0" size={16}/>{room.note}</div>}

      {room.status === "occupied" && room.stay ? <>
        <div className="flex flex-col gap-1 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[#7d302d] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2 text-[10px] font-extrabold tracking-widest"><i className="size-2 rounded-full bg-red-500"/>DOLU</span><strong className="text-[13px]">{room.stay.checkOutDate ? `${formatDate(room.stay.checkOutDate)} tarihinde çıkış` : "Uzun süreli konaklama"}</strong></div>
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
          {room.stay.guestName && <div className="col-span-2 bg-slate-50 p-4"><small className="block text-[9px] uppercase tracking-wider text-slate-400">Misafir</small><b className="text-[13px]">{room.stay.guestName}</b></div>}
          {[ ["Giriş tarihi",formatDate(room.stay.checkInDate)], ["Kalış süresi",room.stay.nights === "monthly" ? "Aylık" : `${room.stay.nights} gece`], ["Çıkış tarihi",formatDate(room.stay.checkOutDate)], ["Kişi sayısı",`${room.stay.guestCount} kişi`], ["Uygulanan fiyat",room.stay.appliedPrice] ].map(([label,value]) => <div className="bg-slate-50 p-4 last:col-span-2" key={label}><small className="block text-[9px] uppercase tracking-wider text-slate-400">{label}</small><b className="text-[13px]">{value}</b></div>)}
          {room.stay.note && <div className="col-span-2 bg-slate-50 p-4"><small className="block text-[9px] uppercase tracking-wider text-slate-400">Konaklama notu</small><p className="text-[13px] text-slate-600">{room.stay.note}</p></div>}
        </div>
        <div className="mt-6 flex justify-end gap-2"><button onClick={onClose} className="rounded-lg bg-slate-100 px-5 py-3 text-xs font-bold text-slate-600">Kapat</button><button onClick={() => onCheckOut(room)} className="flex items-center gap-2 rounded-lg bg-[#b84946] px-5 py-3 text-xs font-bold text-white"><DoorOpen size={19}/>Çıkış Yap</button></div>
      </> : room.status === "out_of_service" ? <div className="rounded-lg border border-slate-200 bg-slate-100 p-4 text-sm font-semibold text-slate-600">Bu oda kullanım dışıdır ve konaklamaya açılamaz.</div> : <form onSubmit={submit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="form-field sm:col-span-2"><span>Misafir adı</span><input type="text" required placeholder="Ad Soyad" value={form.guestName} onChange={e => set("guestName",e.target.value)}/></label>
          <label className="form-field"><span>Giriş tarihi</span><input type="date" required value={form.checkInDate} onChange={e => set("checkInDate",e.target.value)}/></label>
          <label className="form-field"><span>Kaç gece kalacak?</span><input type="number" min="1" required value={form.nights} onChange={e => set("nights",Number(e.target.value))}/></label>
          <label className="form-field"><span>Kişi sayısı</span><select value={form.guestCount} onChange={e => set("guestCount",Number(e.target.value))}>{Array.from({length:room.capacity},(_,index) => <option key={index+1} value={index+1}>{index+1} kişi</option>)}</select></label>
          <label className="form-field"><span>Uygulanan fiyat</span><input required placeholder="Örn. 2.500 ₺" value={form.appliedPrice} onChange={e => set("appliedPrice",e.target.value)}/></label>
          <label className="form-field sm:col-span-2"><span>Kısa not <em>İsteğe bağlı</em></span><textarea rows={3} placeholder="Konaklamayla ilgili kısa bir not..." value={form.note} onChange={e => set("note",e.target.value)}/></label>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3.5 text-[#246587]"><CalendarDays size={21}/><div><span className="block text-[9px] font-bold tracking-wider">PLANLANAN ÇIKIŞ</span><strong className="font-display">{formatDate(checkoutDate)}</strong></div></div>
        <div className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} className="rounded-lg bg-slate-100 px-5 py-3 text-xs font-bold text-slate-600">Vazgeç</button><button className="rounded-lg bg-[#246f98] px-5 py-3 text-xs font-bold text-white">Odayı Dolu Yap</button></div>
      </form>}
    </section>
  </div>;
}
