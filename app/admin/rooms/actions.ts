"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Room, RentalType } from "@/types/room";
import type { SettingsActionState } from "@/types/settings";

export async function updateRoomDefinition(
  _: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const roomNumber = Number(formData.get("roomNumber"));
  const floor = Number(formData.get("floor"));
  const capacity = Number(formData.get("capacity"));
  const bedInfo = String(formData.get("bedInfo") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();
  const rentalType = String(formData.get("rentalType") ?? "daily") as RentalType;
  const rate = String(formData.get("rate") ?? "").trim();

  if (!id || !Number.isInteger(roomNumber) || roomNumber < 1) return { error: "Geçerli bir oda numarası girin." };
  if (!Number.isInteger(floor) || floor < 1 || floor > 20) return { error: "Kat bilgisi 1-20 arasında olmalıdır." };
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 20) return { error: "Kapasite 1-20 kişi arasında olmalıdır." };
  if (bedInfo.length < 2) return { error: "Yatak bilgisi zorunludur." };
  if (!["daily", "monthly"].includes(rentalType)) return { error: "Konaklama türü geçersiz." };
  if (!rate) return { error: "Fiyat bilgisi zorunludur." };

  const supabase = await createClient();
  const { data: row, error: readError } = await supabase.from("rooms").select("data").eq("id", id).single();
  if (readError || !row) return { error: "Oda bulunamadı." };

  const current = row.data as Room;
  const updated: Room = {
    ...current,
    roomNumber,
    floor,
    capacity,
    bedInfo,
    note: note || undefined,
    rentalType,
    price: rentalType === "daily" ? rate : undefined,
    monthlyPrice: rentalType === "monthly" ? rate : undefined,
    status: current.status,
    stay: current.stay,
  };

  const { error } = await supabase.from("rooms").update({ room_number: roomNumber, floor, data: updated }).eq("id", id);
  if (error) {
    const message = error.code === "23505" ? "Bu oda numarası başka bir odada kullanılıyor." : error.message;
    return { error: `Oda kaydedilemedi: ${message}` };
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/reception");
  return { success: `${roomNumber} numaralı oda güncellendi.` };
}

