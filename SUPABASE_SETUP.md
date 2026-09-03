# Supabase ve Vercel kurulumu

## 1. Supabase projesi

1. Supabase üzerinde yeni bir proje oluşturun.
2. **SQL Editor** bölümünde `supabase/schema.sql` dosyasının tamamını çalıştırın.
3. **Authentication > URL Configuration** bölümünde:
   - Site URL alanına Vercel üretim adresini yazın.
   - Redirect URLs listesine üretim adresini ve yerel geliştirme için `http://localhost:3000/**` adresini ekleyin.
4. **Authentication > Email** altında e-posta/parola sağlayıcısının açık olduğunu doğrulayın.

## 2. Ortam değişkenleri

Supabase **Project Settings > API** ekranından URL ve publishable key değerlerini alın.

Yerel geliştirme için `.env.local` oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJE.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=PUBLISHABLE_KEY
```

Aynı iki değişkeni Vercel projesinde **Settings > Environment Variables** alanına ekleyin ve yeniden deploy edin. `service_role` anahtarı bu uygulamada kullanılmaz ve tarayıcıya kesinlikle verilmemelidir.

## 3. İlk admin

1. Yayındaki `/signup` sayfasından ilk hesabı oluşturun.
2. Supabase SQL Editor içinde aşağıdaki sorguyu, gerçek e-postayı yazarak çalıştırın:

```sql
update public.profiles
set role = 'admin', approval_status = 'approved'
where email = 'admin@ornek.com';
```

3. Çıkış yapıp yeniden giriş yapın. Bu hesap `/admin` sayfasından resepsiyon başvurularını onaylayabilir.

Veritabanı tetikleyicisi admin sayısını en fazla 3 hesapla sınırlar. Yeni kayıtlar varsayılan olarak `reception / pending` oluşturulur. Onaylanmamış veya reddedilmiş hesaplar oda verilerine erişemez.

## Yetki özeti

| Hesap durumu | Yönetim paneli | Resepsiyon | Oda verisi |
| --- | --- | --- | --- |
| Admin / onaylı | Evet | Evet | Okuma ve güncelleme |
| Resepsiyon / onaylı | Hayır | Evet | Okuma ve güncelleme |
| Resepsiyon / beklemede veya reddedilmiş | Hayır | Hayır | Erişim yok |

