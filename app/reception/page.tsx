import type { Metadata } from "next";
import { RoomPlan } from "@/components/RoomPlan";
import { requireApprovedUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Oda Planı | Abidos Pansiyon" };
export default async function ReceptionPage() {
  const profile = await requireApprovedUser();
  return <RoomPlan profile={profile}/>;
}
