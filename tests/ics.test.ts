import { describe, expect, it } from "vitest";
import { buildICS, wallClockInTzToUtc } from "@/lib/booking/ics";

const base = {
  id: "BK-ABCD1234",
  durationMinutes: 30,
  tz: "America/New_York",
  summary: "bykareem — Consult",
  description: "Free consult call.",
  uidDomain: "bykareem.com",
};

describe("wallClockInTzToUtc", () => {
  it("converts EDT wall clock (May, UTC-4)", () => {
    const utc = wallClockInTzToUtc("2026-05-15", "14:00", "America/New_York");
    expect(utc.toISOString()).toBe("2026-05-15T18:00:00.000Z");
  });

  it("converts EST wall clock (February, UTC-5)", () => {
    const utc = wallClockInTzToUtc("2026-02-15", "14:00", "America/New_York");
    expect(utc.toISOString()).toBe("2026-02-15T19:00:00.000Z");
  });
});

describe("buildICS", () => {
  it("emits required RFC-5545 structure with CRLF endings", () => {
    const ics = buildICS({
      ...base,
      slot: { date: "2026-05-15", time: "14:00" },
    });
    expect(ics).toContain("BEGIN:VCALENDAR\r\n");
    expect(ics).toContain("BEGIN:VEVENT\r\n");
    expect(ics).toContain("UID:BK-ABCD1234@bykareem.com\r\n");
    expect(ics).toContain("DTSTART:20260515T180000Z\r\n");
    expect(ics).toContain("DTEND:20260515T183000Z\r\n");
    expect(ics).toContain("STATUS:CONFIRMED\r\n");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("escapes commas, semicolons, and newlines in text fields", () => {
    const ics = buildICS({
      ...base,
      slot: { date: "2026-05-15", time: "14:00" },
      summary: "Consult; with, punctuation",
      description: "Line one\nLine two",
    });
    expect(ics).toContain("SUMMARY:Consult\\; with\\, punctuation");
    expect(ics).toContain("DESCRIPTION:Line one\\nLine two");
  });

  it("folds lines longer than 75 octets", () => {
    const ics = buildICS({
      ...base,
      slot: { date: "2026-05-15", time: "14:00" },
      description: "x".repeat(200),
    });
    for (const line of ics.split("\r\n")) {
      expect(Buffer.from(line, "utf8").length).toBeLessThanOrEqual(75);
    }
  });
});
