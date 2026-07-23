import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

type FinalCtaProps = {
  heading: string;
  sub: string;
  cta: string;
  ctaHref: string;
  /** optional second, outlined CTA next to the primary (two-path funnel) */
  secondaryCta?: { label: string; href: string };
  /** one-line trust note directly under the CTA button */
  ctaNote?: string;
};

export function FinalCta({
  heading,
  sub,
  cta,
  ctaHref,
  secondaryCta,
  ctaNote,
}: FinalCtaProps) {
  return (
    <section className="py-24 md:py-32 bg-hunter text-snow">
      <Reveal className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <h2 className="display text-3xl sm:text-4xl md:text-5xl text-snow">
          {heading}
        </h2>
        <p className="mt-6 text-lg text-snow/70 leading-relaxed">{sub}</p>
        <div className="mt-10">
          <div className="flex flex-col items-center gap-3">
            <Button href={ctaHref} size="lg">
              {cta}
            </Button>
            {secondaryCta ? (
              <Button href={secondaryCta.href} size="lg" variant="ghost-inverse">
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
          {ctaNote ? (
            <p className="mt-3 text-xs text-snow/60">{ctaNote}</p>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
