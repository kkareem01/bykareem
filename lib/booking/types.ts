import type { BookingConfig } from "@/content/booking-config";

export type ConsultType = "couples" | "graduation" | "general";

export type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  consent: true;
};

export type Slot = {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  tz: string;
};

export type Attribution = {
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  utmJson: string | null;
  landingPage: string | null;
  referrer: string | null;
};

export type Booking = {
  id: string;
  audience: ConsultType;
  customer: Customer;
  answers: Record<string, string>;
  slot: Slot;
  displayTimezone: string | null;
  consent: boolean;
  ip: string | null;
  userAgent: string | null;
  emailStatus: string | null;
  emailDetail: string | null;
  staffStatus: string;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  utm: Record<string, string> | null;
  landingPage: string | null;
  referrer: string | null;
  createdAt: string;
};

export type BookingCreateRecord = {
  audience: ConsultType;
  customer: Customer;
  answers: Record<string, string>;
  slot: Slot;
  displayTimezone: string | null;
  consent: boolean;
  ip: string | null;
  userAgent: string | null;
  emailStatus: string;
} & Partial<Attribution>;

export type SlotConfig = BookingConfig;

export type Ok<T> = { ok: true; value: T };
export type Bad = { ok: false; errors: string[] };
export type Validated<T> = Ok<T> | Bad;
