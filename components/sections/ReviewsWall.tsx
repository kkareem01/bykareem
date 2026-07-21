import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import type { ReviewShot } from "@/content/site-config";

type ReviewsWallProps = {
  heading: string;
  shots: ReviewShot[];
};

/**
 * Deliberately not a "section": no background change, no eyebrow — just a
 * headline over a masonry wall of client message screenshots. CSS columns
 * let each screenshot keep its natural aspect ratio (they range from
 * one-line texts to full chat threads) without overlapping.
 */

const TILT = ["-rotate-1", "rotate-1", "rotate-0", "-rotate-1", "rotate-1", "-rotate-1"];

export function ReviewsWall({ heading, shots }: ReviewsWallProps) {
  return (
    <div className="py-20 md:py-28 overflow-x-clip">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="display text-3xl sm:text-4xl md:text-5xl">{heading}</h2>
        </Reveal>

        <div className="mt-14 md:mt-20 columns-1 sm:columns-2 lg:columns-3 gap-6 max-w-xs sm:max-w-2xl lg:max-w-5xl mx-auto">
          {shots.map((shot, i) => (
            <Reveal
              key={shot.src}
              delay={(i % 2) as 0 | 1}
              className={`${TILT[i % TILT.length]} mb-6 break-inside-avoid transition-transform duration-300 hover:scale-[1.02] hover:rotate-0 relative`}
            >
              <div className="overflow-hidden rounded-2xl border border-line bg-porcelain p-3 shadow-[0_16px_36px_rgba(30,61,47,0.12)]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
