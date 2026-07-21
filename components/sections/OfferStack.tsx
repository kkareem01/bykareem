import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { OfferSummaryPanel } from "@/components/sections/OfferSummaryPanel";
import type { Offer, OfferItem } from "@/content/offers";

function StackCard({ item, delay }: { item: OfferItem; delay: 0 | 1 | 2 | 3 }) {
  return (
    <Reveal delay={delay}>
      <div className="h-full border border-line bg-porcelain rounded-2xl p-4 pb-7 flex flex-col gap-3">
        {item.visual ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-2">
            <Image
              src={item.visual.src}
              alt={item.visual.alt}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="px-3 flex flex-col gap-3 flex-1">
          <p className="text-sm italic text-moss">{item.pain}</p>
          <h3 className="font-display text-xl">{item.name}</h3>
          <p className="text-sm text-moss leading-relaxed flex-1">
            {item.outcome}
          </p>
          <p className="eyebrow eyebrow--gold">{item.valueLabel}</p>
        </div>
      </div>
    </Reveal>
  );
}

type OfferStackProps = {
  offer: Offer;
  intro: { eyebrow?: string; heading: string; sub?: string };
  bonusesIntro?: { eyebrow?: string; heading: string };
};

/**
 * The full Hormozi-style offer presentation: value stack, bonuses,
 * guarantee, honest scarcity, and the value-anchor pricing frame.
 */
export function OfferStack({ offer, intro, bonusesIntro }: OfferStackProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={intro.eyebrow}
          heading={intro.heading}
          sub={intro.sub}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offer.items.map((item, i) => (
            <StackCard
              key={item.name}
              item={item}
              delay={(i % 3) as 0 | 1 | 2}
            />
          ))}
        </div>

        {offer.bonuses.length > 0 ? (
          <>
            {bonusesIntro ? (
              <div className="mt-20">
                <SectionHeading
                  eyebrow={bonusesIntro.eyebrow}
                  heading={bonusesIntro.heading}
                />
              </div>
            ) : null}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offer.bonuses.map((item, i) => (
                <StackCard
                  key={item.name}
                  item={item}
                  delay={(i % 3) as 0 | 1 | 2}
                />
              ))}
            </div>
          </>
        ) : null}

        <OfferSummaryPanel offer={offer} className="mt-20" />
      </div>
    </section>
  );
}
