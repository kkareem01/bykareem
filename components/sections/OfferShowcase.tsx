import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Offer, OfferItem } from "@/content/offers";

type OfferClosing = {
  preValue: string;
  stackValue: string;
  midValue: string;
  priceLead: string;
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
  /** one-line trust note directly under the CTA */
  ctaNote?: string;
};

/** "$550 value" → "Value: $550"; "included" → "Included" */
function badgeLabel(valueLabel: string): string {
  if (valueLabel.toLowerCase() === "included") return "Included";
  return `Value: ${valueLabel.replace(/ value$/i, "")}`;
}

/** First word stays white; the remainder gets the gold-foil treatment. */
function splitName(name: string): { lead: string; rest: string } {
  const idx = name.indexOf(" ");
  if (idx === -1) return { lead: name, rest: "" };
  return { lead: name.slice(0, idx), rest: name.slice(idx + 1) };
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
  const { lead, rest } = splitName(item.name);
  return (
    <Reveal delay={delay} className="relative">
      {/* value badge — reflective gold bar overlaying the card's top edge;
          white text kept legible with a bronze edge + dark text-shadow */}
      <p className="gold-bar absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 sm:left-9 sm:translate-x-0 z-20 whitespace-nowrap rounded-xl text-snow [text-shadow:0_1px_2px_rgba(70,48,8,0.7),0_2px_10px_rgba(70,48,8,0.35)] [-webkit-text-stroke:0.5px_#ffffff] ring-1 ring-gold-deep/70 text-lg sm:text-[1.35rem] font-extrabold uppercase tracking-[0.04em] px-4 sm:px-6 py-1.5 sm:py-2.5 shadow-[0_10px_24px_rgba(150,115,31,0.4)]">
        {badgeLabel(item.valueLabel)}
      </p>

      <div className="overflow-hidden rounded-3xl border border-line shadow-[0_20px_44px_rgba(30,61,47,0.10)]">
        {/* slim dark title band — right side stays clear for the overlaying visual */}
        <div className="bg-hunter px-6 sm:px-9 pt-8 pb-3.5 sm:pt-10 sm:pb-5 md:pr-[44%]">
          <h3 className="font-cinema font-extrabold text-[1.55rem] sm:text-[1.95rem] lg:text-[2.65rem] leading-[1.15] text-snow">
            <span className="[-webkit-text-stroke:0.4px_#ffffff]">{lead}</span>
            {rest ? (
              <>
                {" "}
                <span className="text-gold-foil">{rest}</span>
              </>
            ) : null}
          </h3>
        </div>

        {/* body: copy left; the visual starts at the card's top and overlays
            down across the band on desktop (stacks first on mobile, kept
            short there so ~1.5 cards fit per screen) */}
        <div className="bg-porcelain grid md:grid-cols-[1.15fr_0.85fr] items-center md:items-start gap-4 md:gap-10 p-4 sm:p-9">
          {item.visual ? (
            <div className="relative aspect-[16/9] md:aspect-[4/3] overflow-hidden rounded-2xl md:order-last md:-mt-24 z-10 md:shadow-[0_18px_40px_rgba(20,43,33,0.30)]">
              <Image
                src={item.visual.src}
                alt={item.visual.alt}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:gap-5">
            <p className="text-base sm:text-lg text-moss leading-relaxed">
              {item.outcome}
            </p>
            <p className="w-fit rounded-lg bg-hunter text-snow text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] px-4 py-1.5 sm:py-2">
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
  ctaNote,
}: OfferShowcaseProps) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHeading
          heading={intro.heading}
          sub={intro.sub}
          align="center"
        />

        <div className="mt-14 space-y-9 sm:space-y-12">
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
            <div className="mt-10 space-y-9 sm:space-y-12">
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
        <h3 className="display text-[clamp(2.5rem,11vw,2.875rem)] sm:text-[clamp(2rem,5vw,4.5rem)] leading-[1.05]">
          <span className="block">
            {closing.preValue}{" "}
            <s className="text-moss/60">{closing.stackValue}</s>{" "}
            {closing.midValue}
          </span>
          <span className="block">
            {closing.priceLead}{" "}
            <em className="not-italic text-gold">{closing.price}</em>
          </span>
        </h3>

        <Link
          href={ctaHref}
          className="mt-10 block max-w-sm mx-auto rounded-xl bg-gradient-to-b from-gold-light to-gold text-hunter px-4 py-2.5 shadow-[0_20px_44px_rgba(184,145,46,0.35)] transition-transform duration-200 hover:scale-[1.02]"
        >
          <span className="block font-semibold uppercase tracking-wide text-white text-[clamp(1.25rem,5.5vw,1.625rem)]">
            {closing.ctaPrimary}
          </span>
          <span className="mt-0.5 block text-sm tracking-wide text-hunter/80">
            {closing.ctaSecondary}
          </span>
        </Link>
        {ctaNote ? <p className="mt-4 text-xs text-moss">{ctaNote}</p> : null}
      </Reveal>
    </section>
  );
}
