/**
 * SINGLE SOURCE OF TRUTH for brand, contact, navigation, and imagery.
 * Every human-readable string on the site lives in content/ — components
 * never hardcode copy. Swap placeholders here; see content/README.md.
 */

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
  weddingsStory: {
    src: "/placeholders/weddings-story.svg",
    alt: "Documentary moment between vows — placeholder",
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
    src: "/photos/reviews/review-2.jpg",
    alt: "Client text messages: “Kareem these pics r amazing — genuinely the editing is phenomenal”",
    width: 1206,
    height: 982,
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
];

/**
 * Subset for the graduation page wall — drops the two tall wedding chat
 * threads (review-1, review-8) so the wall stays compact there. The home
 * page keeps the full set.
 */
export const gradReviewShots: ReviewShot[] = reviewShots.filter(
  (shot) =>
    !shot.src.endsWith("/review-1.jpg") && !shot.src.endsWith("/review-8.jpg"),
);
