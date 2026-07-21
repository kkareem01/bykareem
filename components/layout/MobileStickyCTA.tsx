"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site-config";
import { Button } from "@/components/ui/Button";

/**
 * Persistent bottom CTA bar on mobile. Appears after the hero scrolls past;
 * hidden on the booking flow itself (no competing CTAs there).
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

  if (pathname.startsWith("/book")) return null;

  return (
    <div
      className={`md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-snow/90 backdrop-blur-md border-t border-line transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Button href={nav.cta.href} size="lg" className="w-full">
        {nav.cta.label}
      </Button>
    </div>
  );
}
