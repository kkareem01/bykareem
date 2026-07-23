import type { Metadata } from "next";
import Link from "next/link";
import {
  filmReel,
  galleries,
  portfolioCopy,
  stories,
} from "@/content/portfolio";
import { FeaturedStories } from "@/components/sections/FeaturedStories";
import { FilmReel } from "@/components/sections/FilmReel";
import { FinalCta } from "@/components/sections/FinalCta";
import { type GalleryLink } from "@/components/sections/PortfolioGallery";
import { SessionCollage } from "@/components/sections/SessionCollage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  SectionJumpNav,
  type JumpSection,
} from "@/components/ui/SectionJumpNav";

export const metadata: Metadata = {
  title: "Portfolio — Moments, not poses",
  description:
    "Selected wedding, engagement, and graduation work from bykareem — documentary-style photo and film across Georgia, including complete start-to-finish stories.",
};

/** side-rail anchors — ids live on scroll-offset wrappers below */
const jumpSections: JumpSection[] = [
  { id: "film", label: "Film" },
  { id: "couples", label: "Couples" },
  { id: "stories", label: "Stories" },
  { id: "grads", label: "Grads" },
  { id: "book", label: "Book" },
];

/**
 * Film-first landing: the reel proves the feeling in ten seconds, the
 * curated walls stay segmented by audience, and the full stories answer
 * the cherry-picking doubt. A soft CTA sits at peak-emotion mid-scroll,
 * not just at the bottom.
 */
export default function PortfolioPage() {
  const couplesLinks: GalleryLink[] = [portfolioCopy.couplesGallery.cta];
  const gradLinks: GalleryLink[] = [portfolioCopy.gradGallery.cta];

  return (
    <>
      <SectionJumpNav sections={jumpSections} />

      <section className="pt-28 md:pt-36 pb-4">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <SectionHeading
            eyebrow={portfolioCopy.hero.eyebrow}
            heading={portfolioCopy.hero.heading}
            sub={portfolioCopy.hero.sub}
            align="center"
          />
        </div>
      </section>

      <div id="film" className="scroll-mt-20">
        <FilmReel
          eyebrow={portfolioCopy.film.eyebrow}
          heading={portfolioCopy.film.heading}
          poster={filmReel.poster}
          videoSrc={filmReel.videoSrc}
          fallbackNote={portfolioCopy.film.videoFallbackNote}
        />
      </div>

      <div id="couples" className="scroll-mt-20">
        <SessionCollage
          eyebrow={portfolioCopy.couplesGallery.eyebrow}
          heading={portfolioCopy.couplesGallery.heading}
          images={galleries.couples}
          links={couplesLinks}
        />
      </div>

      {/* soft mid-scroll CTA — peak emotion happens mid-page, not at the end */}
      <section className="border-y border-line bg-porcelain">
        <Reveal className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
          <p className="font-display text-lg">{portfolioCopy.midCta.text}</p>
          <Link
            href={portfolioCopy.midCta.href}
            className="font-display italic text-lg text-gold hover:text-gold-deep transition-colors"
          >
            {portfolioCopy.midCta.linkLabel}
          </Link>
        </Reveal>
      </section>

      <div id="stories" className="scroll-mt-20">
        <FeaturedStories
          eyebrow={portfolioCopy.stories.eyebrow}
          heading={portfolioCopy.stories.heading}
          sub={portfolioCopy.stories.sub}
          stories={stories}
          cardCta={portfolioCopy.stories.cardCta}
        />
      </div>

      <div id="grads" className="scroll-mt-20">
        <SessionCollage
          eyebrow={portfolioCopy.gradGallery.eyebrow}
          heading={portfolioCopy.gradGallery.heading}
          images={galleries.graduation}
          links={gradLinks}
          tone="tint"
        />
      </div>

      <div id="book" className="scroll-mt-20">
        <FinalCta
          heading="Like what you see?"
          sub="The free consult call takes 20 minutes and ends with an exact quote for your date."
          cta="Book a Free Consult"
          ctaHref="/book"
        />
      </div>
    </>
  );
}
