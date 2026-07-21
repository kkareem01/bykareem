import type { Metadata } from "next";
import { getBookingCopy } from "@/content/copy";
import { isValidConsultType } from "@/lib/booking/consult-types";
import type { ConsultType } from "@/lib/booking/types";
import { BookingFlow } from "@/components/booking/BookingFlow";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function resolveType(
  searchParams: SearchParams,
): Promise<{ preset: boolean; initialType: ConsultType }> {
  const { type } = await searchParams;
  if (typeof type === "string" && isValidConsultType(type)) {
    return { preset: true, initialType: type };
  }
  return { preset: false, initialType: "couples" };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { initialType } = await resolveType(searchParams);
  if (initialType === "graduation") {
    return {
      title: "Book Your Grad Session",
      description:
        "Pick your date and time for The Milestone Session — directed grad photos on your Georgia campus, gallery back in 72 hours. No payment due today.",
      robots: { index: false },
    };
  }
  return {
    title: "Book a Free Consult",
    description:
      "Pick a time for your free 20–30 minute consult call. No obligation — you'll leave with an exact quote.",
    robots: { index: false },
  };
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { preset, initialType } = await resolveType(searchParams);
  const copy = getBookingCopy(initialType);

  return (
    <section className="pt-28 md:pt-36 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl mx-auto text-center mb-12">
          <h1 className="display text-3xl sm:text-4xl">{copy.title}</h1>
          <p className="mt-4 text-moss">{copy.sub}</p>
        </div>
        <BookingFlow initialType={initialType} lockType={preset} />
      </div>
    </section>
  );
}
