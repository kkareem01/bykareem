import type { Metadata } from "next";
import { weddingsCopy } from "@/content/weddings-copy";
import { couplesReviewShots, images } from "@/content/site-config";
import { couplesOffer } from "@/content/offers";
import { couplesFaq } from "@/content/faq";
import {
  couplesCouldBeYouShots,
  couplesSessionStrip,
  getStoryByAudience,
  portfolioCopy,
} from "@/content/portfolio";
import { SessionCollage } from "@/components/sections/SessionCollage";
import { Hero } from "@/components/sections/Hero";
import { CouldBeYouWall } from "@/components/sections/CouldBeYouWall";
import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { AudienceFilter } from "@/components/sections/AudienceFilter";
import { OfferShowcase } from "@/components/sections/OfferShowcase";
import { ReviewsWall } from "@/components/sections/ReviewsWall";
import { FaqSection } from "@/components/sections/FaqSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";

export const metadata: Metadata = {
  title: "Weddings & Engagements — The Whole Story Experience",
  description:
    "Wedding photos and cinema from one directed team in Georgia. Every moment mapped before the day, sneak peek in 48 hours — guaranteed in writing.",
};

export default function WeddingsPage() {
  const weddingStory = getStoryByAudience("couples");
  const galleryLinks = weddingStory
    ? [
        {
          label: portfolioCopy.nichePage.couples.storyLinkLabel,
          href: `/portfolio/${weddingStory.slug}`,
        },
      ]
    : [];

  return (
    <>
      <Hero
        eyebrow={weddingsCopy.hero.eyebrow}
        h1={weddingsCopy.hero.h1}
        h1Accent={weddingsCopy.hero.h1Accent}
        sub={weddingsCopy.hero.sub}
        cta={weddingsCopy.hero.cta}
        ctaHref="/book?type=couples"
        ctaNote={weddingsCopy.ctaNote}
        image={images.weddingsHero}
        variant="stacked"
      />

      {/* 1 — their current circumstances, closed out by a consult button */}
      <NarrativeSection
        heading={weddingsCopy.problem.heading}
        paragraphs={weddingsCopy.problem.paragraphs}
        cta={{
          label: weddingsCopy.hero.cta,
          href: "/book?type=couples",
          note: weddingsCopy.ctaNote,
        }}
      />

      {/* social proof — real client messages, same wall as the home page */}
      <ReviewsWall
        heading={weddingsCopy.socialProof.heading}
        shots={couplesReviewShots}
      />

      {/* 2 — the dream outcome */}
      <NarrativeSection
        heading={weddingsCopy.dream.heading}
        paragraphs={weddingsCopy.dream.paragraphs}
        tone="tint"
      />

      {/* 3 — show the dream, don't just describe it */}
      <CouldBeYouWall
        heading={portfolioCopy.nichePage.couples.heading}
        shots={couplesCouldBeYouShots}
        links={galleryLinks}
      />

      {/* 4 — self-select before the pitch, closed out by a consult button */}
      <AudienceFilter
        heading={weddingsCopy.filter.heading}
        notFor={weddingsCopy.filter.notFor}
        builtFor={weddingsCopy.filter.builtFor}
        cta={{
          label: weddingsCopy.hero.cta,
          href: "/book?type=couples",
          note: weddingsCopy.ctaNote,
        }}
      />

      {/* photo proof right before the pitch — celebration energy as a
          static editorial collage */}
      <SessionCollage
        heading={weddingsCopy.sessionStrip.heading}
        sub={weddingsCopy.sessionStrip.sub}
        images={couplesSessionStrip}
        cta={{
          label: weddingsCopy.hero.cta,
          href: "/book?type=couples",
          note: weddingsCopy.ctaNote,
        }}
      />

      {/* 5 — the bridge: named offer + value stack */}
      <OfferShowcase
        offer={couplesOffer}
        intro={weddingsCopy.offerIntro}
        bonusesIntro={weddingsCopy.bonusesIntro}
        closing={weddingsCopy.offerClosing}
        ctaHref="/book?type=couples"
        ctaNote={weddingsCopy.ctaNote}
      />

      <FaqSection items={couplesFaq} eyebrow={null} />

      {/* the guarantee closes the page — consult CTA sits under the promise */}
      <GuaranteeSection
        cta={{
          label: weddingsCopy.finalCta.cta,
          href: "/book?type=couples",
          note: weddingsCopy.ctaNote,
        }}
      />
    </>
  );
}
