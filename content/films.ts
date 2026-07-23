/**
 * SINGLE SOURCE OF TRUTH for the full-length films shown on the site.
 *
 * These are complete wedding/engagement films (3–12 min, with sound), not
 * the muted ambient loops the photo walls use. They're click-to-play: the
 * poster renders instantly and YouTube only loads once a visitor hits play,
 * so the page stays fast and on-brand until they choose to watch.
 *
 * Hosting: each film is an *Unlisted* YouTube upload (free, adaptive
 * streaming, reliable) — it never appears in search or on the channel, it
 * only plays where embedded here.
 *
 * Going live: upload the film to YouTube as Unlisted, copy the 11-character
 * video id out of its URL (youtu.be/<ID> or watch?v=<ID>), and set
 * `youtubeId`. Until then it stays null and the section shows the poster
 * with `fallbackNote`. Keep (or improve) the poster and alt text.
 */

import type { PortfolioImage } from "./portfolio";

export type Film = {
  /**
   * YouTube video id for an Unlisted upload (the 11 chars after /watch?v= or
   * youtu.be/). null until the film is uploaded — the poster shows instead.
   */
  youtubeId: string | null;
  /** custom still shown until a visitor clicks play (and while unpublished) */
  poster: PortfolioImage;
  /** short label rendered under the player */
  title: string;
  /** shown in place of a play button while youtubeId is null */
  fallbackNote: string;
};

/**
 * A&F — the nikkah film. Lives in the film section on /portfolio as the
 * site-wide "photo + film, one team" proof.
 */
export const nikkahFilm: Film = {
  youtubeId: "9b7iDeE-8HA",
  poster: {
    src: "/photos/films/af-nikkah-film.jpg",
    alt: "Bride in a mint-and-gold lehenga holding a bouquet beside her groom in a grey suit and mint tie — a still from their nikkah film",
    width: 1600,
    height: 900,
  },
  title: "Ayesha & Faisal — the nikkah film",
  fallbackNote: "Full film coming soon — the stills below hold you over.",
};

/**
 * Huda — a full wedding film. Anchors the weddings page high up, so a
 * couple sees motion and sound before they scroll the stills.
 */
export const weddingFilm: Film = {
  youtubeId: "47wFrO7Z_vg",
  poster: {
    src: "/photos/films/huda-wedding-film.jpg",
    alt: "Bride in pink and groom in cream sharing a laugh on a bench, an open ring box in her henna hands — a still from their wedding film",
    width: 1600,
    height: 900,
  },
  title: "Huda & Khizar — the full film",
  fallbackNote: "Full film coming soon — keep scrolling for the stills.",
};

/**
 * The reaction film — a family watching their engagement film together,
 * cut split-screen (the film above, the room below). Emotional proof, so
 * it sits by the reviews on the weddings page, not in a portfolio wall.
 */
export const reactionFilm: Film = {
  youtubeId: "-Vkx56Fq9AY",
  poster: {
    src: "/photos/films/engagement-reaction.jpg",
    alt: "Split screen: a couple's engagement film plays above while their family watches together in a living room, smiling",
    width: 1600,
    height: 900,
  },
  title: "A family watching their engagement film for the first time",
  fallbackNote: "Reaction film coming soon.",
};

export const filmsCopy = {
  /** /portfolio film section (replaces the old muted-reel copy) */
  portfolio: {
    eyebrow: "photo + film, one team",
    heading: "Some moments only move.",
  },
  /** weddings page — the full film, up top */
  weddingsFilm: {
    eyebrow: "the film",
    heading: "Press play on a whole day.",
  },
  /** weddings page — the reaction, by the reviews */
  reaction: {
    eyebrow: "what it feels like",
    heading: "Then they see the film.",
  },
} as const;
