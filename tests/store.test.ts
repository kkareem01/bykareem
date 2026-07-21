import { rmSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ensureBootstrapped, resetDbForTests } from "@/lib/booking/db";
import {
  createBooking,
  getBookedTimesForDate,
  getBooking,
  listBookings,
  markReminderSent,
  updateStaffStatus,
} from "@/lib/booking/store";
import type { BookingCreateRecord } from "@/lib/booking/types";

const DB_FILE = "test-store.db";

function record(date: string, time: string): BookingCreateRecord {
  return {
    audience: "couples",
    customer: {
      firstName: "Test",
      lastName: "Couple",
      phone: "(404) 555-1234",
      email: "test@example.com",
      consent: true,
    },
    answers: { occasion: "Wedding" },
    slot: { date, time, durationMinutes: 30, tz: "America/New_York" },
    displayTimezone: "America/New_York",
    consent: true,
    ip: "127.0.0.1",
    userAgent: "vitest",
    emailStatus: "pending",
  };
}

beforeAll(async () => {
  rmSync(DB_FILE, { force: true });
  resetDbForTests();
  process.env.TURSO_DATABASE_URL = `file:${DB_FILE}`;
  await ensureBootstrapped();
});

afterAll(() => {
  resetDbForTests();
  rmSync(DB_FILE, { force: true });
});

describe("createBooking", () => {
  it("round-trips a booking through the row mapper", async () => {
    const result = await createBooking(record("2026-09-01", "18:00"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const loaded = await getBooking(result.booking.id);
    expect(loaded).not.toBeNull();
    expect(loaded?.customer.firstName).toBe("Test");
    expect(loaded?.slot).toEqual({
      date: "2026-09-01",
      time: "18:00",
      durationMinutes: 30,
      tz: "America/New_York",
    });
    expect(loaded?.staffStatus).toBe("new");
    expect(loaded?.consent).toBe(true);
    expect(loaded?.utm).toBeNull();
  });

  it("arbitrates concurrent writes: one wins, the rest get SLOT_TAKEN", async () => {
    const attempts = await Promise.all(
      Array.from({ length: 20 }, () =>
        createBooking(record("2026-09-02", "18:00")),
      ),
    );
    const wins = attempts.filter((r) => r.ok);
    const losses = attempts.filter((r) => !r.ok);
    expect(wins).toHaveLength(1);
    expect(losses).toHaveLength(19);
    for (const loss of losses) {
      expect(!loss.ok && loss.code).toBe("SLOT_TAKEN");
    }
  });

  it("allows distinct slots on the same day", async () => {
    const a = await createBooking(record("2026-09-03", "18:00"));
    const b = await createBooking(record("2026-09-03", "18:45"));
    expect(a.ok && b.ok).toBe(true);
    const booked = await getBookedTimesForDate("2026-09-03");
    expect(booked).toEqual(new Set(["18:00", "18:45"]));
  });
});

describe("updateStaffStatus", () => {
  it("updates to an allowed status and rejects unknown ones", async () => {
    const created = await createBooking(record("2026-09-04", "18:00"));
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    const updated = await updateStaffStatus(created.booking.id, "confirmed");
    expect(updated?.staffStatus).toBe("confirmed");

    await expect(
      updateStaffStatus(created.booking.id, "new"),
    ).rejects.toThrow(/Invalid staff status/);
  });

  it("returns null for unknown ids", async () => {
    expect(await updateStaffStatus("BK-DEADBEEF", "confirmed")).toBeNull();
  });
});

describe("markReminderSent", () => {
  it("returns true once per (booking, kind) and false after", async () => {
    const created = await createBooking(record("2026-09-05", "18:00"));
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    const id = created.booking.id;

    expect(await markReminderSent(id, "t1")).toBe(true);
    expect(await markReminderSent(id, "t1")).toBe(false);
    // a different kind is an independent channel
    expect(await markReminderSent(id, "dayof")).toBe(true);
  });
});

describe("listBookings", () => {
  it("lists newest first", async () => {
    const all = await listBookings();
    expect(all.length).toBeGreaterThanOrEqual(5);
    const stamps = all.map((b) => b.createdAt);
    const sorted = [...stamps].sort().reverse();
    expect(stamps).toEqual(sorted);
  });
});
