/**
 * TEMPORARY no-database path. Builds the Booking shape the notification
 * layer expects without persisting anything, so a booking made while the
 * DB is unconfigured still reaches the owner by SMS/email.
 */

import { newBookingId } from "./id";
import type { Booking, BookingCreateRecord } from "./types";

export const UNSAVED_STAFF_STATUS = "unsaved";

export function buildUnsavedBooking(
  record: BookingCreateRecord,
  now: Date = new Date(),
): Booking {
  return {
    id: newBookingId(),
    audience: record.audience,
    customer: record.customer,
    answers: record.answers,
    slot: record.slot,
    displayTimezone: record.displayTimezone,
    consent: record.consent,
    ip: record.ip,
    userAgent: record.userAgent,
    emailStatus: "skipped",
    emailDetail: "no database configured",
    staffStatus: UNSAVED_STAFF_STATUS,
    gclid: record.gclid ?? null,
    gbraid: record.gbraid ?? null,
    wbraid: record.wbraid ?? null,
    utm: record.utmJson ? JSON.parse(record.utmJson) : null,
    landingPage: record.landingPage ?? null,
    referrer: record.referrer ?? null,
    createdAt: now.toISOString(),
  };
}
