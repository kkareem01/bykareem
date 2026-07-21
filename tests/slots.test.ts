import { describe, expect, it } from "vitest";
import {
  addDays,
  compareDates,
  dayOfWeek,
  daysInMonth,
  filterAvailableSlots,
  generateSlotsForDate,
  listMonth,
  nowInTz,
} from "@/lib/booking/slots";
import type { SlotConfig } from "@/lib/booking/types";

/**
 * Fixed reference config — mirrors the real shape but stays independent of
 * content/booking-config.ts so edits there never break these tests.
 */
const config: SlotConfig = {
  timezone: "America/New_York",
  businessHours: {
    sun: { open: "10:00", close: "18:00" },
    mon: { open: "18:00", close: "21:00" },
    tue: { open: "18:00", close: "21:00" },
    wed: null,
    thu: { open: "18:00", close: "21:00" },
    fri: { open: "18:00", close: "21:00" },
    sat: { open: "10:00", close: "18:00" },
  },
  blackoutDates: ["2026-08-01"],
  consultTypes: {
    couples: { label: "Couples", slotDurationMinutes: 30, buffer: 15 },
    graduation: { label: "Grad", slotDurationMinutes: 20, buffer: 10 },
  },
  defaultSlotDurationMinutes: 30,
  leadTimeMinutes: 720,
  maxAdvanceDays: 60,
};

// 2026-07-20 is a Monday.
const MONDAY = "2026-07-20";
const TUESDAY = "2026-07-21";
const WEDNESDAY = "2026-07-22";
const SATURDAY = "2026-07-25";

/** A Date whose New York wall clock is 12:00 on MONDAY (EDT, UTC-4). */
const NOON_MONDAY_NY = new Date("2026-07-20T16:00:00Z");

describe("dayOfWeek", () => {
  it("maps YYYY-MM-DD to 0=Sun..6=Sat without tz drift", () => {
    expect(dayOfWeek(MONDAY)).toBe(1);
    expect(dayOfWeek(SATURDAY)).toBe(6);
    expect(dayOfWeek("2026-07-26")).toBe(0);
  });
});

describe("nowInTz", () => {
  it("returns wall-clock date and time in the given tz", () => {
    expect(nowInTz("America/New_York", NOON_MONDAY_NY)).toEqual({
      date: "2026-07-20",
      time: "12:00",
    });
  });

  it("normalizes midnight to 00, never 24", () => {
    // 05:00 UTC in January = 00:00 EST
    const midnightNy = new Date("2026-01-15T05:00:00Z");
    expect(nowInTz("America/New_York", midnightNy)).toEqual({
      date: "2026-01-15",
      time: "00:00",
    });
  });
});

describe("compareDates / addDays / daysInMonth", () => {
  it("compares ISO date strings", () => {
    expect(compareDates("2026-07-20", "2026-07-21")).toBe(-1);
    expect(compareDates("2026-07-21", "2026-07-20")).toBe(1);
    expect(compareDates("2026-07-20", "2026-07-20")).toBe(0);
  });

  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-07-30", 3)).toBe("2026-08-02");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("knows month lengths including leap February", () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2028, 2)).toBe(29);
    expect(daysInMonth(2026, 7)).toBe(31);
  });
});

describe("generateSlotsForDate", () => {
  it("steps by duration + buffer and stops when a slot would overrun close", () => {
    // Saturday 10:00–18:00, 30min + 15 buffer → 45min step, last start 17:30
    const slots = generateSlotsForDate(SATURDAY, config, "couples");
    expect(slots[0]).toBe("10:00");
    expect(slots[1]).toBe("10:45");
    expect(slots[slots.length - 1]).toBe("17:30");
    expect(slots).toHaveLength(11);
  });

  it("uses the per-consult-type duration", () => {
    // Monday 18:00–21:00, 20min + 10 buffer → 30min step, last start 20:30
    const slots = generateSlotsForDate(MONDAY, config, "graduation");
    expect(slots).toEqual([
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
    ]);
  });

  it("falls back to the default duration for unknown consult types", () => {
    // 30min duration, no buffer → 30min step from 18:00, last start 20:30
    const slots = generateSlotsForDate(MONDAY, config, "mystery");
    expect(slots[0]).toBe("18:00");
    expect(slots[slots.length - 1]).toBe("20:30");
  });

  it("returns nothing for closed days and blackout dates", () => {
    expect(generateSlotsForDate(WEDNESDAY, config, "couples")).toEqual([]);
    expect(generateSlotsForDate("2026-08-01", config, "couples")).toEqual([]);
  });
});

