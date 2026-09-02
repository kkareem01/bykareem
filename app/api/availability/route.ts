import { NextRequest, NextResponse } from "next/server";
import { bookingConfig } from "@/content/booking-config";
import { isValidConsultType } from "@/lib/booking/consult-types";
import { err, ok } from "@/lib/booking/http";
import { log } from "@/lib/booking/log";
import {
  filterAvailableSlots,
  generateSlotsForDate,
} from "@/lib/booking/slots";
import { bookedTimesForDate } from "@/lib/booking/booked-times";
import { validateDateString } from "@/lib/booking/validate";

/** GET /api/availability?date=YYYY-MM-DD&audience=couples */
export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  const audience = request.nextUrl.searchParams.get("audience");

  if (
    !date ||
    !validateDateString(date).ok ||
    !isValidConsultType(audience)
  ) {
    return NextResponse.json(err("Missing or invalid date / audience."), {
      status: 400,
    });
  }

  try {
    const all = generateSlotsForDate(date, bookingConfig, audience);
    const booked = await bookedTimesForDate(date);
    const open = new Set(
      filterAvailableSlots(all, booked, date, bookingConfig),
    );
    return NextResponse.json(
      ok({
        date,
        audience,
        slots: all.map((time) => ({ time, available: open.has(time) })),
      }),
    );
  } catch (e) {
    log.error("GET /api/availability failed", e);
    return NextResponse.json(err("Could not load availability."), {
      status: 500,
    });
  }
}
