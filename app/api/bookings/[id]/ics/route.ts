import { NextRequest } from "next/server";
import { ensureBootstrapped } from "@/lib/booking/db";
import { log } from "@/lib/booking/log";
import { BOOKING_ID_RE } from "@/lib/booking/id";
import { bookingIcs } from "@/lib/booking/notify";
import { getBooking } from "@/lib/booking/store";

/** GET /api/bookings/[id]/ics — downloadable calendar invite. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!BOOKING_ID_RE.test(id)) {
    return new Response("Invalid booking id.", { status: 400 });
  }

  try {
    await ensureBootstrapped();
    const booking = await getBooking(id);
    if (!booking) return new Response("Not found.", { status: 404 });

    return new Response(bookingIcs(booking), {
      status: 200,
      headers: {
        "content-type": "text/calendar; charset=utf-8",
        "content-disposition": `attachment; filename="consult-${booking.id}.ics"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    log.error(`GET /api/bookings/${id}/ics failed`, e);
    return new Response("Could not build invite.", { status: 500 });
  }
}
