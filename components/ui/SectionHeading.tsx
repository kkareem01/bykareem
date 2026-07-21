import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string | null;
  heading: string;
  sub?: string;
  align?: "left" | "center";
  /** "large" for eyebrow-less sections where the headline carries itself */
  size?: "default" | "large";
};

export function SectionHeading({
  eyebrow,
  heading,
  sub,
  align = "left",
  size = "default",
}: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center mx-auto" : "";
  const sizeCls =
    size === "large"
      ? "text-4xl sm:text-5xl md:text-6xl"
      : "text-3xl sm:text-4xl md:text-5xl";
  return (
    <Reveal className={`max-w-2xl ${alignCls}`}>
      {eyebrow ? <p className="eyebrow eyebrow--gold mb-4">{eyebrow}</p> : null}
      <h2 className={`display ${sizeCls}`}>{heading}</h2>
      {sub ? (
        <p className="mt-5 text-moss text-lg leading-relaxed">{sub}</p>
      ) : null}
    </Reveal>
  );
}
