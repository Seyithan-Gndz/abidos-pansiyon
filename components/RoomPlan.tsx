"use client";

import { useCallback, useEffect, useState } from "react";
import { CircleUserRound } from "lucide-react";
import { FLOORS, rooms as initialRooms } from "@/data/rooms";
import { addDays } from "@/lib/room-utils";
import { roomRepository } from "@/lib/room-repository";
import type { CheckInInput, Room } from "@/types/room";
import type { UserProfile } from "@/types/auth";
import { FloorRow } from "./FloorRow";
import { Header } from "./Header";
import { RoomModal } from "./RoomModal";

export function RoomPlan({ profile }: { profile: UserProfile }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [error, setError] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  useEffect(() => { let active = true; roomRepository.list().then(result => active && setRooms(result)).catch(() => active && setError("Oda verileri yüklenemedi.")); return () => { active = false; }; }, []);
  const close = useCallback(() => setSelectedRoom(null), []);
  const checkIn = async (room: Room, input: CheckInInput) => { try { setRooms(await roomRepository.checkIn(rooms,room.id,{...input,appliedPrice:`${new Intl.NumberFormat("tr-TR").format(input.paymentAmount)} ₺`,checkOutDate:addDays(input.checkInDate,input.nights)})); close(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Oda güncellenemedi."); } };
  const checkOut = async (room: Room) => { try { setRooms(await roomRepository.checkOut(rooms,room.id)); close(); } catch { setError("Oda güncellenemedi."); } };

  return <><Header rooms={rooms} profile={profile}/><main className="mx-auto max-w-[1580px] px-5 py-10 md:px-10 xl:px-16">
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="mb-4 hidden justify-end sm:flex"><span className="flex items-center gap-2 text-[13px] text-slate-500"><CircleUserRound size={18}/>Oda detayları için karta tıklayın</span></div>
    <div className="overflow-hidden rounded-[14px] border border-slate-300 bg-slate-200 shadow-[0_16px_45px_#2439460d]">{FLOORS.map(floor => <FloorRow key={floor} floor={floor} rooms={rooms.filter(room => room.floor === floor)} onSelect={setSelectedRoom}/>)}</div>
  </main><footer className="flex flex-col gap-2 bg-[#173545] px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between md:px-10 xl:px-16"><span className="font-display text-[11px] font-bold tracking-[.2em]">ABİDOS PANSİYON</span><small className="text-slate-400">MK DIGITAL SYSTEMS</small></footer>
  {selectedRoom && <RoomModal room={selectedRoom} onClose={close} onCheckIn={checkIn} onCheckOut={checkOut}/>}</>;
}
