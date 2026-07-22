import { GuaranteeSeal } from "@/components/ui/GuaranteeSeal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionCta, type SectionCtaContent } from "@/components/ui/SectionCta";
import { satisfactionGuarantee, type Guarantee } from "@/content/guarantee";

/**
 * Seal-stamped satisfaction guarantee — badge, eyebrow, two-tone headline,
 * one-paragraph promise. Pass `cta` when this section closes the page and
 * the booking button should sit directly under the promise.
 */
export function GuaranteeSection({
  guarantee = satisfactionGuarantee,
  cta,
}: {
  guarantee?: Guarantee;
  cta?: SectionCtaContent;
}) {
  return (
    <section className="pb-20 md:pb-28 pt-4">
      <Reveal className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <GuaranteeSeal className="mx-auto w-36 sm:w-44" />
        <p className="eyebrow mt-10" style={{ color: "#000" }}>
          {guarantee.eyebrow}
        </p>
        <h2 className="display mt-4 text-3xl sm:text-4xl md:text-5xl">
          {guarantee.headingPre} <em>{guarantee.headingAccent}</em>{" "}
          {guarantee.headingPost}
        </h2>
        <p className="mt-6 text-lg text-moss leading-relaxed">
          {guarantee.body}
        </p>
        {cta ? <SectionCta cta={cta} /> : null}
      </Reveal>
    </section>
  );
}
