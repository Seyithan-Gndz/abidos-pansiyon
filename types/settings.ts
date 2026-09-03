export interface BusinessSettings {
  id: number;
  business_name: string;
  phone: string;
  address: string;
  check_in_time: string;
  check_out_time: string;
  currency: string;
}

export type SettingsActionState = { error?: string; success?: string } | null;

