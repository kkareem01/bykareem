import { existsSync, readFileSync, rmSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runReminders } from "@/lib/booking/cron";
import { ensureBootstrapped, resetDbForTests } from "@/lib/booking/db";
import { createBooking, updateStaffStatus } from "@/lib/booking/store";
import type { BookingCreateRecord } from "@/lib/booking/types";

const DB_FILE = "test-cron.db";

/** New York noon on Monday 2026-07-20 (EDT). */
const NOW = new Date("2026-07-20T16:00:00Z");
const TOMORROW = "2026-07-21";
const TODAY = "2026-07-20";

function record(date: string, time: string): BookingCreateRecord {
  return {
    audience: "graduation",
    customer: {
      firstName: "Grad",
      lastName: "Tester",
      phone: "(404) 555-9999",
      email: "grad@example.com",
      consent: true,
    },
    answers: { school: "UGA", sessionType: "Just me" },
    slot: { date, time, durationMinutes: 20, tz: "America/New_York" },
    displayTimezone: null,
    consent: true,
    ip: null,
    userAgent: null,
    emailStatus: "sent",
  };
}

beforeAll(async () => {
  rmSync(DB_FILE, { force: true });
  resetDbForTests();
  process.env.TURSO_DATABASE_URL = `file:${DB_FILE}`;
  process.env.DRY_RUN_EMAIL = "1";
  process.env.BUSINESS_NAME = "bykareem-test";
  await ensureBootstrapped();
});

afterAll(() => {
  resetDbForTests();
  rmSync(DB_FILE, { force: true });
});

describe("runReminders", () => {
  it("t1 targets tomorrow's bookings, sends once, and dedupes on re-run", async () => {
    const created = await createBooking(record(TOMORROW, "18:00"));
    expect(created.ok).toBe(true);

    const first = await runReminders("t1", NOW);
    expect(first.slotDate).toBe(TOMORROW);
    expect(first.sent).toBe(1);
    expect(first.failed).toBe(0);

    // dry-run wrote the rendered email
    expect(existsSync("tmp/last-email.html")).toBe(true);
    const rendered = readFileSync("tmp/last-email.html", "utf8");
    expect(rendered).toContain("Tomorrow");
    expect(rendered).toContain("grad@example.com");

    const second = await runReminders("t1", NOW);
    expect(second.sent).toBe(0);
    expect(second.skipped).toBe(1);
  });

  it("dayof targets today's bookings independently of t1", async () => {
    const created = await createBooking(record(TODAY, "18:30"));
    expect(created.ok).toBe(true);

    const run = await runReminders("dayof", NOW);
    expect(run.slotDate).toBe(TODAY);
    expect(run.sent).toBe(1);
  });

  it("skips canceled bookings", async () => {
    const created = await createBooking(record(TOMORROW, "19:00"));
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    await updateStaffStatus(created.booking.id, "canceled");

    const run = await runReminders("t1", NOW);
    // first booking already deduped, canceled one skipped, none sent
    expect(run.sent).toBe(0);
    expect(run.skipped).toBe(2);
  });
});
