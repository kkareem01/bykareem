import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type NarrativeSectionProps = {
  eyebrow?: string;
  heading: string;
  paragraphs: readonly string[];
  /** alternate section background for visual rhythm between narratives */
  tone?: "light" | "tint";
};

/**
 * Long-form persuasion block: headline + stacked paragraphs that speak
 * directly to the reader's circumstances (LSM-style narrative section).
 */
export function NarrativeSection({
  eyebrow,
  heading,
  paragraphs,
  tone = "light",
}: NarrativeSectionProps) {
  const bg = tone === "tint" ? "bg-mist/60" : "";
  return (
    <section className={`py-14 md:py-20 ${bg}`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} heading={heading} size="large" />
        <Reveal delay={1}>
          <div className="mt-8 space-y-6 text-moss text-lg leading-relaxed">
            {paragraphs.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
