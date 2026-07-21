"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ctaForPath, nav, site } from "@/content/site-config";
import { Button } from "@/components/ui/Button";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const cta = ctaForPath(pathname);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-snow/85 backdrop-blur-md border-b border-line/60">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl tracking-tight lowercase"
          onClick={() => setOpen(false)}
        >
          {site.name}
          <span className="text-gold">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors hover:text-gold ${
                pathname === link.href ? "text-gold" : "text-hunter"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button href={cta.href} size="md">
            {cta.label}
          </Button>
        </nav>

        <button
          type="button"
          className="md:hidden flex flex-col justify-center items-end gap-1.5 w-10 h-10"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-px bg-hunter transition-all duration-300 ${open ? "w-6 translate-y-[3.5px] rotate-45" : "w-6"}`}
          />
          <span
            className={`block h-px bg-hunter transition-all duration-300 ${open ? "w-6 -translate-y-[3.5px] -rotate-45" : "w-4"}`}
          />
        </button>
      </div>

      {open ? (
        <nav className="md:hidden border-t border-line/60 bg-snow px-5 py-6 flex flex-col gap-5">
          {nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display text-2xl"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div onClickCapture={() => setOpen(false)}>
            <Button href={cta.href} size="lg" className="w-full">
              {cta.label}
            </Button>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
