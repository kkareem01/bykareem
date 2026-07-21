/**
 * Pure slot-generation utilities (ported from the suit store's lib/slots.mjs).
 * All times are wall-clock strings ('HH:MM') in the business timezone
 * (config.timezone). Date strings are 'YYYY-MM-DD'. No Date math that
 * depends on the host machine's timezone.
 */

import type { SlotConfig } from "./types";

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function parseHHMM(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function formatHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Day-of-week (0 Sun .. 6 Sat) for a YYYY-MM-DD string, no tz drift. */
export function dayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Current wall-clock date (YYYY-MM-DD) and time (HH:MM) in an IANA tz. */
export function nowInTz(tz: string, now: Date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(now).map((p) => [p.type, p.value]),
  );
  // 24h formatter sometimes returns "24" for midnight; normalize
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${hour}:${parts.minute}`,
  };
}

/** Compare two YYYY-MM-DD strings lexically (format is ordered). */
export function compareDates(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

/** Every slot the schedule supports for a date, ignoring bookings. */
export function generateSlotsForDate(
  dateStr: string,
  config: SlotConfig,
  audience: string,
): string[] {
  if (config.blackoutDates?.includes(dateStr)) return [];

  const dow = DAY_KEYS[dayOfWeek(dateStr)];
  const hours = config.businessHours?.[dow];
  if (!hours || !hours.open || !hours.close) return [];

  const consult = config.consultTypes?.[audience];
  const duration =
    consult?.slotDurationMinutes ?? config.defaultSlotDurationMinutes ?? 20;
  const buffer = consult?.buffer ?? 0;
  const step = duration + buffer;

  const open = parseHHMM(hours.open);
  const close = parseHHMM(hours.close);

  const slots: string[] = [];
  for (let t = open; t + duration <= close; t += step) {
    slots.push(formatHHMM(t));
  }
  return slots;
}

/**
 * Filter to only slots that are not yet taken and not too soon.
 * @param bookedTimes Set of 'HH:MM' for that date
 */
export function filterAvailableSlots(
  allSlots: string[],
  bookedTimes: Set<string>,
  dateStr: string,
  config: SlotConfig,
  now?: Date,
): string[] {
  const tz = config.timezone;
  const current = nowInTz(tz, now);
  const lead = config.leadTimeMinutes ?? 0;
  const maxAdvance = config.maxAdvanceDays ?? 365;

  if (compareDates(dateStr, current.date) < 0) return [];
  const advanceLimit = addDays(current.date, maxAdvance);
  if (compareDates(dateStr, advanceLimit) > 0) return [];

  const isToday = dateStr === current.date;
  const earliestToday = parseHHMM(current.time) + lead;

  return allSlots.filter((time) => {
    if (bookedTimes.has(time)) return false;
    if (isToday && parseHHMM(time) < earliestToday) return false;
    // lead time can also push into tomorrow (and beyond) when it exceeds
    // the remaining minutes of today
    if (!isToday) {
      const minsUntilSlot =
        dateDiffDays(current.date, dateStr) * 24 * 60 +
        parseHHMM(time) -
        parseHHMM(current.time);
      if (minsUntilSlot < lead) return false;
    }
    return true;
  });
}

function dateDiffDays(a: string, b: string): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const utcA = Date.UTC(ay, am - 1, ad);
  const utcB = Date.UTC(by, bm - 1, bd);
  return Math.round((utcB - utcA) / 86_400_000);
}

/**
 * Every date in (year, month) with a flag for whether any slot is open.
 * bookingsByDate is a Map<date, Set<time>>.
 */
export function listMonth(
  year: number,
  month: number,
  config: SlotConfig,
  audience: string,
  bookingsByDate: Map<string, Set<string>>,
  now?: Date,
) {
  const days = daysInMonth(year, month);
  const out: { date: string; hasOpenSlots: boolean }[] = [];
  for (let d = 1; d <= days; d++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const all = generateSlotsForDate(date, config, audience);
    const booked = bookingsByDate.get(date) ?? new Set<string>();
    const open = filterAvailableSlots(all, booked, date, config, now);
    out.push({ date, hasOpenSlots: open.length > 0 });
  }
  return out;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}
