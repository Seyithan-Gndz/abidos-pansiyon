import { BedDouble, ChevronRight, Info, UserRound, UsersRound } from "lucide-react";
import { formatDate, roomPrice, STATUS_LABELS } from "@/lib/room-utils";
import type { Room } from "@/types/room";

export function RoomCard({ room, onSelect }: { room: Room; onSelect: (room: Room) => void }) {
  return <button type="button" onClick={() => onSelect(room)} aria-label={`${room.roomNumber} numaralı oda detaylarını aç`} className={`room-card room-${room.status} relative z-0 touch-manipulation focus:z-10 focus:outline-none focus:ring-2 focus:ring-sky-500`}>
    <div className="flex items-start justify-between"><strong className="font-display text-[25px] font-extrabold leading-none">{room.roomNumber}</strong><span className="flex items-center gap-1 text-[8px] font-extrabold tracking-wider"><i className="status-dot size-1.5 rounded-full"/>{STATUS_LABELS[room.status]}</span></div>
    {room.status === "occupied" && <div className="-mx-3 mt-2 flex items-center gap-1 bg-[#b84946] px-3 py-1.5 text-white"><span className="text-[7px] font-bold tracking-widest">{room.stay?.checkOutDate ? "ÇIKIŞ" : "UZUN SÜRELİ"}</span><strong className="text-[11px]">{room.stay?.checkOutDate ? formatDate(room.stay.checkOutDate, true) : "Aylık"}</strong>{room.stay?.nights !== "monthly" && <em className="ml-auto rounded bg-[#9f3936] px-1.5 py-0.5 text-[9px] not-italic">{room.stay?.nights} gece</em>}</div>}
    {room.status === "occupied" && room.stay?.guestName && <span className="mt-1.5 flex items-center gap-1 truncate text-[9px] font-bold"><UserRound className="shrink-0" size={13}/>{room.stay.guestName}</span>}
    <div className="mt-2 flex flex-col gap-1 overflow-hidden text-[10px]"><span className="flex items-center gap-1.5"><UsersRound size={14}/><b>{room.capacity} kişilik</b></span><span className="flex items-center gap-1.5 truncate"><BedDouble className="shrink-0" size={14}/>{room.bedInfo}</span></div>
    <div className="mt-auto flex items-end justify-between border-t border-black/10 pt-2"><strong className="truncate text-[10px]">{roomPrice(room)}</strong><ChevronRight className="opacity-50" size={15}/></div>
    {room.status === "out_of_service" && <span className="mt-1 flex items-center gap-1 truncate text-[8px] opacity-70"><Info size={12}/>Depo olarak kullanılıyor</span>}
  </button>;
}
