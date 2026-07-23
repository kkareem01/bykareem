import Link from "next/link";
import { footer, nav, site } from "@/content/site-config";
import { ProtectedTel } from "@/components/ui/ProtectedTel";
import { FooterCtaLink } from "./FooterCtaLink";

export function Footer() {
  return (
    <footer className="bg-hunter text-snow/80 mt-auto">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 grid gap-12 md:grid-cols-3">
        <div className="max-w-xs">
          <p className="font-display text-2xl lowercase text-snow">
            {site.name}
            <span className="text-gold-light">.</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed">{footer.positioning}</p>
        </div>

        <nav className="flex flex-col gap-3 text-sm">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gold-light transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <FooterCtaLink />
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <p>{site.serviceArea}</p>
          <a
            href={`mailto:${site.email}`}
            className="hover:text-gold-light transition-colors"
          >
            {site.email}
          </a>
          <ProtectedTel className="hover:text-gold-light transition-colors" />
          <div className="flex gap-4 mt-2">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-light transition-colors"
            >
              Instagram
            </a>
            <a
              href={site.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-light transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-snow/10">
        <p className="mx-auto max-w-6xl px-5 sm:px-8 py-5 text-xs text-snow/40">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}
