import type { Metadata } from "next";
import { bookingCopy } from "@/content/copy";
import { isValidConsultType } from "@/lib/booking/consult-types";
import { BookingFlow } from "@/components/booking/BookingFlow";

export const metadata: Metadata = {
  title: "Book a Free Consult",
  description:
    "Pick a time for your free 20–30 minute consult call. No obligation — you'll leave with an exact quote.",
  robots: { index: false },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { type } = await searchParams;
  const initialType =
    typeof type === "string" && isValidConsultType(type) ? type : "couples";

  return (
    <section className="pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h1 className="display text-3xl sm:text-4xl">{bookingCopy.title}</h1>
          <p className="mt-4 text-moss">{bookingCopy.sub}</p>
        </div>
        <BookingFlow initialType={initialType} />
      </div>
    </section>
  );
}
