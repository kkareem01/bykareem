/**
 * SINGLE SOURCE OF TRUTH for brand, contact, navigation, and imagery.
 * Every human-readable string on the site lives in content/ — components
 * never hardcode copy. Swap placeholders here; see content/README.md.
 */

import { graduationCopy } from "./graduation-copy";
import { weddingsCopy } from "./weddings-copy";

export const site = {
  name: "bykareem",
  legalName: "bykareem photo & film",
  region: "Georgia",
  serviceArea: "Serving Atlanta, Athens & all of Georgia",
  /** PLACEHOLDER — set the real phone before launch */
  phone: "(404) 000-0000",
  /** PLACEHOLDER — set the real public email before launch */
  email: "hello@bykareem.com",
  /** PLACEHOLDER — set the production domain before launch */
  url: "https://bykareem.com",
  instagram: "https://instagram.com/bykareem",
  tiktok: "https://tiktok.com/@bykareem",
} as const;

export const nav = {
  links: [
    { label: "Portfolio", href: "/portfolio" },
    { label: "Weddings & Engagements", href: "/weddings" },
    { label: "Graduation", href: "/graduation" },
    { label: "Contact", href: "/contact" },
  ],
  cta: { label: "Book a Free Consult", href: "/book?type=couples" },
} as const;

export type NavCta = { label: string; href: string; note?: string };

/**
 * Route-aware nav/sticky CTA — the niche landing pages keep one common
 * CTA everywhere (nav, sticky bar, page sections); every other route
 * gets the default consult CTA.
 */
export function ctaForPath(pathname: string): NavCta {
  if (pathname.startsWith("/graduation")) {
    return {
      label: graduationCopy.hero.cta,
      href: "/book?type=graduation",
      note: graduationCopy.ctaNote,
    };
  }
  if (pathname.startsWith("/weddings")) {
    return {
      label: weddingsCopy.hero.cta,
      href: "/book?type=couples",
      note: weddingsCopy.ctaNote,
    };
  }
  return nav.cta;
}

export const footer = {
  positioning:
    "A one-of-one photo & film experience for people in the middle of the best chapters of their lives.",
  legal: `© ${new Date().getFullYear()} bykareem. All rights reserved.`,
} as const;

export const seo = {
  defaultTitle: "bykareem — Wedding & Engagement Photo + Film in Georgia",
  defaultDescription:
    "One team for your photos and your film. Documentary-style wedding and engagement coverage in Georgia, with sneak peeks in 48 hours — not months.",
  ogImage: "/placeholders/og-image.svg",
} as const;

export type ImageSlot = {
  src: string;
  alt: string;
};

/**
 * Image slots — all placeholders. Replace src with real portfolio work,
 * keep (or improve) the alt text. Names describe where they render.
 */
export const images: Record<string, ImageSlot> = {
  homeHero: {
    src: "/photos/home-hero.jpg",
    alt: "bykareem wedding photography — couple captured at golden hour",
  },
  homeManifesto: {
    src: "/placeholders/home-manifesto.svg",
    alt: "Candid in-between moment during a first dance — placeholder",
  },
  aboutPortrait: {
    src: "/photos/bykareem-pfp.png",
    alt: "Kareem, the photographer and filmmaker behind bykareem",
  },
  homeGallery1: { src: "/placeholders/gallery-1.svg", alt: "Editorial couple portrait — placeholder" },
  homeGallery2: { src: "/placeholders/gallery-2.svg", alt: "Ceremony wide shot — placeholder" },
  homeGallery3: { src: "/placeholders/gallery-3.svg", alt: "Ring detail — placeholder" },
  homeGallery4: { src: "/placeholders/gallery-4.svg", alt: "Reception candid — placeholder" },
  homeGallery5: { src: "/placeholders/gallery-5.svg", alt: "Golden hour embrace — placeholder" },
  homeGallery6: { src: "/placeholders/gallery-6.svg", alt: "Getting-ready detail — placeholder" },
  weddingsHero: {
    src: "/placeholders/weddings-hero.svg",
    alt: "Bride and groom during golden hour portraits — placeholder",
  },
  gradHero: {
    src: "/photos/grad-hero.jpg",
    alt: "Two UGA graduates in cap, gown, and Georgia stole laughing together on campus at golden hour",
  },
  contactHero: {
    src: "/placeholders/contact-hero.svg",
    alt: "Behind the scenes of a shoot — placeholder",
  },
} as const;

export type ReviewShot = ImageSlot & {
  /** intrinsic pixel size so screenshots render at their natural aspect ratio */
  width: number;
  height: number;
};

/**
 * Real client message screenshots for the home page
 * "What people are saying" wall, ordered tall/short for visual rhythm.
 */
