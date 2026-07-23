import Image from "next/image";
import { homeCopy } from "@/content/copy";
import { images, reviewShots } from "@/content/site-config";
import { couplesFaq } from "@/content/faq";
import { Hero } from "@/components/sections/Hero";
import { ReviewsWall } from "@/components/sections/ReviewsWall";
import { FaqSection } from "@/components/sections/FaqSection";
import { GuaranteeSection } from "@/components/sections/GuaranteeSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      <Hero
        googleBadge={homeCopy.hero.googleBadge}
        h1={homeCopy.hero.h1}
        h1Accent={homeCopy.hero.h1Accent}
        sub={homeCopy.hero.sub}
        cta={homeCopy.paths.weddings.label}
        ctaHref={homeCopy.paths.weddings.href}
        secondaryCta={homeCopy.paths.graduation}
        image={images.homeHero}
        trust={homeCopy.hero.trust}
      />

      <ReviewsWall heading={homeCopy.reviews.heading} shots={reviewShots} />

      {/* about me — headline, then photo, then the story below it */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 flex flex-col items-center">
          <SectionHeading
            eyebrow={homeCopy.about.eyebrow}
            heading={homeCopy.about.heading}
            align="center"
          />
          <Reveal delay={1} className="mt-10 w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-[2rem]">
              <Image
                src={images.aboutPortrait.src}
                alt={images.aboutPortrait.alt}
                fill
                sizes="(min-width: 640px) 448px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={2} className="mt-10">
            <div className="space-y-5 text-moss leading-relaxed">
              {homeCopy.about.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* path picker — the only two doors on this site */}
      <section className="border-y border-line bg-porcelain">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 md:py-20">
          <Reveal className="text-center">
            <SectionHeading
              eyebrow={homeCopy.pathCta.eyebrow}
              heading={homeCopy.pathCta.heading}
              align="center"
            />
            <p className="mt-5 text-moss leading-relaxed max-w-lg mx-auto">
              {homeCopy.pathCta.sub}
            </p>
            <div className="mt-9 flex flex-col items-center gap-3">
              <Button href={homeCopy.paths.weddings.href} size="lg">
                {homeCopy.paths.weddings.label}
              </Button>
              <Button
                href={homeCopy.paths.graduation.href}
                size="lg"
                variant="ghost"
              >
                {homeCopy.paths.graduation.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection items={couplesFaq} />

      <GuaranteeSection />

      <FinalCta
        heading={homeCopy.finalCta.heading}
        sub={homeCopy.finalCta.sub}
        cta={homeCopy.paths.weddings.label}
        ctaHref={homeCopy.paths.weddings.href}
        secondaryCta={homeCopy.paths.graduation}
      />
    </>
  );
}
