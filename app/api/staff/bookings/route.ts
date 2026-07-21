import { NextRequest, NextResponse } from "next/server";
import { ensureBootstrapped } from "@/lib/booking/db";
import { verifyBearer } from "@/lib/booking/http";
import { BOOKING_ID_RE } from "@/lib/booking/id";
import { log } from "@/lib/booking/log";
import { listBookings, updateStaffStatus } from "@/lib/booking/store";

/**
 * Staff endpoints — flat envelope, Bearer STAFF_TOKEN on every method.
 * GET  /api/staff/bookings           → { ok, bookings }
 * POST /api/staff/bookings {id, staffStatus} → { ok, booking }
 */

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "UNAUTHORIZED" },
    { status: 401 },
  );
}

export async function GET(request: NextRequest) {
  if (!verifyBearer(request.headers, "STAFF_TOKEN")) return unauthorized();

  try {
    await ensureBootstrapped();
    const bookings = await listBookings();
    const newCount = bookings.filter((b) => b.staffStatus === "new").length;
    return NextResponse.json({ ok: true, bookings, newCount });
  } catch (e) {
    log.error("GET /api/staff/bookings failed", e);
    return NextResponse.json({ ok: false, error: "CRASH" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyBearer(request.headers, "STAFF_TOKEN")) return unauthorized();

  let body: { id?: unknown; staffStatus?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_BODY" },
      { status: 400 },
    );
  }

  const id = typeof body.id === "string" ? body.id : "";
  const staffStatus =
    typeof body.staffStatus === "string" ? body.staffStatus : "";
  if (!BOOKING_ID_RE.test(id)) {
    return NextResponse.json(
      { ok: false, error: "INVALID_ID" },
      { status: 400 },
    );
  }

  try {
    await ensureBootstrapped();
    const booking = await updateStaffStatus(id, staffStatus);
    if (!booking) {
      return NextResponse.json(
        { ok: false, error: "NOT_FOUND" },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, booking });
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("Invalid staff status")) {
      return NextResponse.json(
        { ok: false, error: "INVALID_STATUS" },
        { status: 400 },
      );
    }
    log.error("POST /api/staff/bookings failed", e);
    return NextResponse.json({ ok: false, error: "CRASH" }, { status: 500 });
  }
}
