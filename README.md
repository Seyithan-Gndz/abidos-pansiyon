# Abidos Pansiyon — Oda Planı

Next.js App Router, TypeScript ve Tailwind CSS ile hazırlanmış tıklanabilir resepsiyon oda planı demosu. Şimdilik veriler tarayıcıdaki `localStorage` içinde saklanır.

## Çalıştırma

```bash
npm install
npm run dev
```

Üretim derlemesi: `npm run build`

## Mimari ve backend'e geçiş

Arayüz bileşenleri veri kaynağından ayrıdır. Mock oda tanımları `data/rooms.ts`, domain tipleri `types/room.ts`, tüm okuma ve durum değiştirme işlemleri ise `lib/room-repository.ts` içindedir. Backend hazır olduğunda `RoomRepository` sözleşmesini uygulayan bir API adaptörü eklenir; UI bileşenleri değişmez.

Beklenen temel oda modeli:

```js
{
  id: "room-403",
  roomNumber: 403,
  floor: 4,
  capacity: 4,
  bedInfo: "1 duble + 2 tekli yatak",
  price: "3.000–4.500 ₺",
  note: "",
  status: "available | occupied | out_of_service",
  stay: null // veya giriş/çıkış ve konaklama bilgileri
}
```

İleride fiyatların hesaplamalarda kullanılacağı aşamada gösterim metni yerine `amount`, `currency`, `period` gibi ayrı alanlar kullanılmalıdır.
