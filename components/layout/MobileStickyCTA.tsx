"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ctaForPath } from "@/content/site-config";
import { Button } from "@/components/ui/Button";

/**
 * Persistent bottom CTA bar on mobile. Appears after the hero scrolls past;
 * hidden on the home page, the booking flow (no competing CTAs there), and
 * the weddings and graduation pages, which use inline CTAs between
 * sections instead.
 */
export function MobileStickyCTA() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (
    pathname === "/" ||
    pathname.startsWith("/book") ||
    pathname.startsWith("/weddings") ||
    pathname.startsWith("/graduation")
  ) {
    return null;
  }

  const cta = ctaForPath(pathname);

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-snow/90 backdrop-blur-md border-t border-line transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Button href={cta.href} size="lg" className="w-full">
        {cta.label}
      </Button>
      {cta.note ? (
        <p className="mt-1.5 text-center text-[11px] text-moss">{cta.note}</p>
      ) : null}
    </div>
  );
}
