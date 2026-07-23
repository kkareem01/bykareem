/**
 * Post-booking notification orchestration: customer confirmation email
 * (with ICS attached), owner alert email, and owner SMS. Failures are
 * recorded, never thrown — a Resend or Twilio outage must not lose a
 * booking that is already in the database.
 */

import { bookingConfig } from "@/content/booking-config";
import { buildICS } from "./ics";
import {
  customerConfirmationEmail,
  ownerNotificationEmail,
} from "./email-templates";
import { sendEmail } from "./email";
import { sendSms } from "./sms";
import { log } from "./log";
import { updateEmailStatus } from "./store";
import type { Booking } from "./types";

function env(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export function bookingIcs(booking: Booking): string {
  const label =
    bookingConfig.consultTypes[booking.audience]?.label ?? "Quick chat";
  const description =
    booking.audience === "graduation"
      ? `Your graduation session. I'll text you at ${booking.customer.phone} to confirm the campus meeting spot. Ref ${booking.id}.`
      : `A quick chat. I'll give you a call at ${booking.customer.phone}. Ref ${booking.id}.`;
  return buildICS({
    id: booking.id,
    slot: { date: booking.slot.date, time: booking.slot.time },
    durationMinutes: booking.slot.durationMinutes,
    tz: booking.slot.tz,
    summary: `${env("BUSINESS_NAME", "bykareem")} — ${label}`,
    description,
    uidDomain: "bykareem.com",
  });
}

export function confirmUrlFor(bookingId: string): string {
  return `${env("SITE_URL", "http://localhost:3000")}/book/confirmed?id=${bookingId}`;
}

/** Owner SMS body — GSM-7-clean (no em dashes / curly quotes). */
export function ownerBookingSmsBody(
  booking: Booking,
  audienceLabel: string,
): string {
  const c = booking.customer;
  const when = `${booking.slot.date} ${booking.slot.time}`;
  return [
    `NEW BOOKING (${audienceLabel})`,
    `${c.firstName} ${c.lastName} ${c.phone}`,
    `When: ${when}`,
    `Ref ${booking.id}`,
  ].join("\n");
}

/** Fire customer + owner emails; record sent/partial/failed on the row. */
export async function fireBookingEmails(booking: Booking): Promise<void> {
  const businessName = env("BUSINESS_NAME", "bykareem");
  const fromEmail = env("FROM_EMAIL");
  const ownerEmail = env("OWNER_EMAIL");
  const from = `${businessName} <${fromEmail || "bookings@localhost"}>`;
  const audienceLabel =
    bookingConfig.consultTypes[booking.audience]?.label ?? booking.audience;

  const customer = customerConfirmationEmail({
    booking,
    businessName,
    businessPhone: env("BUSINESS_PHONE"),
    confirmUrl: confirmUrlFor(booking.id),
  });
  const ics = bookingIcs(booking);

  const sends: Promise<{ ok: boolean; error?: string }>[] = [
    sendEmail({
      to: booking.customer.email,
      from,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
      replyTo: ownerEmail || undefined,
      attachments: [
        {
          filename: `consult-${booking.id}.ics`,
          content: Buffer.from(ics).toString("base64"),
          contentType: "text/calendar",
        },
      ],
    }),
  ];

  if (ownerEmail) {
    const owner = ownerNotificationEmail({
      booking,
      businessName,
      businessPhone: env("BUSINESS_PHONE"),
      audienceLabel,
    });
    sends.push(
      sendEmail({
        to: ownerEmail,
        from,
        subject: owner.subject,
        html: owner.html,
        text: owner.text,
      }),
    );
  }

  const results = await Promise.allSettled(sends);
  const outcomes = results.map((r) =>
    r.status === "fulfilled" ? r.value : { ok: false, error: String(r.reason) },
  );
  const failures = outcomes.filter((o) => !o.ok);

  const status =
    failures.length === 0
      ? "sent"
      : failures.length === outcomes.length
        ? "failed"
        : "partial";
  const detail =
    failures.length > 0
      ? failures
          .map((f) => ("error" in f ? f.error : "unknown"))
          .join("; ")
          .slice(0, 500)
      : null;

  try {
    await updateEmailStatus(booking.id, status, detail);
  } catch (e) {
    log.error(`email status update failed for ${booking.id}`, e);
  }
  if (failures.length > 0) {
    log.error(`booking emails ${status} for ${booking.id}`, detail);
  }
}

/** Owner SMS alert — never throws, skipped when OWNER_PHONE is unset. */
export async function notifyOwnerOfBooking(booking: Booking): Promise<void> {
  const ownerPhone = env("OWNER_PHONE");
  if (!ownerPhone) return;
  const audienceLabel =
    bookingConfig.consultTypes[booking.audience]?.label ?? booking.audience;
  const result = await sendSms({
    to: ownerPhone,
    body: ownerBookingSmsBody(booking, audienceLabel),
  });
  if (!result.ok) {
    log.error(`owner SMS failed for ${booking.id}`, result.error);
  }
}