export const reviewShots: ReviewShot[] = [
  {
    src: "/photos/reviews/review-1.jpg",
    alt: "Client messages: “It was fantastic!! Thank you so much, we all loved it” and “Kareem that was the best wedding video I've ever seen — we truly love it”",
    width: 1206,
    height: 1531,
  },
  {
    src: "/photos/reviews/review-4.jpg",
    alt: "Client text message: “These photos are a hit thank you so much”",
    width: 1206,
    height: 332,
  },
  {
    /* cropped to end at the client's last message — the original
       review-2.jpg (with the highlight-film reply) stays on disk unused */
    src: "/photos/reviews/review-2-cropped.jpg",
    alt: "Client text messages: “Kareem these pics r amazing — genuinely the editing is phenomenal”",
    width: 1206,
    height: 672,
  },
  {
    src: "/photos/reviews/review-7.jpg",
    alt: "Client text message: “BROOO THESE ARE FIREEEEEE”",
    width: 1206,
    height: 235,
  },
  {
    src: "/photos/reviews/review-8.jpg",
    alt: "Client messages: “i truly enjoyed having you as my photographer wouldn't want no other bro — thank you so much”",
    width: 1206,
    height: 1268,
  },
  {
    src: "/photos/reviews/review-5.jpg",
    alt: "Client text message: “Bro the pics turned out incredible”",
    width: 1206,
    height: 348,
  },
  {
    src: "/photos/reviews/review-3.jpg",
    alt: "Client message: “The pictures are absolutely so beautiful and made me tear up — you're so talented, I can't wait to recommend others to you”",
    width: 1206,
    height: 615,
  },
  {
    src: "/photos/reviews/review-6.jpg",
    alt: "Client text message: “also the pics are fireee everyone loves them”",
    width: 1206,
    height: 326,
  },
  {
    src: "/photos/reviews/review-9.jpg",
    alt: "Client message: “You did a phenomenal job with the photos Masha Allah!!!! I absolutely love them and am so so so glad I chose you! You are our family's official photographer/videographer now”",
    width: 1206,
    height: 959,
  },
  {
    src: "/photos/reviews/review-10.jpg",
    alt: "Client message: “We took a look at the photos and they came out crazyyy Allahuma Barik”",
    width: 1206,
    height: 220,
  },
  {
    src: "/photos/reviews/review-11.jpg",
    alt: "Client message: “Jzk Kareem! Thanks so much for being very accommodating and great to work with during our wedding! Insha Allah looking forward to working with you in the future”",
    width: 1206,
    height: 601,
  },
  {
    src: "/photos/reviews/review-12.jpg",
    alt: "Client message: “The photo book sounds great! I also loved the photoshop you did — everyone loved it ❤️”",
    width: 1206,
    height: 547,
  },
  {
    src: "/photos/reviews/review-14.jpg",
    alt: "Client messages: “kareem my mom loved them — she asked if u can do my wedding” and “one day inshaAllah”",
    width: 930,
    height: 540,
  },
  {
    src: "/photos/reviews/review-13.jpg",
    alt: "Client messages reacting to their graduation gallery: “woohhooo — aura 😈😈😈 — fire job kareemy — thank u wallah”",
    width: 1206,
    height: 1448,
  },
];

/**
 * Subset for the graduation page wall — drops the two tall wedding chat
 * threads (review-1, review-8) and the "made me tear up" message
 * (review-3). The cropped editing-is-phenomenal thread stays in.
 * The home page keeps the full set.
 */
const gradExcludedReviews = [
  "/review-1.jpg",
  "/review-8.jpg",
  "/review-3.jpg",
  // wedding/family flavored — shown on the home + weddings walls, not grad
  "/review-9.jpg",
  "/review-10.jpg",
  "/review-11.jpg",
  "/review-12.jpg",
];

export const gradReviewShots: ReviewShot[] = reviewShots.filter(
  (shot) => !gradExcludedReviews.some((name) => shot.src.endsWith(name)),
);

/**
 * Subset for the weddings page wall — leads with the wedding-flavored
 * threads (the "best wedding video I've ever seen" chat, the "made me
 * tear up" message, the long photographer thread) and drops the two
 * short grad-leaning hype texts. The home page keeps the full set.
 */
const couplesExcludedReviews = [
  "/review-7.jpg",
  "/review-6.jpg",
  // grad-gallery reaction thread — home + grad walls only
  "/review-13.jpg",
];

export const couplesReviewShots: ReviewShot[] = reviewShots.filter(
  (shot) => !couplesExcludedReviews.some((name) => shot.src.endsWith(name)),
);
