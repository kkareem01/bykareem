"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Film } from "@/content/films";

type FilmPlayerProps = {
  eyebrow: string;
  heading: string;
  film: Film;
  /** softer background variant for the second film section on a page */
  tone?: "mist" | "plain";
};

/**
 * A full-length film shown click-to-play. The poster renders instantly;
 * only when the visitor presses play does the YouTube player load and start
 * with sound — so the page never ships a heavy iframe up front and stays
 * on-brand until they choose to watch. Until the film is uploaded
 * (youtubeId null) or if no id is set, the poster shows with a short note
 * so the section never breaks.
 *
 * Uses youtube-nocookie.com and defers the iframe until play, the standard
 * "facade" pattern for keeping an embed fast and private.
 */
export function FilmPlayer({
  eyebrow,
  heading,
  film,
  tone = "mist",
}: FilmPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const canPlay = film.youtubeId !== null;

  const embedSrc = canPlay
    ? `https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : null;

  return (
    <section
      className={`py-20 md:py-28 ${tone === "mist" ? "bg-mist/60" : ""}`}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" />

        <Reveal delay={1} className="mt-12 md:mt-16">
          <div className="relative aspect-video overflow-hidden rounded-[2rem] bg-hunter-deep">
            {playing && embedSrc ? (
              <iframe
                src={embedSrc}
                title={film.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <>
                <Image
                  src={film.poster.src}
                  alt={film.poster.alt}
                  fill
                  sizes="(min-width: 1024px) 960px, 92vw"
                  className="object-cover img-warm"
                />
                {canPlay ? (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label={`Play film: ${film.title}`}
                    className="group absolute inset-0 flex items-center justify-center bg-hunter-deep/10 transition-colors hover:bg-hunter-deep/25"
                  >
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-snow/90 shadow-[0_10px_30px_rgba(20,43,33,0.35)] transition-transform group-hover:scale-105">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="ml-1 h-8 w-8 fill-hunter"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>
                ) : null}
              </>
            )}
          </div>

          {!canPlay ? (
            <p className="mt-4 text-center text-sm text-moss">
              {film.fallbackNote}
            </p>
          ) : (
            <p className="mt-4 text-center text-sm text-moss">{film.title}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
