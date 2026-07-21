import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Story } from "@/content/portfolio";

type FeaturedStoriesProps = {
  eyebrow: string;
  heading: string;
  sub?: string;
  stories: Story[];
  cardCta: string;
};

/**
 * Links to complete-event albums. Covers are uniformly cropped 4:5 here —
 * the card grid needs the consistency; the story pages themselves show
 * every image at its natural ratio.
 */
export function FeaturedStories({
  eyebrow,
  heading,
  sub,
  stories,
  cardCta,
}: FeaturedStoriesProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow={eyebrow}
          heading={heading}
          sub={sub}
          align="center"
        />

        <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {stories.map((story, i) => (
            <Reveal key={story.slug} delay={(i % 2) as 0 | 1}>
              <Link
                href={`/portfolio/${story.slug}`}
                className="group block overflow-hidden rounded-2xl border border-line bg-porcelain"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={story.cover.src}
                    alt={story.cover.alt}
                    fill
                    sizes="(min-width: 768px) 28rem, 92vw"
                    className="object-cover img-warm transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl">{story.title}</h3>
                  <p className="mt-1 text-sm text-moss">{story.location}</p>
                  <p className="mt-4 font-display italic text-gold transition-colors group-hover:text-gold-deep">
                    {cardCta} →
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
