import type { AdminSummary, AuditLog, CashSummaryData, FloorStatus, MockGuest, MockUser } from "@/types/admin";

export const mockUsers: MockUser[] = [
  { id:"user-admin-1", name:"Seyithan Gündüz", role:"admin" },
  { id:"user-reception-1", name:"Mehmet Gündüz", role:"reception" },
];
export const mockGuests: MockGuest[] = [
  { id:"guest-1", name:"Mustafa Öner" }, { id:"guest-2", name:"Osman Tekdal" },
  { id:"guest-3", name:"Halil Gündüz" }, { id:"guest-4", name:"Mehmet Gündüz" },
];

export const adminSummary: AdminSummary = { totalRooms:22, occupiedRooms:7, availableRooms:14, occupancyRate:32, todayAccommodation:28750, pendingCollection:8400 };
export const floorStatuses: FloorStatus[] = [
  { floor:5,total:2,occupied:2,available:0,outOfService:0 }, { floor:4,total:4,occupied:2,available:2,outOfService:0 },
  { floor:3,total:6,occupied:1,available:5,outOfService:0 }, { floor:2,total:6,occupied:2,available:4,outOfService:0 },
  { floor:1,total:4,occupied:0,available:3,outOfService:1 },
];
export const recentTransactions: AuditLog[] = [
  { id:"log-1",timestamp:"2026-09-02T14:32:00",roomNumber:402,action:"Oda Verildi",checkIn:"2026-09-02",checkOut:"2026-09-05",nights:3,amount:6000,user:"Mehmet Gündüz",newValue:{status:"occupied"} },
  { id:"log-2",timestamp:"2026-09-02T12:18:00",roomNumber:304,action:"Çıkış Yapıldı",checkIn:"2026-08-30",checkOut:"2026-09-02",nights:3,amount:9900,user:"Mehmet Gündüz",oldValue:{status:"occupied"},newValue:{status:"available"} },
  { id:"log-3",timestamp:"2026-09-02T10:45:00",roomNumber:203,action:"Kalış Uzatıldı",checkIn:"2026-08-31",checkOut:"2026-09-04",nights:4,amount:10000,user:"Mehmet Gündüz",oldValue:{nights:2},newValue:{nights:4} },
  { id:"log-4",timestamp:"2026-09-01T18:06:00",roomNumber:501,action:"Fiyat Değiştirildi",checkIn:"2018-09-01",nights:undefined,amount:12000,user:"Seyithan Gündüz",oldValue:{monthlyPrice:11000},newValue:{monthlyPrice:12000} },
  { id:"log-5",timestamp:"2026-09-01T16:20:00",roomNumber:403,action:"Oda Verildi",checkIn:"2026-09-01",checkOut:"2026-09-04",nights:3,amount:11400,user:"Mehmet Gündüz",newValue:{status:"occupied"} },
];
export const cashSummary: CashSummaryData = { todayCollection:24350,cash:9850,card:14500,pendingPayment:8400,dailyTotal:32750 };
