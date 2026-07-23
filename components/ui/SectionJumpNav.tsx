"use client";

import { useEffect, useState } from "react";

export type JumpSection = {
  /** id of the element to scroll to */
  id: string;
  label: string;
};

type SectionJumpNavProps = {
  sections: JumpSection[];
};

/**
 * Minimal fixed side rail for long single pages: one tick per section,
 * label surfaces on hover/focus, the active tick grows and turns gold.
 * Smooth scrolling comes from the global `scroll-behavior` (which already
 * respects prefers-reduced-motion). Desktop-only — on phones it would
 * fight the sticky CTA and crowd the gutter.
 */
export function SectionJumpNav({ sections }: SectionJumpNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    // A thin band just above the viewport's midline: whichever section
    // occupies it is "where the reader is", independent of section height.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const el of targets) observer.observe(el);
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="hidden lg:flex fixed right-5 xl:right-9 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-5"
    >
      {sections.map((section) => {
        const active = section.id === activeId;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active ? "location" : undefined}
            className="group flex items-center justify-end gap-3 py-0.5"
          >
            <span
              className={`eyebrow rounded bg-snow/85 px-1.5 backdrop-blur-sm transition-opacity duration-300 ${
                active
                  ? "eyebrow--gold opacity-100"
                  : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              }`}
            >
              {section.label}
            </span>
            <span
              aria-hidden="true"
              className={`block h-px transition-all duration-300 ${
                active
                  ? "w-8 bg-gold"
                  : "w-4 bg-moss/50 group-hover:bg-hunter group-focus-visible:bg-hunter"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
