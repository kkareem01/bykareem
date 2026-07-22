import type { Metadata } from "next";
import Image from "next/image";
import { weddingsCopy } from "@/content/copy";
import { images } from "@/content/site-config";
import { couplesOffer } from "@/content/offers";
import { couplesTestimonials } from "@/content/testimonials";
import { couplesFaq } from "@/content/faq";
import {
  galleries,
  getStoryByAudience,
  portfolioCopy,
} from "@/content/portfolio";
import { Hero } from "@/components/sections/Hero";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { OfferStack } from "@/components/sections/OfferStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqSection } from "@/components/sections/FaqSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Weddings & Engagements — The Heirloom Experience",
  description:
    "One team for your wedding photos and film in Georgia. Directed so you look like yourselves, sneak peek in 48 hours, delivery dates in writing.",
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
        image={images.weddingsHero}
      />

      {/* narrative */}
      <section className="py-20 md:py-28 bg-mist/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionHeading
              eyebrow={weddingsCopy.narrative.eyebrow}
              heading={weddingsCopy.narrative.heading}
            />
            <Reveal delay={1}>
              <div className="mt-6 space-y-5 text-moss leading-relaxed">
                {weddingsCopy.narrative.body.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={1} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src={images.weddingsStory.src}
                alt={images.weddingsStory.alt}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover img-warm"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* the work — proof before the pitch */}
      <PortfolioGallery
        eyebrow={portfolioCopy.nichePage.couples.eyebrow}
        heading={portfolioCopy.nichePage.couples.heading}
        sub={portfolioCopy.nichePage.couples.sub}
        images={galleries.couples}
        links={galleryLinks}
      />

      <OfferStack
        offer={couplesOffer}
        intro={weddingsCopy.offerIntro}
        bonusesIntro={weddingsCopy.bonusesIntro}
      />

      {/* case studies */}
      <section className="py-20 md:py-28 bg-mist/60">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow={weddingsCopy.caseStudies.eyebrow}
            heading={weddingsCopy.caseStudies.heading}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {weddingsCopy.caseStudies.items.map((story, i) => (
              <Reveal key={story.title} delay={(i % 3) as 0 | 1 | 2}>
                <article className="h-full bg-porcelain border border-line rounded-2xl p-7">
                  <h3 className="font-display text-xl">{story.title}</h3>
                  <p className="mt-3 text-sm text-moss leading-relaxed">
                    {story.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials
        eyebrow="real couples"
        heading="What it's like from the other side of the camera"
        items={couplesTestimonials}
      />

      <FaqSection items={couplesFaq} />

      <GuaranteeSection />

      <FinalCta
        heading={weddingsCopy.finalCta.heading}
        sub={weddingsCopy.finalCta.sub}
        cta={weddingsCopy.finalCta.cta}
        ctaHref="/book?type=couples"
      />
    </>
  );
}
