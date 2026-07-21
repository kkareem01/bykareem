import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import type { GalleryLink } from "@/components/sections/PortfolioGallery";
import type { PortfolioImage } from "@/content/portfolio";

type CouldBeYouWallProps = {
  heading: string;
  shots: PortfolioImage[];
  links?: GalleryLink[];
};

/**
 * Social-proof pile for the graduation page: client IG-post screenshots
 * framed as tilted, overlapping polaroid-style cards (same language as the
 * home page ReviewsWall) so they read as exhibits, not a live feed you can
 * tap. Hover lifts a card straight and to the front.
 */

const SCATTER = [
  "-rotate-3 lg:translate-y-8",
  "rotate-2 lg:-translate-y-3",
  "-rotate-2 lg:translate-y-12",
  "rotate-3 lg:-translate-y-2",
  "-rotate-1 lg:translate-y-7",
];

export function CouldBeYouWall({ heading, shots, links = [] }: CouldBeYouWallProps) {
  return (
    <section className="py-14 md:py-20 overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="display text-4xl sm:text-5xl md:text-6xl">
            {heading}
          </h2>
        </Reveal>

        <div className="mt-12 lg:mt-20 flex flex-wrap justify-center -my-4">
          {shots.map((shot, i) => (
            <Reveal
              key={shot.src}
              delay={(i % 3) as 0 | 1 | 2}
              className={`${SCATTER[i % SCATTER.length]} relative w-48 sm:w-56 lg:w-60 shrink-0 -mx-3 sm:-mx-4 my-4 transition-transform duration-300 hover:rotate-0 hover:scale-105 hover:z-20`}
            >
              <div className="overflow-hidden rounded-2xl border border-line bg-porcelain p-2.5 shadow-[0_16px_36px_rgba(30,61,47,0.14)]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  sizes="(min-width: 640px) 240px, 192px"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </Reveal>
          ))}
        </div>

        {links.length > 0 ? (
          <Reveal className="mt-12 lg:mt-16 flex flex-wrap justify-center gap-x-8 gap-y-2 text-center">
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
      </div>
    </section>
  );
}
