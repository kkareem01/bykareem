import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Offer, OfferItem } from "@/content/offers";

type OfferClosing = {
  preValue: string;
  stackValue: string;
  midValue: string;
  price: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

type OfferShowcaseProps = {
  offer: Offer;
  intro: { heading: string; sub?: string };
  bonusesIntro?: { heading: string };
  closing: OfferClosing;
  ctaHref: string;
};

/** "$550 value" → "Value: $550"; "included" → "Included" */
function badgeLabel(valueLabel: string): string {
  if (valueLabel.toLowerCase() === "included") return "Included";
  return `Value: ${valueLabel.replace(/ value$/i, "")}`;
}

function ShowcaseCard({
  item,
  tag,
  delay,
}: {
  item: OfferItem;
  tag: string;
  delay: 0 | 1 | 2 | 3;
}) {
  return (
    <Reveal delay={delay} className="relative">
      {/* value badge — floating pill overlaying the card's top edge */}
      <p className="absolute -top-4 left-1/2 -translate-x-1/2 sm:left-9 sm:translate-x-0 z-10 whitespace-nowrap rounded-full bg-gold-light text-hunter text-sm font-semibold uppercase tracking-[0.12em] px-5 py-2 shadow-[0_8px_20px_rgba(30,61,47,0.25)]">
        {badgeLabel(item.valueLabel)}
      </p>

      <div className="overflow-hidden rounded-3xl border border-line shadow-[0_20px_44px_rgba(30,61,47,0.10)]">
        {/* dark title band */}
        <div className="bg-hunter px-6 sm:px-9 pt-7 sm:pt-10 pb-7">
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-snow">
            {item.name}
          </h3>
        </div>

        {/* body: copy left, deliverable mockup right (mockup first on mobile) */}
        <div className="bg-porcelain grid md:grid-cols-[1.15fr_0.85fr] items-center gap-7 md:gap-10 p-6 sm:p-9">
          {item.visual ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:order-last">
              <Image
                src={item.visual.src}
                alt={item.visual.alt}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-5">
            <p className="text-base sm:text-lg text-moss leading-relaxed">
              {item.outcome}
            </p>
            <p className="w-fit rounded-lg bg-hunter text-snow text-sm font-semibold uppercase tracking-[0.12em] px-4 py-2">
              {tag}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * The offer stack as full-width showcase cards — value badge overlapping a
 * dark title band, copy beside a mockup of the deliverable — closing with
 * the full-width crossed-out value tally and one big CTA.
 */
export function OfferShowcase({
  offer,
  intro,
  bonusesIntro,
  closing,
  ctaHref,
}: OfferShowcaseProps) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading
          heading={intro.heading}
          sub={intro.sub}
          align="center"
        />

        <div className="mt-14 space-y-12">
          {offer.items.map((item, i) => (
            <ShowcaseCard
              key={item.name}
              item={item}
              tag="Included"
              delay={(i % 2) as 0 | 1}
            />
          ))}
        </div>

        {offer.bonuses.length > 0 ? (
          <>
            {bonusesIntro ? (
              <Reveal className="mt-16 text-center">
                <h3 className="font-display text-2xl sm:text-3xl">
                  {bonusesIntro.heading}
                </h3>
              </Reveal>
            ) : null}
            <div className="mt-10 space-y-12">
              {offer.bonuses.map((item, i) => (
                <ShowcaseCard
                  key={item.name}
                  item={item}
                  tag={`Free bonus ${i + 1}`}
                  delay={(i % 2) as 0 | 1}
                />
              ))}
            </div>
          </>
        ) : null}

      </div>

      {/* below the stack: full-bleed value tally → big CTA */}
      <Reveal className="mt-20 px-5 sm:px-8 text-center">
        <h3 className="display text-[clamp(2rem,6.5vw,6rem)] leading-[1.05]">
          {closing.preValue}{" "}
          <s className="text-moss/60">{closing.stackValue}</s>{" "}
          {closing.midValue}{" "}
          <em className="not-italic text-gold">{closing.price}</em>
        </h3>

        <Link
          href={ctaHref}
          className="mt-10 block max-w-2xl mx-auto rounded-2xl bg-gradient-to-b from-gold-light to-gold text-hunter px-8 py-6 shadow-[0_20px_44px_rgba(184,145,46,0.35)] transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="block font-display text-2xl sm:text-3xl">
            {closing.ctaPrimary}
          </span>
          <span className="mt-2 block text-xs sm:text-sm tracking-wide text-hunter/80">
            {closing.ctaSecondary}
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
