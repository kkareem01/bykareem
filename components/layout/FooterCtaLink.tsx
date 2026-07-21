"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ctaForPath } from "@/content/site-config";

/** Footer booking link that follows the route's one common CTA. */
export function FooterCtaLink() {
  const cta = ctaForPath(usePathname());
  return (
    <Link
      href={cta.href}
      className="text-gold-light hover:text-snow transition-colors"
    >
      {cta.label}
    </Link>
  );
}
