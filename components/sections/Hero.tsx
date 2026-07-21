import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { GoogleRatingBadge } from "@/components/ui/GoogleRatingBadge";
import { Reveal } from "@/components/ui/Reveal";
import type { ImageSlot } from "@/content/site-config";

type HeroProps = {
  eyebrow?: string;
  /** Google-review trust badge rendered in the eyebrow slot (home hero) */
  googleBadge?: { label: string; srLabel: string };
  /** a plain string flows naturally; an array forces one line per entry below md */
  h1: string | readonly string[];
  h1Accent: string;
  sub: string;
  cta: string;
  ctaHref: string;
  /** one-line trust note directly under the CTA button */
  ctaNote?: string;
  image: ImageSlot;
  /** short trust bullets under the CTA (home hero) */
  trust?: readonly string[];
  /**
   * "split": copy left, tall imagery right (home).
   * "stacked": centered headline → photo → sub + CTA (graduation).
   */
  variant?: "split" | "stacked";
};

function Headline({
  h1,
  h1Accent,
}: {
  h1: string | readonly string[];
  h1Accent: string;
}) {
  return (
    <h1
      className={
        typeof h1 === "string"
          ? "display text-5xl sm:text-6xl md:text-5xl lg:text-6xl"
          : "display text-[7vw] md:text-5xl lg:text-6xl"
      }
    >
      {typeof h1 === "string" ? (
        <>{h1} </>
      ) : (
        h1.map((line) => (
          <span key={line} className="block md:inline">
            {line}{" "}
          </span>
        ))
      )}
      <em className={typeof h1 === "string" ? undefined : "block md:inline"}>
        {h1Accent}
      </em>
    </h1>
  );
}

function CtaBlock({
  cta,
  ctaHref,
  ctaNote,
}: {
  cta: string;
  ctaHref: string;
  ctaNote?: string;
}) {
  return (
    <div className="mt-9">
      <Button href={ctaHref} size="lg">
        {cta}
      </Button>
      {ctaNote ? <p className="mt-3 text-xs text-moss">{ctaNote}</p> : null}
    </div>
  );
}

/** Editorial hero — split (copy/imagery) or centered stacked layout. */
export function Hero({
  eyebrow,
  googleBadge,
  h1,
  h1Accent,
  sub,
  cta,
  ctaHref,
  ctaNote,
  image,
  trust,
  variant = "split",
}: HeroProps) {
  if (variant === "stacked") {
    return (
      <section className="pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 text-center">
          <Reveal>
            {eyebrow ? (
              <p className="eyebrow eyebrow--gold mb-6">{eyebrow}</p>
            ) : null}
            <Headline h1={h1} h1Accent={h1Accent} />
          </Reveal>

          <Reveal delay={1} className="mt-10">
            <div className="relative aspect-[4/5] max-w-md sm:max-w-lg mx-auto overflow-hidden rounded-t-full rounded-b-[2rem]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                sizes="(min-width: 640px) 512px, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-9 text-base sm:text-lg text-moss leading-relaxed max-w-lg mx-auto">
              {sub}
            </p>
            <CtaBlock cta={cta} ctaHref={ctaHref} ctaNote={ctaNote} />
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Mobile: centered stack (headline → sub → CTA → photo).
          Desktop (md+): split layout, copy left / imagery right. */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8 grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal className="text-center md:text-left">
          {googleBadge ? (
            <div className="mb-6 flex justify-center md:justify-start">
              <GoogleRatingBadge
                label={googleBadge.label}
                srLabel={googleBadge.srLabel}
              />
            </div>
          ) : null}
          {eyebrow ? <p className="eyebrow eyebrow--gold mb-6">{eyebrow}</p> : null}
          <Headline h1={h1} h1Accent={h1Accent} />
          <p className="mt-7 text-base sm:text-lg text-moss leading-relaxed max-w-lg mx-auto md:mx-0">
            {sub}
          </p>
          <CtaBlock cta={cta} ctaHref={ctaHref} ctaNote={ctaNote} />
          {trust ? (
            <ul className="mt-8 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
              {trust.map((item) => (
                <li
                  key={item}
                  className="text-xs tracking-wide text-moss flex items-center gap-2"
                >
                  <span aria-hidden className="text-gold">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>

        <Reveal delay={1} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
