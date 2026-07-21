/**
 * Reminder sweeps, run daily by Vercel Cron.
 * - t1: bookings whose slot date is tomorrow (business tz)
 * - dayof: bookings whose slot date is today
 * Dedupe: reminders_sent (booking_id, kind) — a row is written only after a
 * successful send, so failures retry on the next run and re-runs are no-ops.
 */

import { bookingConfig } from "@/content/booking-config";
import { reminderDayOfEmail, reminderT1Email } from "./email-templates";
import { sendEmail } from "./email";
import { confirmUrlFor } from "./notify";
import { addDays, nowInTz } from "./slots";
import { getBookingsForDates, markReminderSent } from "./store";
import { log } from "./log";
import type { Booking } from "./types";

export type ReminderKind = "t1" | "dayof";

const OFFSETS: Record<ReminderKind, number> = { t1: 1, dayof: 0 };

export type ReminderRunResult = {
  kind: ReminderKind;
  slotDate: string;
  candidates: number;
  sent: number;
  failed: number;
  skipped: number;
};

function buildReminder(kind: ReminderKind, booking: Booking) {
  const ctx = {
    booking,
    businessName: process.env.BUSINESS_NAME ?? "bykareem",
    businessPhone: process.env.BUSINESS_PHONE ?? "",
    confirmUrl: confirmUrlFor(booking.id),
  };
  return kind === "t1" ? reminderT1Email(ctx) : reminderDayOfEmail(ctx);
}

export async function runReminders(
  kind: ReminderKind,
  now: Date = new Date(),
): Promise<ReminderRunResult> {
  const today = nowInTz(bookingConfig.timezone, now).date;
  const slotDate = addDays(today, OFFSETS[kind]);
  const bookings = await getBookingsForDates([slotDate]);

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const booking of bookings) {
    if (booking.staffStatus === "canceled") {
      skipped++;
      continue;
    }

    const email = buildReminder(kind, booking);
    const businessName = process.env.BUSINESS_NAME ?? "bykareem";
    const from = `${businessName} <${process.env.FROM_EMAIL ?? "bookings@localhost"}>`;

    // Claim the dedupe row first so concurrent runs can't double-send;
    // release it (by not retrying here) only on failure — the row is
    // deleted below so the next run retries.
    const isNew = await markReminderSent(booking.id, kind);
    if (!isNew) {
      skipped++;
      continue;
    }

    const result = await sendEmail({
      to: booking.customer.email,
      from,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo: process.env.OWNER_EMAIL || undefined,
    });

    if (result.ok) {
      sent++;
    } else {
      failed++;
      log.error(`reminder ${kind} failed for ${booking.id}`, result.error);
      await releaseReminderClaim(booking.id, kind);
    }
  }

  const summary = { kind, slotDate, candidates: bookings.length, sent, failed, skipped };
  log.info("reminder run", summary);
  return summary;
}

async function releaseReminderClaim(
  bookingId: string,
  kind: string,
): Promise<void> {
  const { getDb } = await import("./db");
  try {
    await getDb().execute({
      sql: "DELETE FROM reminders_sent WHERE booking_id = ? AND kind = ?",
      args: [bookingId, kind],
    });
  } catch (e) {
    log.error(`could not release reminder claim ${bookingId}/${kind}`, e);
  }
}
