import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resetDbForTests } from "@/lib/booking/db";
import {
  bookedTimesForDate,
  bookedTimesForMonth,
} from "@/lib/booking/booked-times";
import { viewFromParams } from "@/lib/booking/confirmed-view";
import { notifyOwnerUnsaved, UNSAVED_NOTE } from "@/lib/booking/notify";
import { buildUnsavedBooking } from "@/lib/booking/unsaved-booking";
import type { BookingCreateRecord } from "@/lib/booking/types";

const record: BookingCreateRecord = {
  audience: "graduation",
  customer: {
    firstName: "Grad",
    lastName: "Student",
    phone: "(404) 555-9876",
    email: "grad@example.com",
    consent: true,
  },
  answers: { school: "UGA", sessionType: "Just me" },
  slot: {
    date: "2026-10-03",
    time: "10:00",
    durationMinutes: 105,
    tz: "America/New_York",
  },
  displayTimezone: "America/New_York",
  consent: true,
  ip: "127.0.0.1",
  userAgent: "vitest",
  emailStatus: "pending",
};

const saved: Record<string, string | undefined> = {};
const KEYS = [
  "TURSO_DATABASE_URL",
  "OWNER_PHONE",
  "OWNER_EMAIL",
  "DRY_RUN_SMS",
  "DRY_RUN_EMAIL",
  "RESEND_API_KEY",
];

beforeEach(() => {
  for (const k of KEYS) saved[k] = process.env[k];
  for (const k of KEYS) delete process.env[k];
  resetDbForTests();
});
afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
  resetDbForTests();
});

describe("no-database fallback", () => {
  it("reports nothing booked when TURSO_DATABASE_URL is unset", async () => {
    expect((await bookedTimesForDate("2026-10-03")).size).toBe(0);
    expect((await bookedTimesForMonth(2026, 10)).size).toBe(0);
  });

  it("builds a notifiable booking without persisting", () => {
    const b = buildUnsavedBooking(record, new Date("2026-09-02T12:00:00Z"));
    expect(b.id).toMatch(/^BK-[A-F0-9]{8}$/);
    expect(b.staffStatus).toBe("unsaved");
    expect(b.slot).toEqual(record.slot);
    expect(b.createdAt).toBe("2026-09-02T12:00:00.000Z");
  });

  it("notifies the owner by dry-run SMS and flags the booking as unsaved", async () => {
    process.env.OWNER_PHONE = "+14045550000";
    process.env.DRY_RUN_SMS = "1";
    const b = buildUnsavedBooking(record);
    expect(await notifyOwnerUnsaved(b)).toBe(true);
    expect(UNSAVED_NOTE).toMatch(/NOT SAVED/);
  });

  it("fails loudly when no owner channel is configured", async () => {
    const b = buildUnsavedBooking(record);
    expect(await notifyOwnerUnsaved(b)).toBe(false);
  });
});

describe("viewFromParams", () => {
  const good = { id: "BK-ABCD1234", date: "2026-10-03", time: "10:00", type: "graduation" };

  it("accepts a well-formed echo of the slot", () => {
    expect(viewFromParams(good)).toEqual({
      id: "BK-ABCD1234",
      audience: "graduation",
      date: "2026-10-03",
      time: "10:00",
      icsAvailable: false,
    });
  });

  it.each([
    ["id", "nope"],
    ["date", "10/03/2026"],
    ["time", "10am"],
    ["type", "prom"],
  ])("rejects a malformed %s", (key, value) => {
    expect(viewFromParams({ ...good, [key]: value })).toBeNull();
  });
});
