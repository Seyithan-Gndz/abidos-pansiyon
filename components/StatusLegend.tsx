import type { Room, RoomStatus } from "@/types/room";

const items: { status: RoomStatus; label: string }[] = [
  { status: "available", label: "Boş" },
  { status: "occupied", label: "Dolu" },
  { status: "out_of_service", label: "Kullanım dışı" },
];

export function StatusLegend({ rooms }: { rooms: Room[] }) {
  return <div className="flex flex-wrap justify-end gap-2.5 text-[10px] text-slate-500 sm:gap-5 sm:text-xs">
    {items.map(item => <span className="flex items-center gap-1.5" key={item.status}>
      <i className={`size-2 rounded-full status-dot-${item.status}`} />{item.label}
      <b className="rounded-full bg-slate-100 px-1.5 text-slate-700">{rooms.filter(room => room.status === item.status).length}</b>
    </span>)}
  </div>;
}
