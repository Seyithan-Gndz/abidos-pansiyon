import type { Metadata } from "next";
import { RoomPlan } from "@/components/RoomPlan";

export const metadata: Metadata = { title: "Oda Planı | Abidos Pansiyon" };
export default function ReceptionPage() { return <RoomPlan/>; }
