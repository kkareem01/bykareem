"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { PortfolioImage } from "@/content/portfolio";

type FilmReelProps = {
  eyebrow: string;
  heading: string;
  poster: PortfolioImage;
  videoSrc: string | null;
  /** shown under the poster while no reel is published yet */
  fallbackNote: string;
};

/**
 * The highlight reel — the one thing a photo grid can't communicate.
 * Muted autoplay loop with a tap-for-sound toggle; hover isn't required
 * for anything. Until a reel exists (videoSrc null) or if the file fails
 * to load, the poster renders instead so the section never breaks.
 */
export function FilmReel({
  eyebrow,
  heading,
  poster,
  videoSrc,
  fallbackNote,
}: FilmReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  const showVideo = videoSrc !== null && !failed;

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  }

  return (
    <section className="py-20 md:py-28 bg-mist/60">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading eyebrow={eyebrow} heading={heading} align="center" />

        <Reveal delay={1} className="mt-12 md:mt-16">
          <div className="relative overflow-hidden rounded-[2rem]">
            {showVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  poster={poster.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setFailed(true)}
                  className="w-full h-auto"
                  aria-label={poster.alt}
                />
                <button
                  type="button"
                  onClick={toggleSound}
                  className="absolute bottom-4 right-4 rounded-full bg-hunter-deep/70 px-4 py-2 text-sm text-snow backdrop-blur-sm transition-colors hover:bg-hunter-deep"
                >
                  {muted ? "Tap for sound" : "Mute"}
                </button>
              </>
            ) : (
              <Image
                src={poster.src}
                alt={poster.alt}
                width={poster.width}
                height={poster.height}
                sizes="(min-width: 1024px) 960px, 92vw"
                priority
                className="w-full h-auto img-warm"
              />
            )}
          </div>
          {!showVideo ? (
            <p className="mt-4 text-center text-sm text-moss">{fallbackNote}</p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
