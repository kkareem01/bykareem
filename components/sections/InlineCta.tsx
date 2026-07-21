import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

type InlineCtaProps = {
  label: string;
  href: string;
  /** one-line trust note directly under the button */
  note?: string;
};

/** Small mid-page CTA break — a single button between narrative sections. */
export function InlineCta({ label, href, note }: InlineCtaProps) {
  return (
    <section className="py-10 sm:py-14">
      <Reveal className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <Button href={href} size="lg">
          {label}
        </Button>
        {note ? <p className="mt-3 text-xs text-moss">{note}</p> : null}
      </Reveal>
    </section>
  );
}
