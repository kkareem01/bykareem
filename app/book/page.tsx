import type { Metadata } from "next";
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
    title: "Let's Chat",
    description:
      "Pick a time for a free 20–30 minute chat. No pressure — you'll leave with an exact quote.",
    robots: { index: false },
  };
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { preset, initialType } = await resolveType(searchParams);

  return (
    <section className="pt-20 md:pt-24">
      <BookingFlow initialType={initialType} lockType={preset} />
    </section>
  );
}