describe("filterAvailableSlots", () => {
  const monday = generateSlotsForDate(MONDAY, config, "couples");

  it("drops already-booked times", () => {
    const noLead: SlotConfig = { ...config, leadTimeMinutes: 0 };
    const open = filterAvailableSlots(
      monday,
      new Set(["18:00"]),
      MONDAY,
      noLead,
      NOON_MONDAY_NY,
    );
    expect(open).not.toContain("18:00");
    expect(open).toContain("18:45");
  });

  it("returns nothing for past dates", () => {
    const open = filterAvailableSlots(
      monday,
      new Set(),
      "2026-07-19",
      config,
      NOON_MONDAY_NY,
    );
    expect(open).toEqual([]);
  });

  it("returns nothing beyond maxAdvanceDays", () => {
    // 61 days past MONDAY, a Saturday-generating config day is irrelevant —
    // the advance-limit check fires first.
    const far = addDays(MONDAY, 61);
    const open = filterAvailableSlots(
      generateSlotsForDate(far, config, "couples"),
      new Set(),
      far,
      config,
      NOON_MONDAY_NY,
    );
    expect(open).toEqual([]);
  });

  it("applies lead time to today's remaining slots", () => {
    // At noon with 12h lead, every evening slot today is too soon.
    const open = filterAvailableSlots(
      monday,
      new Set(),
      MONDAY,
      config,
      NOON_MONDAY_NY,
    );
    expect(open).toEqual([]);
  });

  it("lets lead time spill into tomorrow", () => {
    // Tuesday 18:00 is 30h away from Monday noon → clears the 12h lead.
    const tuesday = generateSlotsForDate(TUESDAY, config, "couples");
    const open = filterAvailableSlots(
      tuesday,
      new Set(),
      TUESDAY,
      config,
      NOON_MONDAY_NY,
    );
    expect(open).toContain("18:00");
  });

  it("blocks tomorrow's early slots when lead time exceeds the gap", () => {
    const longLead: SlotConfig = { ...config, leadTimeMinutes: 32 * 60 };
    const tuesday = generateSlotsForDate(TUESDAY, config, "couples");
    // From Monday noon, Tuesday 18:00 is 30h away (inside a 32h lead —
    // blocked) while Tuesday 20:15 is 32.25h away (clears it).
    const open = filterAvailableSlots(
      tuesday,
      new Set(),
      TUESDAY,
      longLead,
      NOON_MONDAY_NY,
    );
    expect(open).toEqual(["20:15"]);
  });
});

describe("listMonth", () => {
  it("flags each date with whether any slot is open", () => {
    const bookings = new Map<string, Set<string>>();
    const out = listMonth(2026, 7, config, "couples", bookings, NOON_MONDAY_NY);
    expect(out).toHaveLength(31);

    const byDate = new Map(out.map((d) => [d.date, d.hasOpenSlots]));
    // Past dates and closed Wednesdays are never open.
    expect(byDate.get("2026-07-01")).toBe(false);
    expect(byDate.get(WEDNESDAY)).toBe(false);
    // A future open Saturday inside the advance window is open.
    expect(byDate.get(SATURDAY)).toBe(true);
  });

  it("marks a fully-booked day as closed", () => {
    const allSaturday = generateSlotsForDate(SATURDAY, config, "couples");
    const bookings = new Map([[SATURDAY, new Set(allSaturday)]]);
    const out = listMonth(2026, 7, config, "couples", bookings, NOON_MONDAY_NY);
    const sat = out.find((d) => d.date === SATURDAY);
    expect(sat?.hasOpenSlots).toBe(false);
  });
});
