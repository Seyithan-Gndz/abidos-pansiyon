import { rooms as mockRooms } from "@/data/rooms";
import type { Room, StayDetails } from "@/types/room";

const STORAGE_KEY = "abidos-room-plan-v4";

export interface RoomRepository {
  list(): Promise<Room[]>;
  checkIn(current: Room[], roomId: string, stay: StayDetails): Promise<Room[]>;
  checkOut(current: Room[], roomId: string): Promise<Room[]>;
}

class LocalRoomRepository implements RoomRepository {
  async list() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as Room[] : structuredClone(mockRooms);
    } catch { return structuredClone(mockRooms); }
  }

  async checkIn(current: Room[], roomId: string, stay: StayDetails) {
    return this.save(current.map(room => room.id === roomId ? { ...room, status: "occupied" as const, stay } : room));
  }

  async checkOut(current: Room[], roomId: string) {
    return this.save(current.map(room => room.id === roomId ? { ...room, status: "available" as const, stay: undefined } : room));
  }

  private async save(next: Room[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
}

// İleride ApiRoomRepository ile değiştirilecek tek bağımlılık noktası.
export const roomRepository: RoomRepository = new LocalRoomRepository();
