import type { Room, RoomStatus } from "@/types/room";

export const STATUS_LABELS: Record<RoomStatus, string> = {
  available: "BOŞ",
  occupied: "DOLU",
  out_of_service: "KULLANIM DIŞI",
};

export function formatDate(value?: string | null, short = false) {
  if (!value) return "Belirtilmedi";
  return new Intl.DateTimeFormat("tr-TR", short ? { day: "2-digit", month: "2-digit" } : undefined)
    .format(new Date(`${value}T12:00:00`));
}

export function addDays(date: string, days: number) {
  const result = new Date(`${date}T12:00:00`);
  result.setDate(result.getDate() + days);
  return result.toISOString().slice(0, 10);
}

export function roomPrice(room: Room) {
  return room.price ?? room.monthlyPrice ?? "—";
}
