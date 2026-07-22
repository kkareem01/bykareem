import type { Metadata } from "next";
import { contactCopy } from "@/content/copy";
import { site } from "@/content/site-config";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${site.name} by phone, email, or Instagram.`,
};

const phoneHref = `tel:+1${site.phone.replace(/\D/g, "")}`;

export default function ContactPage() {
  return (
    <section className="flex min-h-[70vh] items-center py-24 md:py-32">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 text-center">
        <Reveal>
          <p className="eyebrow eyebrow--gold mb-4">{contactCopy.eyebrow}</p>
          <h1 className="display text-4xl sm:text-5xl md:text-6xl">
            {contactCopy.heading}
          </h1>
        </Reveal>
        <Reveal delay={1}>
          <div className="mt-14 flex flex-col items-center gap-7 font-display text-2xl sm:text-3xl">
            <a href={phoneHref} className="transition-colors hover:text-gold">
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-gold"
            >
              {site.email}
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold"
            >
              @{site.name}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
