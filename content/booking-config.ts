/**
 * Booking system configuration — consult-call availability, slot rules,
 * and honest scarcity numbers. Edit here; no code changes needed.
 */

export type DayHours = { open: string; close: string } | null;

export type BookingConfig = {
  timezone: string;
  businessHours: Record<
    "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat",
    DayHours
  >;
  blackoutDates: string[];
  consultTypes: Record<
    string,
    { label: string; slotDurationMinutes: number; buffer: number }
  >;
  defaultSlotDurationMinutes: number;
  /** minimum notice before a slot can be booked (12h) */
  leadTimeMinutes: number;
  maxAdvanceDays: number;
};

export const bookingConfig: BookingConfig = {
  timezone: "America/New_York",
  // Side-hustle hours: weekday evenings + weekend days.
  businessHours: {
    sun: { open: "10:00", close: "18:00" },
    mon: { open: "18:00", close: "21:00" },
    tue: { open: "18:00", close: "21:00" },
    wed: { open: "18:00", close: "21:00" },
    thu: { open: "18:00", close: "21:00" },
    fri: { open: "18:00", close: "21:00" },
    sat: { open: "10:00", close: "18:00" },
  },
  blackoutDates: [],
  consultTypes: {
    couples: { label: "Weddings & Engagements", slotDurationMinutes: 30, buffer: 15 },
    // Graduation books the session itself, not a call — 90 min + the
    // Closing Fifteen, with travel/reset buffer between sessions.
    graduation: { label: "Graduation Session", slotDurationMinutes: 105, buffer: 30 },
    general: { label: "Other", slotDurationMinutes: 20, buffer: 10 },
  },
  defaultSlotDurationMinutes: 30,
  leadTimeMinutes: 720,
  maxAdvanceDays: 60,
};

/** Honest scarcity — keep these true. Rendered on offer pages + hero. */
export const capacity = {
  seasonLabel: "the 2026–27 season",
  weddingDatesRemaining: 7,
  gradSlotsRemaining: 12,
} as const;
