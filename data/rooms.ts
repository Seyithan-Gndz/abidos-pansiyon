import type { Room } from "@/types/room";

export const FLOORS = [5, 4, 3, 2, 1] as const;

export const rooms: Room[] = [
  { id:"room-501", roomNumber:501, floor:5, capacity:1, bedInfo:"Uzun süreli konaklama", monthlyPrice:"12.000 ₺ / ay", note:"8 yıldır konaklıyor", status:"occupied", stay:{guestName:"Mustafa Öner",checkInDate:"2018-09-01",checkOutDate:null,nights:"monthly",guestCount:1,appliedPrice:"12.000 ₺ / ay",note:"Uzun süreli misafir"}},
  { id:"room-502", roomNumber:502, floor:5, capacity:3, bedInfo:"2 tekli yatak", monthlyPrice:"15.000–25.000 ₺ / ay", note:"Çatı katı; fiyat kişi sayısına göre değişir", status:"available"},
  { id:"room-401", roomNumber:401, floor:4, capacity:5, bedInfo:"5 tekli yatak", price:"4.000–5.500 ₺", status:"available"},
  { id:"room-402", roomNumber:402, floor:4, capacity:2, bedInfo:"1 duble yatak", price:"2.000–2.500 ₺", note:"1 tekli yatak ilave edilebilir", status:"available"},
  { id:"room-403", roomNumber:403, floor:4, capacity:4, bedInfo:"1 duble + 2 tekli yatak", price:"3.000–4.500 ₺", status:"occupied", stay:{guestName:"Osman Tekdal",checkInDate:"2026-09-01",checkOutDate:"2026-09-04",nights:3,guestCount:3,appliedPrice:"3.800 ₺",note:"Geç giriş yapacak"}},
  { id:"room-404", roomNumber:404, floor:4, capacity:2, bedInfo:"1 duble yatak", price:"2.000–2.500 ₺", note:"1 tekli yatak ilave edilebilir", status:"available"},
  { id:"room-301", roomNumber:301, floor:3, capacity:3, bedInfo:"3 tekli yatak", price:"2.500–3.000 ₺", note:"Banyo/WC içeride", status:"available"},
  { id:"room-302", roomNumber:302, floor:3, capacity:2, bedInfo:"2 tekli yatak", price:"2.000–2.500 ₺", note:"Banyo/WC içeride", status:"occupied", stay:{guestName:"Halil Gündüz",checkInDate:"2026-09-02",checkOutDate:"2026-09-04",nights:2,guestCount:2,appliedPrice:"2.200 ₺"}},
  { id:"room-303", roomNumber:303, floor:3, capacity:3, bedInfo:"3 tekli yatak", price:"2.500–3.000 ₺", note:"Banyo/WC içeride", status:"available"},
  { id:"room-304", roomNumber:304, floor:3, capacity:4, bedInfo:"4 tekli yatak", price:"2.500–4.500 ₺", status:"available"},
  { id:"room-305", roomNumber:305, floor:3, capacity:1, bedInfo:"1 tekli yatak", price:"1.250–1.500 ₺", monthlyPrice:"17.500 ₺ / ay", status:"available"},
  { id:"room-306", roomNumber:306, floor:3, capacity:2, bedInfo:"2 tekli yatak", price:"1.800–2.500 ₺", note:"Banyo/WC kapının karşısında", status:"available"},
  { id:"room-201", roomNumber:201, floor:2, capacity:3, bedInfo:"3 tekli yatak", price:"2.500–3.000 ₺", note:"Banyo/WC içeride", status:"available"},
  { id:"room-202", roomNumber:202, floor:2, capacity:2, bedInfo:"2 tekli yatak", price:"2.000–2.500 ₺", note:"Banyo/WC içeride", status:"available"},
  { id:"room-203", roomNumber:203, floor:2, capacity:3, bedInfo:"3 tekli yatak", price:"2.500–3.000 ₺", note:"Banyo/WC içeride", status:"available"},
  { id:"room-204", roomNumber:204, floor:2, capacity:4, bedInfo:"4 tekli yatak", price:"2.500–4.500 ₺", status:"occupied", stay:{guestName:"Mehmet Gündüz",checkInDate:"2026-08-31",checkOutDate:"2026-09-05",nights:5,guestCount:4,appliedPrice:"4.200 ₺",note:"Sessiz oda rica edildi"}},
  { id:"room-205", roomNumber:205, floor:2, capacity:1, bedInfo:"Uzun süreli konaklama", monthlyPrice:"13.000 ₺ / ay", note:"Aylık verilmiş; uzun süreli kullanım", status:"occupied", stay:{guestName:"Mustafa Öner",checkInDate:"2026-01-10",checkOutDate:null,nights:"monthly",guestCount:1,appliedPrice:"13.000 ₺ / ay",note:"Uzun süreli kullanım"}},
  { id:"room-206", roomNumber:206, floor:2, capacity:2, bedInfo:"2 tekli yatak", price:"1.800–2.500 ₺", note:"Banyo/WC kapının karşısında", status:"available"},
  { id:"room-101", roomNumber:101, floor:1, capacity:2, bedInfo:"—", note:"Şu an depo olarak kullanılıyor", status:"out_of_service"},
  { id:"room-102", roomNumber:102, floor:1, capacity:2, bedInfo:"Oda yatağı", price:"Yaklaşık 1.500 ₺", status:"available"},
  { id:"room-103", roomNumber:103, floor:1, capacity:2, bedInfo:"Oda yatağı", price:"Yaklaşık 1.500 ₺", status:"available"},
  { id:"room-104", roomNumber:104, floor:1, capacity:4, bedInfo:"4 tekli yatak", price:"2.500–4.500 ₺", status:"available"},
];
