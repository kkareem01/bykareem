import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Faq } from "@/content/faq";

type FaqSectionProps = {
  items: readonly Faq[];
  /** pass null to render the heading without an eyebrow */
  eyebrow?: string | null;
  heading?: string;
};

/** Native <details> accordion + FAQPage JSON-LD for rich results. */
export function FaqSection({
  items,
  eyebrow = "questions",
  heading = "Frequently Asked Questions",
}: FaqSectionProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} heading={heading} />
        <Reveal className="mt-10">
          <div>
            {items.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <p className="pb-6 text-moss leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
