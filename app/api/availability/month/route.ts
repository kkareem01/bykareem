import { NextRequest, NextResponse } from "next/server";
import { bookingConfig } from "@/content/booking-config";
import { isValidConsultType } from "@/lib/booking/consult-types";
import { ensureBootstrapped } from "@/lib/booking/db";
import { err, ok } from "@/lib/booking/http";
import { log } from "@/lib/booking/log";
import { listMonth } from "@/lib/booking/slots";
import { getBookedTimesForMonth } from "@/lib/booking/store";

/** GET /api/availability/month?year=2026&month=8&audience=couples */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const year = Number(params.get("year"));
  const month = Number(params.get("month"));
  const audience = params.get("audience");

  if (
    !Number.isInteger(year) ||
    year < 2020 ||
    year > 2100 ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !isValidConsultType(audience)
  ) {
    return NextResponse.json(err("Missing or invalid year / month / audience."), {
      status: 400,
    });
  }

  try {
    await ensureBootstrapped();
    const bookingsByDate = await getBookedTimesForMonth(year, month);
    const days = listMonth(year, month, bookingConfig, audience, bookingsByDate);
    return NextResponse.json(ok({ year, month, audience, days }));
  } catch (e) {
    log.error("GET /api/availability/month failed", e);
    return NextResponse.json(err("Could not load availability."), {
      status: 500,
    });
  }
}
