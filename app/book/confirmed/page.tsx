import type { Metadata } from "next";
import Link from "next/link";
import { bookingCopy } from "@/content/copy";
import { ensureBootstrapped } from "@/lib/booking/db";
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
  const { id } = await searchParams;
  const bookingId = typeof id === "string" && BOOKING_ID_RE.test(id) ? id : null;

  let booking = null;
  if (bookingId) {
    await ensureBootstrapped();
    booking = await getBooking(bookingId);
  }

  return (
    <section className="pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-xl px-5 sm:px-8 text-center">
        {booking ? (
          <>
            <p className="eyebrow eyebrow--gold mb-4">confirmed</p>
            <h1 className="display text-4xl sm:text-5xl">
              {bookingCopy.confirmed.heading}
            </h1>
            <p className="mt-6 rounded-xl bg-mist border border-line px-4 py-3">
              {formatLongDate(booking.slot.date)} at{" "}
              {formatTime12h(booking.slot.time)}
              <span className="block mt-1 text-xs text-moss">
                Ref {booking.id}
              </span>
            </p>
            <p className="mt-6 text-moss">{bookingCopy.confirmed.sub}</p>
            <ol className="mt-8 space-y-4 text-left">
              {bookingCopy.confirmed.steps.map((step, i) => (
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
              <Button href={`/api/bookings/${booking.id}/ics`} variant="ghost">
                Add to calendar
              </Button>
              <Button href="/">Back to the site</Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="display text-4xl">Booking not found</h1>
            <p className="mt-6 text-moss">
              That confirmation link doesn&apos;t match a booking. If you just
              booked, check your email for the confirmation.
            </p>
            <div className="mt-10">
              <Link href="/book" className="text-gold hover:text-gold-deep">
                ← Book a consult
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
