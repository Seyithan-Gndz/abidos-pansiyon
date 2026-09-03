export type RoomStatus = "available" | "occupied" | "out_of_service";
export type RentalType = "daily" | "monthly";

export interface StayDetails {
  guestName?: string;
  checkInDate: string;
  checkOutDate: string | null;
  nights: number | "monthly";
  guestCount: number;
  appliedPrice: string;
  note?: string;
}

export interface Room {
  id: string;
  roomNumber: number;
  floor: number;
  capacity: number;
  bedInfo: string;
  rentalType?: RentalType;
  price?: string;
  monthlyPrice?: string;
  status: RoomStatus;
  note?: string;
  stay?: StayDetails;
}

export interface CheckInInput {
  guestName: string;
  checkInDate: string;
  nights: number;
  guestCount: number;
  appliedPrice: string;
  note?: string;
}
