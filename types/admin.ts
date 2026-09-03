export type TransactionAction = "Oda Verildi" | "Çıkış Yapıldı" | "Kalış Uzatıldı" | "Fiyat Değiştirildi";
export interface AdminSummary {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: number;
  todayAccommodation: number;
  pendingCollection: number;
}

export interface FloorStatus { floor: number; total: number; occupied: number; available: number; outOfService: number; }

export interface AuditLog<T = unknown> {
  id: string;
  action: TransactionAction;
  roomNumber: number;
  user: string;
  timestamp: string;
  oldValue?: T;
  newValue?: T;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  amount?: number;
}

export interface CashSummaryData { todayCollection: number; cash: number; card: number; pendingPayment: number; dailyTotal: number; }

export interface CashEntry {
  id: string;
  room_id: string;
  room_number: number;
  guest_name: string;
  amount: number;
  payment_method: "cash" | "card" | "receivable";
  check_in_date: string;
  check_out_date: string | null;
  created_by: string;
  created_at: string;
}

export interface AuditEntry {
  id: number;
  action: "room_created" | "room_updated" | "check_in" | "check_out" | "staff_updated" | "settings_updated";
  entity_type: string;
  entity_id: string;
  room_number: number | null;
  details: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
  actor_name?: string;
}
