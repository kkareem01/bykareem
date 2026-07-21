import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

type FilterList = {
  title: string;
  items: readonly string[];
};

type AudienceFilterProps = {
  eyebrow?: string;
  heading: string;
  sub?: string;
  notFor: FilterList;
  builtFor: FilterList;
};

/**
 * Self-selection filter: side-by-side "not for you" / "built for you"
 * boxes that qualify the reader before the offer is introduced.
 */
export function AudienceFilter({
  eyebrow,
  heading,
  sub,
  notFor,
  builtFor,
}: AudienceFilterProps) {
  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          {eyebrow ? (
            <p className="eyebrow eyebrow--gold mb-4">{eyebrow}</p>
          ) : null}
          {/* sized with vw so the headline stays on one line at every width */}
          <h2 className="display whitespace-nowrap text-[clamp(1.75rem,5.5vw,5rem)]">
            {heading}
          </h2>
          {sub ? (
            <p className="mt-5 text-moss text-lg leading-relaxed">{sub}</p>
          ) : null}
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          <Reveal delay={1}>
            <div className="h-full rounded-2xl border border-line bg-porcelain p-8 md:p-10">
              <h3 className="font-display text-2xl">{notFor.title}</h3>
              <ul className="mt-6 space-y-4">
                {notFor.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-moss leading-relaxed"
                  >
                    <span aria-hidden className="text-red-700/80 select-none">
                      ✕
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={2}>
            <div className="h-full rounded-2xl bg-hunter text-snow p-8 md:p-10">
              <h3 className="font-display text-2xl text-snow">
                {builtFor.title}
              </h3>
              <ul className="mt-6 space-y-4">
                {builtFor.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-snow/80 leading-relaxed"
                  >
                    <span aria-hidden className="text-emerald-400 select-none">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
