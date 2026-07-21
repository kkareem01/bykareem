import { NextRequest, NextResponse } from "next/server";
import { ensureBootstrapped } from "@/lib/booking/db";
import { err, ok } from "@/lib/booking/http";
import { BOOKING_ID_RE } from "@/lib/booking/id";
import { log } from "@/lib/booking/log";
import { getBooking } from "@/lib/booking/store";

/** GET /api/bookings/[id] — minimal public detail for the confirmed page. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!BOOKING_ID_RE.test(id)) {
    return NextResponse.json(err("Invalid booking id."), { status: 400 });
  }

  try {
    await ensureBootstrapped();
    const booking = await getBooking(id);
    if (!booking) {
      return NextResponse.json(err("Booking not found."), { status: 404 });
    }
    // Deliberately narrow: no phone, no answers, no attribution.
    return NextResponse.json(
      ok({
        id: booking.id,
        audience: booking.audience,
        slot: booking.slot,
        displayTimezone: booking.displayTimezone,
        customer: {
          firstName: booking.customer.firstName,
          email: booking.customer.email,
        },
        createdAt: booking.createdAt,
      }),
    );
  } catch (e) {
    log.error(`GET /api/bookings/${id} failed`, e);
    return NextResponse.json(err("Could not load booking."), { status: 500 });
  }
}
