import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PendingPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.approval_status === "approved") redirect("/");
  return <AuthShell title={profile.approval_status === "rejected" ? "Başvuru reddedildi" : "Yönetici onayı bekleniyor"} description={profile.approval_status === "rejected" ? "Hesabınızın erişimi reddedildi. Bir yöneticiyle iletişime geçin." : "Kaydınız alındı. Bir yönetici hesabınızı onayladığında resepsiyon ekranını kullanabilirsiniz."}><div className="mt-7 flex justify-center"><LogoutButton/></div></AuthShell>;
}
