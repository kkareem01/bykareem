import type { Metadata } from "next";
import Link from "next/link";
import { getBookingCopy } from "@/content/copy";
import { viewFromBooking, viewFromParams } from "@/lib/booking/confirmed-view";
import { ensureBootstrapped, isDbConfigured } from "@/lib/booking/db";
import { formatLongDate, formatTime12h } from "@/lib/booking/format";
import { BOOKING_ID_RE } from "@/lib/booking/id";
import { getBooking } from "@/lib/booking/store";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "You're booked",
  robots: { index: false },
};

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id, date, time, type } = await searchParams;
  const bookingId = typeof id === "string" && BOOKING_ID_RE.test(id) ? id : null;

  let booking = null;
  if (bookingId && isDbConfigured()) {
    await ensureBootstrapped();
    const row = await getBooking(bookingId);
    booking = row ? viewFromBooking(row) : null;
  } else if (bookingId) {
    // TEMPORARY no-database mode: trust the validated slot echoed in the URL.
    booking = viewFromParams({ id, date, time, type });
  }

  return (
    <section className="pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-xl px-5 sm:px-8 text-center">
        {booking ? (
          <>
            <p className="eyebrow eyebrow--gold mb-4">confirmed</p>
            <h1 className="display text-4xl sm:text-5xl">
              {getBookingCopy(booking.audience).confirmed.heading}
            </h1>
            <p className="mt-6 rounded-xl bg-mist border border-line px-4 py-3">
              {formatLongDate(booking.date)} at{" "}
              {formatTime12h(booking.time)}
              <span className="block mt-1 text-xs text-moss">
                Ref {booking.id}
              </span>
            </p>
            <p className="mt-6 text-moss">
              {getBookingCopy(booking.audience).confirmed.sub}
            </p>
            <ol className="mt-8 space-y-4 text-left">
              {getBookingCopy(booking.audience).confirmed.steps.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="font-display italic text-2xl text-gold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-moss leading-relaxed pt-1.5">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {booking.icsAvailable ? (
                <Button href={`/api/bookings/${booking.id}/ics`} variant="ghost">
                  Add to calendar
                </Button>
              ) : null}
              <Button href="/">Back to the site</Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="display text-4xl">Booking not found</h1>
            <p className="mt-6 text-moss">
              That confirmation link doesn&apos;t match a booking. If you just
              booked, head back and try again — or reach out and I&apos;ll
              confirm your spot.
            </p>
            <div className="mt-10">
              <Link href="/book" className="text-gold hover:text-gold-deep">
                ← Back to booking
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
