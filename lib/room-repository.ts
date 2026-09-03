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
    const { error } = await createClient().rpc("check_in_room", {
      p_room_id: roomId,
      p_stay: stay,
      p_amount: stay.paymentAmount ?? 0,
      p_payment_method: stay.paymentMethod ?? "receivable",
    });
    if (error) throw new Error("Oda verilemedi: " + error.message);
    return current.map((room) => room.id === roomId ? { ...room, status: "occupied" as const, stay } : room);
  }

  async checkOut(current: Room[], roomId: string) {
    const { error } = await createClient().rpc("check_out_room", { p_room_id: roomId });
    if (error) throw new Error("Çıkış yapılamadı: " + error.message);
    return current.map((room) => room.id === roomId ? { ...room, status: "available" as const, stay: undefined } : room);
  }
}

export const roomRepository: RoomRepository = new SupabaseRoomRepository();
