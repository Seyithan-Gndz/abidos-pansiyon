import type { Room } from "@/types/room";
import { RoomCard } from "./RoomCard";

export function FloorRow({ floor, rooms, onSelect }: { floor: number; rooms: Room[]; onSelect: (room: Room) => void }) {
  const available = rooms.filter(room => room.status === "available").length;
  return <section className="grid min-h-[150px] grid-cols-[62px_1fr] border-b border-slate-300 bg-white last:border-b-0 sm:grid-cols-[76px_1fr] xl:grid-cols-[88px_1fr]">
    <div className="flex flex-col items-center justify-center border-r border-slate-300 bg-[#edf1f2]"><span className="font-display text-[28px] font-extrabold leading-none text-[#1c3949] xl:text-[32px]">{floor}</span><b className="mt-1 text-[9px] tracking-[.15em] text-[#59707b]">{floor}. KAT</b><small className="mt-1 hidden text-[9px] text-slate-400 sm:block">{available} oda müsait</small></div>
    <div className="floor-rooms">{rooms.map(room => <RoomCard key={room.id} room={room} onSelect={onSelect}/>)}</div>
  </section>;
}
