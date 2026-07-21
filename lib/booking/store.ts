/**
 * Repository over the bookings + reminders_sent tables. All SQL lives here;
 * handlers never touch the client directly. Every write path assumes
 * ensureBootstrapped() already ran (route handlers call it first).
 */

import type { Row } from "@libsql/client";
import { getDb } from "./db";
import { newBookingId } from "./id";
import type { Booking, BookingCreateRecord, ConsultType } from "./types";

export type CreateResult =
  | { ok: true; booking: Booking }
  | { ok: false; code: "SLOT_TAKEN" };

function rowToBooking(row: Row): Booking {
  const r = row as unknown as Record<string, unknown>;
  return {
    id: String(r.id),
    audience: String(r.audience) as ConsultType,
    customer: JSON.parse(String(r.customer_json)),
    answers: JSON.parse(String(r.answers_json)),
    slot: {
      date: String(r.slot_date),
      time: String(r.slot_time),
      durationMinutes: Number(r.slot_duration),
      tz: String(r.slot_tz),
    },
    displayTimezone: r.display_tz == null ? null : String(r.display_tz),
    consent: Number(r.consent) === 1,
    ip: r.ip == null ? null : String(r.ip),
    userAgent: r.user_agent == null ? null : String(r.user_agent),
    emailStatus: r.email_status == null ? null : String(r.email_status),
    emailDetail: r.email_detail == null ? null : String(r.email_detail),
    staffStatus: String(r.staff_status),
    gclid: r.gclid == null ? null : String(r.gclid),
    gbraid: r.gbraid == null ? null : String(r.gbraid),
    wbraid: r.wbraid == null ? null : String(r.wbraid),
    utm: r.utm_json == null ? null : JSON.parse(String(r.utm_json)),
    landingPage: r.landing_page == null ? null : String(r.landing_page),
    referrer: r.referrer == null ? null : String(r.referrer),
    createdAt: String(r.created_at),
  };
}

function isUniqueViolation(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return /UNIQUE constraint failed|SQLITE_CONSTRAINT/i.test(msg);
}

/**
 * Insert a booking. The UNIQUE(slot_date, slot_time) index is the arbiter
 * of double-booking: of two simultaneous attempts exactly one succeeds and
 * the loser gets SLOT_TAKEN.
 */
export async function createBooking(
  record: BookingCreateRecord,
): Promise<CreateResult> {
  const db = getDb();
  const id = newBookingId();
  const createdAt = new Date().toISOString();

  try {
    await db.execute({
      sql: `INSERT INTO bookings (
              id, audience, customer_json, answers_json,
              slot_date, slot_time, slot_duration, slot_tz, display_tz,
              consent, ip, user_agent, email_status, email_detail,
              gclid, gbraid, wbraid, utm_json, landing_page, referrer,
              created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        record.audience,
        JSON.stringify(record.customer),
        JSON.stringify(record.answers),
        record.slot.date,
        record.slot.time,
        record.slot.durationMinutes,
        record.slot.tz,
        record.displayTimezone,
        record.consent ? 1 : 0,
        record.ip,
        record.userAgent,
        record.emailStatus,
        null,
        record.gclid ?? null,
        record.gbraid ?? null,
        record.wbraid ?? null,
        record.utmJson ?? null,
        record.landingPage ?? null,
        record.referrer ?? null,
        createdAt,
      ],
    });
  } catch (e) {
    if (isUniqueViolation(e)) return { ok: false, code: "SLOT_TAKEN" };
    throw e;
  }

  const booking = await getBooking(id);
  if (!booking) throw new Error(`Booking ${id} vanished after insert`);
  return { ok: true, booking };
}

export async function getBooking(id: string): Promise<Booking | null> {
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT * FROM bookings WHERE id = ?",
    args: [id],
  });
  return rs.rows.length > 0 ? rowToBooking(rs.rows[0]) : null;
}

/** Booked 'HH:MM' times for one date (all audiences share physical slots). */
export async function getBookedTimesForDate(date: string): Promise<Set<string>> {
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT slot_time FROM bookings WHERE slot_date = ?",
    args: [date],
  });
  return new Set(rs.rows.map((r) => String(r.slot_time)));
}

/** Map<date, Set<time>> of all bookings inside one month. */
export async function getBookedTimesForMonth(
  year: number,
  month: number,
): Promise<Map<string, Set<string>>> {
  const db = getDb();
  const prefix = `${year}-${String(month).padStart(2, "0")}-%`;
  const rs = await db.execute({
    sql: "SELECT slot_date, slot_time FROM bookings WHERE slot_date LIKE ?",
    args: [prefix],
  });
  const out = new Map<string, Set<string>>();
  for (const r of rs.rows) {
    const date = String(r.slot_date);
    const set = out.get(date) ?? new Set<string>();
    set.add(String(r.slot_time));
    if (!out.has(date)) out.set(date, set);
  }
  return out;
}

/** Bookings whose slot falls on one of the given dates (reminder sweep). */
export async function getBookingsForDates(dates: string[]): Promise<Booking[]> {
  if (dates.length === 0) return [];
  const db = getDb();
  const placeholders = dates.map(() => "?").join(", ");
  const rs = await db.execute({
    sql: `SELECT * FROM bookings WHERE slot_date IN (${placeholders})
          ORDER BY slot_date, slot_time`,
    args: dates,
  });
  return rs.rows.map(rowToBooking);
}

/** All bookings, newest first — staff dashboard listing. */
export async function listBookings(limit = 200): Promise<Booking[]> {
  const db = getDb();
  const rs = await db.execute({
    sql: "SELECT * FROM bookings ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  });
  return rs.rows.map(rowToBooking);
}

/** Staff-assignable statuses — 'new' is set only by the system on insert. */
const STAFF_STATUSES = ["confirmed", "completed", "no_show", "canceled"];

export async function updateStaffStatus(
  id: string,
  status: string,
): Promise<Booking | null> {
  if (!STAFF_STATUSES.includes(status)) {
    throw new Error(`Invalid staff status: ${status}`);
  }
  const db = getDb();
  await db.execute({
    sql: "UPDATE bookings SET staff_status = ? WHERE id = ?",
    args: [status, id],
  });
  return getBooking(id);
}

export async function updateEmailStatus(
  id: string,
  status: string,
  detail: string | null,
): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: "UPDATE bookings SET email_status = ?, email_detail = ? WHERE id = ?",
    args: [status, detail, id],
  });
}

/**
 * Reminder dedupe. Returns true when (bookingId, kind) was newly recorded —
 * i.e. the caller should send. A second call is a no-op returning false.
 */
export async function markReminderSent(
  bookingId: string,
  kind: string,
): Promise<boolean> {
  const db = getDb();
  try {
    await db.execute({
      sql: "INSERT INTO reminders_sent (booking_id, kind, sent_at) VALUES (?, ?, ?)",
      args: [bookingId, kind, new Date().toISOString()],
    });
    return true;
  } catch (e) {
    if (isUniqueViolation(e)) return false;
    throw e;
  }
}
