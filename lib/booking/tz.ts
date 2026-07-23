/**
 * Timezone helpers for the booking calendar — ported from the GA Suit
 * Warehouse booking-calendar. Slot times arrive from the API in the business
 * (store) timezone; these convert them for display in the visitor's own zone.
 */

const COMMON_TZ = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Kolkata",
  "Australia/Sydney",
] as const;

/** Minutes east of UTC for `tz` at the given instant. */
function tzOffsetMinutes(tz: string, instant: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "longOffset",
  });
  const parts = fmt.formatToParts(instant);
  const off =
    parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+00:00";
  const m = off.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
  if (!m) return 0;
  const sign = m[1] === "+" ? 1 : -1;
  return sign * (parseInt(m[2], 10) * 60 + parseInt(m[3] ?? "0", 10));
}

/**
 * Convert a store-local wall-clock time (`"HH:MM"` on `date`) into the
 * visitor's timezone. Returns `"HH:MM"` (24h) in `userTz`.
 */
export function convertSlotToUserTz(
  date: string,
  time: string,
  storeTz: string,
  userTz: string,
): string {
  if (storeTz === userTz) return time;
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const asIfUtc = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
  const offMinStore = tzOffsetMinutes(storeTz, asIfUtc);
  const realUtc = new Date(asIfUtc.getTime() - offMinStore * 60 * 1000);
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: userTz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(realUtc).map((p) => [p.type, p.value]),
  );
  const h = parts.hour === "24" ? "00" : parts.hour;
  return `${h}:${parts.minute}`;
}

/** The visitor's own timezone, falling back to Eastern. */
export function browserTimezone(): string {
  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone ?? "America/New_York"
    );
  } catch {
    return "America/New_York";
  }
}

/** A de-duplicated list of selectable timezones, current one first. */
export function buildTzList(currentTz: string): string[] {
  const set = new Set<string>([currentTz, ...COMMON_TZ]);
  const withOf = Intl as unknown as {
    supportedValuesOf?: (k: string) => string[];
  };
  if (typeof withOf.supportedValuesOf === "function") {
    try {
      const supported = withOf.supportedValuesOf("timeZone");
      if (supported.length > 0) return supported;
    } catch {
      /* fall through to the common list */
    }
  }
  return Array.from(set);
}

/** "America/New_York" → "America/New York (GMT-5)" for the selector. */
export function formatTzLabel(tz: string, refDate: Date): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const off =
      fmt.formatToParts(refDate).find((p) => p.type === "timeZoneName")
        ?.value ?? "";
    return `${tz.replace("_", " ")} (${off})`;
  } catch {
    return tz;
  }
}

/** "2026-07-24" → "Fri, Jul 24" (UTC-anchored). */
export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
