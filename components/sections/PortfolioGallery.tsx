import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionCta, type SectionCtaContent } from "@/components/ui/SectionCta";
import type { PortfolioImage } from "@/content/portfolio";

export type GalleryLink = { label: string; href: string };

type PortfolioGalleryProps = {
  eyebrow?: string;
  heading: string;
  sub?: string;
  images: PortfolioImage[];
  /** gold italic links rendered under the wall (story page, niche page…) */
  links?: GalleryLink[];
  tone?: "plain" | "tint";
  /** tighter vertical padding — matches the graduation page section rhythm */
  dense?: boolean;
  /** closes the section with a booking button under the wall */
  cta?: SectionCtaContent;
};

/**
 * The curated wall. CSS columns keep every photo at its natural aspect
 * ratio — no forced crops. Single column on phones on purpose: at two-up
 * mobile widths a facial expression stops reading, and most traffic is
 * mobile. Scroll is the only interaction; no lightbox, no carousel.
 */
export function PortfolioGallery({
  eyebrow,
  heading,
  sub,
  images,
  links = [],
  tone = "plain",
  dense = false,
  cta,
}: PortfolioGalleryProps) {
  return (
    <section
      className={`${dense ? "py-14 md:py-20" : "py-20 md:py-28"} ${tone === "tint" ? "bg-mist/60" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          sub={sub}
          align="center"
        />

        <div className="mt-12 md:mt-16 columns-1 sm:columns-2 lg:columns-3 gap-4">
          {images.map((img, i) => (
            <Reveal
              key={img.src}
              delay={(i % 3) as 0 | 1 | 2}
              className="mb-4 break-inside-avoid"
            >
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
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

        {cta ? <SectionCta cta={cta} /> : null}
      </div>
    </section>
  );
}
