/**
 * Idempotent schema migration — safe to run repeatedly.
 * UNIQUE(slot_date, slot_time) enforces "one consult call per physical time
 * slot" at the DB level: of two simultaneous booking attempts, exactly one
 * succeeds; the loser sees SLOT_TAKEN.
 */

import { getDb } from "./db";

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS bookings (
    id              TEXT PRIMARY KEY,
    audience        TEXT NOT NULL,
    customer_json   TEXT NOT NULL,
    answers_json    TEXT NOT NULL,
    slot_date       TEXT NOT NULL,
    slot_time       TEXT NOT NULL,
    slot_duration   INTEGER NOT NULL,
    slot_tz         TEXT NOT NULL,
    display_tz      TEXT,
    consent         INTEGER NOT NULL,
    ip              TEXT,
    user_agent      TEXT,
    email_status    TEXT,
    email_detail    TEXT,
    staff_status    TEXT NOT NULL DEFAULT 'new',
    gclid           TEXT,
    gbraid          TEXT,
    wbraid          TEXT,
    utm_json        TEXT,
    landing_page    TEXT,
    referrer        TEXT,
    created_at      TEXT NOT NULL,
    UNIQUE(slot_date, slot_time)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_date_audience
     ON bookings(slot_date, audience)`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_month
     ON bookings(slot_date)`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_staff_status
     ON bookings(staff_status)`,
  `CREATE TABLE IF NOT EXISTS reminders_sent (
    booking_id  TEXT NOT NULL,
    kind        TEXT NOT NULL,
    sent_at     TEXT NOT NULL,
    PRIMARY KEY (booking_id, kind)
  )`,
];

export async function migrate(): Promise<void> {
  const db = getDb();
  for (const sql of STATEMENTS) {
    await db.execute(sql);
  }
}
