/**
 * RFC-5545 ICS builder, no dependencies (ported from the suit store).
 * slot.date + slot.time are wall-clock in the business IANA timezone;
 * conversion to UTC is DST-safe via Intl's longOffset.
 */

type IcsInput = {
  id: string;
  slot: { date: string; time: string };
  durationMinutes: number;
  tz: string;
  summary: string;
  description: string;
  location?: string;
  uidDomain: string;
};

/** UTC offset in minutes for a wall-clock instant in an IANA tz. */
function tzOffsetMinutes(tz: string, utcGuess: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "longOffset",
  });
  const part = fmt
    .formatToParts(utcGuess)
    .find((p) => p.type === "timeZoneName");
  const m = part?.value.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0; // "GMT" exactly = UTC
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3]));
}

/** Convert wall-clock (date, time) in tz to a UTC Date. */
export function wallClockInTzToUtc(
  date: string,
  time: string,
  tz: string,
): Date {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const naiveUtc = Date.UTC(y, mo - 1, d, h, mi);
  // Two-pass: offset at the guess, then re-evaluate at the corrected instant
  // so DST transitions land on the right side.
  const offset1 = tzOffsetMinutes(tz, new Date(naiveUtc));
  const guess = naiveUtc - offset1 * 60_000;
  const offset2 = tzOffsetMinutes(tz, new Date(guess));
  return new Date(naiveUtc - offset2 * 60_000);
}

function toIcsUtc(dt: Date): string {
  return dt
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold lines longer than 75 octets per RFC 5545 §3.1. */
function foldLine(line: string): string {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let start = 0;
  while (start < bytes.length) {
    // leave room for the leading space on continuation lines
    const width = start === 0 ? 75 : 74;
    let end = Math.min(start + width, bytes.length);
    // don't split a multi-byte character
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) {
      end--;
    }
    const chunk = bytes.subarray(start, end).toString("utf8");
    out.push(start === 0 ? chunk : ` ${chunk}`);
    start = end;
  }
  return out.join("\r\n");
}

export function buildICS(input: IcsInput): string {
  const start = wallClockInTzToUtc(input.slot.date, input.slot.time, input.tz);
  const end = new Date(start.getTime() + input.durationMinutes * 60_000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//bykareem//booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${input.id}@${input.uidDomain}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(input.summary)}`,
    `DESCRIPTION:${escapeIcsText(input.description)}`,
    ...(input.location ? [`LOCATION:${escapeIcsText(input.location)}`] : []),
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}
