import type { Metadata } from "next";
import { contactCopy } from "@/content/copy";
import { images, site } from "@/content/site-config";
import { generalFaq } from "@/content/faq";
import { Hero } from "@/components/sections/Hero";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Contact — Book a Free Call",
  description:
    "Proposals, birthdays, brand shoots, events — tell me what you're planning. Every message gets a reply within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        eyebrow={contactCopy.hero.eyebrow}
        h1={contactCopy.hero.h1}
        h1Accent={contactCopy.hero.h1Accent}
        sub={contactCopy.hero.sub}
        cta={contactCopy.hero.cta}
        ctaHref="/book?type=general"
        image={images.contactHero}
      />

      {/* direct contact */}
      <section className="py-20 md:py-28 bg-mist/60">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <SectionHeading
            eyebrow="direct line"
            heading={contactCopy.direct.heading}
            sub={contactCopy.direct.sub}
            align="center"
          />
          <Reveal delay={1}>
            <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4 font-display text-xl">
              <a
                href={`mailto:${site.email}`}
                className="text-gold hover:text-gold-deep transition-colors"
              >
                {site.email}
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-deep transition-colors"
              >
                @{site.name} on Instagram
              </a>
            </div>
            <p className="mt-6 text-sm text-moss">{site.serviceArea}</p>
          </Reveal>
        </div>
      </section>

      <FaqSection items={generalFaq} />

      <FinalCta
        heading="The calendar answers faster than email."
        sub="Grab a free 20-minute call — you'll leave with a straight answer and an exact quote, whatever you're planning."
        cta={contactCopy.hero.cta}
        ctaHref="/book?type=general"
      />
    </>
  );
}
