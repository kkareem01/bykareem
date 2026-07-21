import { Reveal } from "@/components/ui/Reveal";
import type { Offer } from "@/content/offers";

/**
 * The offer closer: guarantee, honest scarcity, and the value-anchor
 * pricing frame. Shared by OfferStack (cards) and OfferLedger (rows).
 */
export function OfferSummaryPanel({
  offer,
  className = "",
}: {
  offer: Offer;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="rounded-2xl bg-hunter text-snow p-8 md:p-12 grid gap-10 md:grid-cols-2">
        <div>
          <p className="eyebrow text-gold-light mb-4">{offer.guarantee.name}</p>
          <p className="font-display text-2xl leading-snug">
            {offer.guarantee.terms}
          </p>
          {offer.guarantee.finePrint ? (
            <p className="mt-4 text-xs text-snow/40">
              {offer.guarantee.finePrint}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col justify-between gap-8">
          <div>
            <p className="eyebrow text-gold-light mb-4">
              {offer.scarcity.limit}{" "}
              {offer.audience === "couples" ? "weddings" : "sessions"}{" "}
              {offer.scarcity.window}
            </p>
            <p className="text-sm text-snow/70 leading-relaxed">
              {offer.scarcity.reason}
            </p>
          </div>
          <div className="border-t border-snow/15 pt-6">
            <p className="text-sm text-snow/50 line-through">
              {offer.pricing.stackValueLabel}
            </p>
            <p className="font-display text-2xl mt-1">
              {offer.pricing.investmentLabel}
            </p>
            <p className="mt-2 text-xs text-snow/40">{offer.pricing.note}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
