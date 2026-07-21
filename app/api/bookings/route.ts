import { NextRequest, NextResponse } from "next/server";
import { bookingConfig } from "@/content/booking-config";
import { ensureBootstrapped } from "@/lib/booking/db";
import { checkRateLimit, clientIp, err, ok } from "@/lib/booking/http";
import { log } from "@/lib/booking/log";
import { fireBookingEmails, notifyOwnerOfBooking } from "@/lib/booking/notify";
import {
  filterAvailableSlots,
  generateSlotsForDate,
} from "@/lib/booking/slots";
import { createBooking, getBookedTimesForDate } from "@/lib/booking/store";
import type { ConsultType } from "@/lib/booking/types";
import {
  validateAttribution,
  validateBookingPayload,
} from "@/lib/booking/validate";

const SLOT_TAKEN = err("That slot is no longer available.", "SLOT_TAKEN");

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
    await ensureBootstrapped();

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
    const booked = await getBookedTimesForDate(payload.slot.date);
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

    // Defense layer 3: UNIQUE(slot_date, slot_time) — the race arbiter.
    const result = await createBooking({
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
    });

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

    return NextResponse.json(
      ok({
        id: result.booking.id,
        slot: result.booking.slot,
        customer: {
          firstName: result.booking.customer.firstName,
          email: result.booking.customer.email,
        },
      }),
    );
  } catch (e) {
    log.error("POST /api/bookings failed", e);
    return NextResponse.json(err("Could not save booking."), { status: 500 });
  }
}
