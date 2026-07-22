import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionCta, type SectionCtaContent } from "@/components/ui/SectionCta";
import type { GalleryLink } from "@/components/sections/PortfolioGallery";
import type { PortfolioImage } from "@/content/portfolio";

type SessionCollageProps = {
  eyebrow?: string;
  heading: string;
  sub?: string;
  images: PortfolioImage[];
  /** gold italic links rendered under the collage (story page, niche page…) */
  links?: GalleryLink[];
  tone?: "plain" | "tint";
  /** closes the section with a booking button under the collage */
  cta?: SectionCtaContent;
};

/**
 * Per-index composition. Three layers per entry:
 * - phone (default): a zigzag — photos alternate left/right at varied
 *   widths, tilted, each pulled up into the one before so they read as
 *   prints overlapping down a table, not a flat stack
 * - sm (2-col grid): full-width cells, odd column pushed down
 * - lg (3-col grid): each column at its own height
 * Tilts stay on at every size; hover straightens and lifts the print.
 * 15 entries so galleries up to the 12–15 curation cap never cycle.
 */
const LAYOUT = [
  "justify-self-start w-[86%] -rotate-[1.6deg] sm:w-full sm:justify-self-auto",
  "justify-self-end w-[78%] rotate-[1.4deg] -mt-8 sm:mt-0 sm:w-full sm:justify-self-auto sm:translate-y-10 lg:translate-y-16",
  "justify-self-start w-[84%] -rotate-[0.9deg] -mt-6 sm:mt-0 sm:w-full sm:justify-self-auto lg:translate-y-8",
  "justify-self-end w-[80%] rotate-[1.7deg] -mt-8 sm:mt-0 sm:w-full sm:justify-self-auto sm:translate-y-10 lg:translate-y-0",
  "justify-self-start w-[88%] -rotate-[1.2deg] -mt-10 sm:mt-0 sm:w-full sm:justify-self-auto lg:translate-y-16",
  "justify-self-end w-[76%] rotate-[1deg] -mt-6 sm:mt-0 sm:w-full sm:justify-self-auto sm:translate-y-10 lg:translate-y-8",
  "justify-self-start w-[82%] -rotate-[1.5deg] -mt-8 sm:mt-0 sm:w-full sm:justify-self-auto lg:translate-y-0",
  "justify-self-end w-[86%] rotate-[1.3deg] -mt-10 sm:mt-0 sm:w-full sm:justify-self-auto sm:translate-y-10 lg:translate-y-16",
  "justify-self-start w-[78%] -rotate-[0.8deg] -mt-6 sm:mt-0 sm:w-full sm:justify-self-auto lg:translate-y-8",
  "justify-self-end w-[84%] rotate-[1.6deg] -mt-8 sm:mt-0 sm:w-full sm:justify-self-auto sm:translate-y-10 lg:translate-y-0",
  "justify-self-start w-[80%] -rotate-[1.1deg] -mt-8 sm:mt-0 sm:w-full sm:justify-self-auto lg:translate-y-16",
  "justify-self-end w-[88%] rotate-[0.9deg] -mt-10 sm:mt-0 sm:w-full sm:justify-self-auto sm:translate-y-10 lg:translate-y-8",
  "justify-self-start w-[84%] -rotate-[1.3deg] -mt-8 sm:mt-0 sm:w-full sm:justify-self-auto lg:translate-y-0",
  "justify-self-end w-[78%] rotate-[1.5deg] -mt-6 sm:mt-0 sm:w-full sm:justify-self-auto sm:translate-y-10 lg:translate-y-16",
  "justify-self-start w-[86%] -rotate-[1deg] -mt-8 sm:mt-0 sm:w-full sm:justify-self-auto lg:translate-y-8",
];

/**
 * The phone zigzag hugs left/right — but the final print centers instead,
 * so the collage ends on a resolved beat rather than trailing off to one
 * side. Only the mobile alignment changes: the entry's first
 * justify-self-* is the phone one (the sm: reset never matches this
 * pattern), and sm/lg classes pass through untouched.
 */
function layoutFor(index: number, count: number): string {
  const entry = LAYOUT[index % LAYOUT.length];
  if (index !== count - 1) return entry;
  return entry.replace(/justify-self-(start|end)/, "justify-self-center");
}

/**
 * The curated wall as a static editorial collage. No carousel, no
 * autoplay, nothing to swipe: every photo is on the page, but the
 * staggered columns, mixed print sizes, and slight tilts make it read as
 * a curated pinboard instead of a stacked feed. Natural aspect ratios
 * throughout — no forced crops.
 */
export function SessionCollage({
  eyebrow,
  heading,
  sub,
  images,
  links = [],
  tone = "plain",
  cta,
}: SessionCollageProps) {
  return (
    <section
      className={`py-14 md:py-20 overflow-x-clip ${tone === "tint" ? "bg-mist/60" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          sub={sub}
          align="center"
        />

        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-0 sm:gap-x-8 sm:gap-y-10 lg:gap-x-10 items-start sm:pb-12 lg:pb-20">
          {images.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 3) as 0 | 1 | 2}
              className={`${layoutFor(i, images.length)} relative transition-transform duration-500 hover:rotate-0 hover:scale-[1.03] hover:z-10`}
            >
              <div className="overflow-hidden rounded-xl shadow-[0_14px_36px_rgba(30,61,47,0.16)]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 86vw"
                  className="w-full h-auto img-warm"
                />
              </div>
            </Reveal>
          ))}
        </div>

        {links.length > 0 ? (
          <Reveal className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 text-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display italic text-lg text-gold hover:text-gold-deep transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </Reveal>
        ) : null}

        {cta ? <SectionCta cta={cta} className="mt-10" /> : null}
      </div>
    </section>
  );
}
