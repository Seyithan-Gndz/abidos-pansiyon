import { AuthShell } from "@/components/auth/AuthShell";

export default function SetupPage() {
  return <AuthShell title="Supabase kurulumu gerekli" description="Supabase projesini oluşturun, supabase/schema.sql dosyasını SQL Editor içinde çalıştırın ve Vercel ortam değişkenlerine NEXT_PUBLIC_SUPABASE_URL ile NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY değerlerini ekleyin."><p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">Kurulum tamamlandıktan sonra uygulamayı yeniden yayınlayın.</p></AuthShell>;
}

