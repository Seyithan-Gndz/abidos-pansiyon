import { createClient } from "@/lib/supabase/client";
import type { Room, StayDetails } from "@/types/room";

export interface RoomRepository {
  list(): Promise<Room[]>;
  checkIn(current: Room[], roomId: string, stay: StayDetails): Promise<Room[]>;
  checkOut(current: Room[], roomId: string): Promise<Room[]>;
}

class SupabaseRoomRepository implements RoomRepository {
  async list() {
    const { data, error } = await createClient().from("rooms").select("data").order("room_number");
    if (error) throw new Error("Odalar yüklenemedi: " + error.message);
    return data.map((row) => row.data as Room);
  }

  async checkIn(current: Room[], roomId: string, stay: StayDetails) {
    return this.save(current, roomId, { status: "occupied", stay });
  }

  async checkOut(current: Room[], roomId: string) {
    return this.save(current, roomId, { status: "available", stay: undefined });
  }

  private async save(current: Room[], roomId: string, changes: Partial<Room>) {
    const next = current.map((room) => room.id === roomId ? { ...room, ...changes } : room);
    const changed = next.find((room) => room.id === roomId);
    if (!changed) throw new Error("Oda bulunamadı.");
    const { error } = await createClient().from("rooms").update({ data: changed }).eq("id", roomId);
    if (error) throw new Error("Oda güncellenemedi: " + error.message);
    return next;
  }
}

export const roomRepository: RoomRepository = new SupabaseRoomRepository();
