import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site-config";
import { ProtectedTel } from "@/components/ui/ProtectedTel";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach ${site.name} by phone, email, or Instagram.`,
};

const linkClass =
  "flex w-full items-center justify-center rounded-full border border-hunter/25 px-6 py-4 font-display text-xl sm:text-2xl transition-all duration-300 hover:border-gold hover:text-gold";

const links = [
  { label: "Graduation", href: "/graduation" },
  { label: "Weddings & Engagements", href: "/weddings" },
] as const;

export default function ContactPage() {
  return (
    <section className="flex min-h-[70vh] items-center py-24 md:py-32">
      <div className="mx-auto w-full max-w-md px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-5">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
            <ProtectedTel className={linkClass}>Call</ProtectedTel>
            <ProtectedTel scheme="sms" className={linkClass}>
              Message
            </ProtectedTel>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
