import type { Metadata } from "next";
import { graduationCopy } from "@/content/graduation-copy";
import { gradReviewShots, images } from "@/content/site-config";
import { graduationOffer } from "@/content/offers";
import { graduationTestimonials } from "@/content/testimonials";
import { graduationFaq } from "@/content/faq";
import { capacity } from "@/content/booking-config";
import {
  getStoryByAudience,
  gradCouldBeYouShots,
  portfolioCopy,
} from "@/content/portfolio";
import { Hero } from "@/components/sections/Hero";
import { CouldBeYouWall } from "@/components/sections/CouldBeYouWall";
import { NarrativeSection } from "@/components/sections/NarrativeSection";
import { AudienceFilter } from "@/components/sections/AudienceFilter";
import { OfferShowcase } from "@/components/sections/OfferShowcase";
import { ReviewsWall } from "@/components/sections/ReviewsWall";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Graduation Sessions — The Milestone Session",
  description:
    "Directed graduation photo sessions on Georgia campuses. Gallery back in 72 hours — before the announcements go out. UGA, Georgia Tech, and beyond.",
};

export default function GraduationPage() {
  const gradStory = getStoryByAudience("graduation");
  const galleryLinks = gradStory
    ? [
        {
          label: portfolioCopy.nichePage.graduation.storyLinkLabel,
          href: `/portfolio/${gradStory.slug}`,
        },
      ]
    : [];

  return (
    <>
      <Hero
        eyebrow={graduationCopy.hero.eyebrow}
        h1={graduationCopy.hero.h1}
        h1Accent={graduationCopy.hero.h1Accent}
        sub={graduationCopy.hero.sub}
        cta={graduationCopy.hero.cta}
        ctaHref="/book?type=graduation"
        image={images.gradHero}
      />

      <section className="bg-mist/60">
        <Reveal className="mx-auto max-w-6xl px-5 sm:px-8 py-8 text-center">
          <p className="eyebrow eyebrow--gold">
            {capacity.gradSlotsRemaining} session slots remaining this grad
            season
          </p>
        </Reveal>
      </section>

      {/* 1 — their current circumstances */}
      <NarrativeSection
        heading={graduationCopy.problem.heading}
        paragraphs={graduationCopy.problem.paragraphs}
      />

      {/* social proof — real client messages, same wall as the home page */}
      <ReviewsWall
        heading={graduationCopy.socialProof.heading}
        shots={gradReviewShots}
      />

      {/* 2 — the dream outcome */}
      <NarrativeSection
        heading={graduationCopy.dream.heading}
        paragraphs={graduationCopy.dream.paragraphs}
        tone="tint"
      />

      {/* 3 — show the dream, don't just describe it */}
      <CouldBeYouWall
        heading={portfolioCopy.nichePage.graduation.heading}
        shots={gradCouldBeYouShots}
        links={galleryLinks}
      />

      {/* 4 — self-select before the pitch */}
      <AudienceFilter
        heading={graduationCopy.filter.heading}
        notFor={graduationCopy.filter.notFor}
        builtFor={graduationCopy.filter.builtFor}
      />

      {/* 5 — the bridge: named offer + value stack */}
      <OfferShowcase
        offer={graduationOffer}
        intro={graduationCopy.offerIntro}
        bonusesIntro={graduationCopy.bonusesIntro}
        closing={graduationCopy.offerClosing}
        ctaHref="/book?type=graduation"
      />

      <Testimonials
        heading="From “I don't take good photos” to this"
        items={graduationTestimonials}
      />

      <FaqSection items={graduationFaq} eyebrow={null} />

      <FinalCta
        heading={graduationCopy.finalCta.heading}
        sub={graduationCopy.finalCta.sub}
        cta={graduationCopy.finalCta.cta}
        ctaHref="/book?type=graduation"
      />
    </>
  );
}
