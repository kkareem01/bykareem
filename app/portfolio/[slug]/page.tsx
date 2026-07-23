import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStory, portfolioCopy, stories } from "@/content/portfolio";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return {
    title: `${story.title} — ${story.location}`,
    description: story.intro,
  };
}

const bookHref = {
  couples: "/book?type=couples",
  graduation: "/book?type=graduation",
} as const;

/**
 * A single day told start to finish — the anti-cherry-picking page.
 * Narrower two-column masonry so it reads like an album, every image at
 * its natural ratio, no lightbox: scroll is the whole interaction.
 */
export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return (
    <>
      <section className="pt-28 md:pt-36 pb-16 md:pb-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <Link
              href={portfolioCopy.storyPage.backHref}
              className="text-sm text-moss hover:text-gold transition-colors"
            >
              {portfolioCopy.storyPage.backLabel}
            </Link>
          </Reveal>
          <Reveal delay={1} className="mt-8 max-w-2xl">
            <p className="eyebrow eyebrow--gold mb-4">{story.location}</p>
            <h1 className="display text-4xl sm:text-5xl md:text-6xl">
              {story.title}
            </h1>
            <p className="mt-6 text-moss text-lg leading-relaxed">
              {story.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="columns-1 md:columns-2 gap-4">
            {story.images.map((img, i) => (
              <Reveal
                key={img.src}
                delay={(i % 2) as 0 | 1}
                className="mb-4 break-inside-avoid"
              >
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(min-width: 768px) 45vw, 92vw"
                    className="w-full h-auto img-warm"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        heading="Want a day that looks like this?"
        sub="The free chat takes 20 minutes and ends with an exact quote for your date."
        cta="Tell Me About Your Day"
        ctaHref={bookHref[story.audience]}
      />
    </>
  );
}
