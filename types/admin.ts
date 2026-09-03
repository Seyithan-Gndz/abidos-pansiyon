export type TransactionAction = "Oda Verildi" | "Çıkış Yapıldı" | "Kalış Uzatıldı" | "Fiyat Değiştirildi";
export type UserRole = "admin" | "reception";

export interface MockUser { id: string; name: string; role: UserRole; }
export interface MockGuest { id: string; name: string; }

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
