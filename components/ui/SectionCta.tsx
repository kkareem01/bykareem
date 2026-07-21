import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export type SectionCtaContent = {
  label: string;
  href: string;
  /** one-line trust note directly under the button */
  note?: string;
};

/**
 * A centered CTA rendered inside a section's own container, so the button
 * closes out the section instead of floating between sections.
 */
export function SectionCta({
  cta,
  className = "mt-10",
}: {
  cta: SectionCtaContent;
  className?: string;
}) {
  return (
    <Reveal className={`text-center ${className}`}>
      <Button href={cta.href} size="lg">
        {cta.label}
      </Button>
      {cta.note ? <p className="mt-3 text-xs text-moss">{cta.note}</p> : null}
    </Reveal>
  );
}
