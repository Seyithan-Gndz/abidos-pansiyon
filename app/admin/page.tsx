import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Yönetim Paneli | Abidos Pansiyon" };

export default async function AdminPage() {
  await requireAdmin();
  return <AdminDashboard/>;
}
