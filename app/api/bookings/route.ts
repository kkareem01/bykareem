import { NextRequest, NextResponse } from "next/server";
import { bookingConfig } from "@/content/booking-config";
import { bookedTimesForDate } from "@/lib/booking/booked-times";
import { ensureBootstrapped, isDbConfigured } from "@/lib/booking/db";
import { checkRateLimit, clientIp, err, ok } from "@/lib/booking/http";
import { log } from "@/lib/booking/log";
import {
  fireBookingEmails,
  notifyOwnerOfBooking,
  notifyOwnerUnsaved,
} from "@/lib/booking/notify";
import {
  filterAvailableSlots,
  generateSlotsForDate,
} from "@/lib/booking/slots";
import { createBooking } from "@/lib/booking/store";
import type { Booking, BookingCreateRecord, ConsultType } from "@/lib/booking/types";
import { buildUnsavedBooking } from "@/lib/booking/unsaved-booking";
import {
  validateAttribution,
  validateBookingPayload,
} from "@/lib/booking/validate";

const SLOT_TAKEN = err("That slot is no longer available.", "SLOT_TAKEN");

function publicView(booking: Booking, persisted: boolean) {
  return ok({
    id: booking.id,
    slot: booking.slot,
    customer: {
      firstName: booking.customer.firstName,
      email: booking.customer.email,
    },
    persisted,
  });
}

/**
 * TEMPORARY: with no database configured the owner alert is the booking.
 * A booking nobody was told about would be lost, so refuse in that case.
 */
async function acceptWithoutDb(record: BookingCreateRecord) {
  const booking = buildUnsavedBooking(record);
  const notified = await notifyOwnerUnsaved(booking);
  if (!notified) {
    log.error(`unsaved booking ${booking.id} refused: owner not reachable`);
    return NextResponse.json(err("Could not save booking."), { status: 500 });
  }
  log.warn(`booking ${booking.id} accepted WITHOUT database; owner alerted`);
  return NextResponse.json(publicView(booking, false));
}

/** POST /api/bookings — the one write path for the public booking flow. */
export async function POST(request: NextRequest) {
  const ip = clientIp(request.headers);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      err("Too many bookings from your network. Try again later."),
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(err("Invalid JSON body."), { status: 400 });
  }

  const validated = validateBookingPayload(body);
  if (!validated.ok) {
    return NextResponse.json(err(validated.errors.join(" ")), { status: 400 });
  }
  const payload = validated.value;
  const audience = payload.audience as ConsultType;

  try {
    if (isDbConfigured()) await ensureBootstrapped();

    // Defense layer 1: the requested time must be on the schedule grid.
    const gridSlots = generateSlotsForDate(
      payload.slot.date,
      bookingConfig,
      audience,
    );
    if (!gridSlots.includes(payload.slot.time)) {
      return NextResponse.json(SLOT_TAKEN, { status: 409 });
    }

    // Defense layer 2: it must still be open (booked, lead time, advance).
    const booked = await bookedTimesForDate(payload.slot.date);
    const open = filterAvailableSlots(
      gridSlots,
      booked,
      payload.slot.date,
      bookingConfig,
    );
    if (!open.includes(payload.slot.time)) {
      return NextResponse.json(SLOT_TAKEN, { status: 409 });
    }

    const durationMinutes =
      bookingConfig.consultTypes[audience]?.slotDurationMinutes ??
      bookingConfig.defaultSlotDurationMinutes;

    const attribution = validateAttribution(
      (body as Record<string, unknown>).attribution,
    );

    const record: BookingCreateRecord = {
      audience,
      customer: payload.customer,
      answers: payload.answers,
      slot: {
        date: payload.slot.date,
        time: payload.slot.time,
        durationMinutes,
        tz: bookingConfig.timezone,
      },
      displayTimezone: payload.timezone,
      consent: true,
      ip,
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 200) || null,
      emailStatus: "pending",
      ...(attribution ?? {}),
    };

    if (!isDbConfigured()) return acceptWithoutDb(record);

    // Defense layer 3: UNIQUE(slot_date, slot_time) — the race arbiter.
    const result = await createBooking(record);
    if (!result.ok) {
      return NextResponse.json(SLOT_TAKEN, { status: 409 });
    }

    // Awaited so the serverless invocation can't terminate mid-send; each
    // helper catches its own failures — a notification outage never loses
    // the booking.
    await Promise.all([
      fireBookingEmails(result.booking).catch((e) =>
        log.error(`fireBookingEmails crashed for ${result.booking.id}`, e),
      ),
      notifyOwnerOfBooking(result.booking),
    ]);

    return NextResponse.json(publicView(result.booking, true));
  } catch (e) {
    log.error("POST /api/bookings failed", e);
    return NextResponse.json(err("Could not save booking."), { status: 500 });
  }
}
