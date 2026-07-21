import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/content/testimonials";

type TestimonialsProps = {
  eyebrow?: string;
  heading: string;
  items: readonly Testimonial[];
};

export function Testimonials({ eyebrow, heading, items }: TestimonialsProps) {
  return (
    <section className="py-20 md:py-28 bg-mist/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <Reveal key={t.names} delay={(i % 3) as 0 | 1 | 2}>
              <figure className="h-full bg-porcelain border border-line rounded-2xl p-7 flex flex-col gap-5">
                <blockquote className="font-display text-lg leading-relaxed flex-1">
                  “{t.quote}”
                </blockquote>
                <figcaption className="text-sm">
                  <span className="text-hunter">{t.names}</span>
                  <span className="text-moss"> — {t.context}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
