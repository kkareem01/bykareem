/**
 * SINGLE SOURCE OF TRUTH for all portfolio work: the film reel, the curated
 * niche galleries, and the featured story albums.
 *
 * Curation rules (enforced by tests/portfolio-content.test.ts):
 * - Niche galleries hold 12–15 images. Favorites only — every image below
 *   your median drags the whole wall down.
 * - Every image carries its natural width/height so nothing gets re-cropped
 *   by CSS. The framing chosen in camera is the framing shown.
 * - Sequence deliberately: strongest image first, strong image last, and a
 *   varied rhythm in between (wide → intimate → detail → emotion). The alt
 *   text on each placeholder slot describes the kind of shot it was
 *   sequenced for.
 *
 * Swapping in real work: replace `src` with the real file under
 * /public/photos/... and set the real pixel width/height. Keep (or improve)
 * the alt text.
 */

export type PortfolioImage = {
  src: string;
  alt: string;
  /** intrinsic pixel size — preserves the natural aspect ratio in masonry */
  width: number;
  height: number;
};

export type Audience = "couples" | "graduation";

export type Story = {
  /** URL segment: /portfolio/[slug] */
  slug: string;
  audience: Audience;
  title: string;
  /** venue / campus + city — helps visitors find "the one like ours" */
  location: string;
  /** 1–3 sentences of context: who, where, what made the day theirs */
  intro: string;
  cover: PortfolioImage;
  images: PortfolioImage[];
};

/** Placeholder dimensions keyed by the aspect suffix in the SVG filenames. */
const DIMENSIONS = {
  "4x5": { width: 1200, height: 1500 },
  "2x3": { width: 1200, height: 1800 },
  "3x2": { width: 1500, height: 1000 },
  "16x9": { width: 1600, height: 900 },
} as const;

type AspectKey = keyof typeof DIMENSIONS;

/** Placeholder helper — real images should become plain literals with real dimensions. */
function shot(file: string, aspect: AspectKey, alt: string): PortfolioImage {
  return {
    src: `/placeholders/portfolio/${file}`,
    alt,
    ...DIMENSIONS[aspect],
  };
}

/**
 * The highlight film. Poster always renders; once a reel is exported, set
 * `videoSrc` to its path (e.g. "/films/reel-2026.mp4") and the section
 * upgrades to muted looping video with a sound toggle.
 * Keep the reel 45–60s: proof of feeling, not a full film.
 */
export const filmReel = {
  poster: shot(
    "film-poster-1-16x9.svg",
    "16x9",
    "Still frame from the bykareem highlight reel — placeholder",
  ),
  /** PLACEHOLDER — export a 45–60s highlight reel and set the path here */
  videoSrc: null as string | null,
} as const;

/**
 * Curated walls, one per audience. 12–15 favorites each, never mixed —
 * a grad scrolling past wedding work (or vice versa) reads "not for me."
 */
export const galleries: Record<Audience, PortfolioImage[]> = {
  couples: [
    shot("couples-1-3x2.svg", "3x2", "Opening image: couple at golden hour, wide — placeholder"),
    shot("couples-2-4x5.svg", "4x5", "Intimate close-up during vows — placeholder"),
    shot("couples-3-2x3.svg", "2x3", "Full-length editorial portrait of the couple — placeholder"),
    shot("couples-4-16x9.svg", "16x9", "Wide ceremony establishing shot — placeholder"),
    shot("couples-5-4x5.svg", "4x5", "Ring and letter details, styled flat lay — placeholder"),
    shot("couples-6-3x2.svg", "3x2", "First dance under string lights — placeholder"),
    shot("couples-7-2x3.svg", "2x3", "Bride's portrait, window light — placeholder"),
    shot("couples-8-4x5.svg", "4x5", "Candid laughter during toasts — placeholder"),
    shot("couples-9-3x2.svg", "3x2", "Couple walking through the venue grounds — placeholder"),
    shot("couples-10-4x5.svg", "4x5", "Father of the bride reaction, documentary moment — placeholder"),
    shot("couples-11-16x9.svg", "16x9", "Reception wide shot, dance floor energy — placeholder"),
    shot("couples-12-2x3.svg", "2x3", "Engagement session portrait in the field — placeholder"),
    shot("couples-13-4x5.svg", "4x5", "Quiet in-between moment, foreheads together — placeholder"),
    shot("couples-14-3x2.svg", "3x2", "Closing image: night portrait, sparkler exit — placeholder"),
  ],
  graduation: [
    shot("grad-1-4x5.svg", "4x5", "Opening image: graduate mid-laugh on campus steps — placeholder"),
    shot("grad-2-3x2.svg", "3x2", "Wide campus landmark shot with graduate — placeholder"),
    shot("grad-3-2x3.svg", "2x3", "Full-length gown portrait, editorial angle — placeholder"),
    shot("grad-4-4x5.svg", "4x5", "Cap detail with tassel and class year — placeholder"),
    shot("grad-5-16x9.svg", "16x9", "Cap toss against the sky, wide — placeholder"),
    shot("grad-6-4x5.svg", "4x5", "Candid walk-and-talk through the quad — placeholder"),
    shot("grad-7-3x2.svg", "3x2", "Graduate with family, documentary moment — placeholder"),
    shot("grad-8-2x3.svg", "2x3", "Confident solo portrait, low angle — placeholder"),
    shot("grad-9-4x5.svg", "4x5", "Champagne pop celebration shot — placeholder"),
    shot("grad-10-3x2.svg", "3x2", "Golden hour portrait at the stadium — placeholder"),
    shot("grad-11-4x5.svg", "4x5", "Close-up: stole and cords details — placeholder"),
    shot("grad-12-2x3.svg", "2x3", "Editorial portrait outside the college of their major — placeholder"),
    shot("grad-13-16x9.svg", "16x9", "Closing image: friends group celebration, wide — placeholder"),
  ],
};

/**
 * Featured stories — complete events shown start to finish. This is the
 * proof the curated wall can't provide: consistency across a whole day,
 * not cherry-picked highlights.
 */
export const stories: Story[] = [
  {
    slug: "sample-wedding-story",
    audience: "couples",
    title: "PLACEHOLDER — Couple's names",
    location: "PLACEHOLDER — Venue, City, GA",
    intro:
      "PLACEHOLDER — two or three sentences about this wedding: who the couple is, what the day felt like, and one detail that made it unmistakably theirs.",
    cover: shot(
      "story-wedding-1-3x2.svg",
      "3x2",
      "Cover: couple at their venue, golden hour — placeholder",
    ),
    images: [
      shot("story-wedding-1-3x2.svg", "3x2", "Getting ready: dress hanging in the bridal suite — placeholder"),
      shot("story-wedding-2-4x5.svg", "4x5", "Getting ready: final mirror check — placeholder"),
      shot("story-wedding-3-2x3.svg", "2x3", "First look reaction — placeholder"),
      shot("story-wedding-4-3x2.svg", "3x2", "Ceremony wide: the walk down the aisle — placeholder"),
      shot("story-wedding-5-4x5.svg", "4x5", "Vows close-up, tears — placeholder"),
      shot("story-wedding-6-16x9.svg", "16x9", "The kiss, wide with full wedding party — placeholder"),
      shot("story-wedding-7-4x5.svg", "4x5", "Golden hour couple portraits — placeholder"),
      shot("story-wedding-8-2x3.svg", "2x3", "Editorial portrait of the bride — placeholder"),
      shot("story-wedding-9-3x2.svg", "3x2", "Reception details: tablescape and candles — placeholder"),
      shot("story-wedding-10-4x5.svg", "4x5", "Toasts: best man mid-story, couple laughing — placeholder"),
      shot("story-wedding-11-3x2.svg", "3x2", "First dance, room lights low — placeholder"),
      shot("story-wedding-12-16x9.svg", "16x9", "Sparkler exit, night wide shot — placeholder"),
    ],
  },
  {
    slug: "sample-graduation-story",
    audience: "graduation",
    title: "PLACEHOLDER — Graduate's name",
    location: "PLACEHOLDER — University, City, GA",
    intro:
      "PLACEHOLDER — two or three sentences about this session: the graduate, their campus, and the moment from the shoot they still talk about.",
    cover: shot(
      "story-grad-1-4x5.svg",
      "4x5",
      "Cover: graduate portrait on their campus — placeholder",
    ),
    images: [
      shot("story-grad-1-4x5.svg", "4x5", "Opening portrait at the campus landmark — placeholder"),
      shot("story-grad-2-3x2.svg", "3x2", "Wide shot walking the main lawn in gown — placeholder"),
      shot("story-grad-3-2x3.svg", "2x3", "Full-length editorial portrait — placeholder"),
      shot("story-grad-4-4x5.svg", "4x5", "Cap and stole details — placeholder"),
      shot("story-grad-5-3x2.svg", "3x2", "Candid laugh between poses — placeholder"),
      shot("story-grad-6-16x9.svg", "16x9", "Cap toss, wide against the sky — placeholder"),
      shot("story-grad-7-4x5.svg", "4x5", "With family, documentary moment — placeholder"),
      shot("story-grad-8-2x3.svg", "2x3", "Confident low-angle solo portrait — placeholder"),
      shot("story-grad-9-3x2.svg", "3x2", "Champagne pop at golden hour — placeholder"),
      shot("story-grad-10-4x5.svg", "4x5", "Closing portrait: quiet, proud, done — placeholder"),
    ],
  },
];

export function getStory(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

/** Niche pages link to "their" story without hardcoding slugs. */
export function getStoryByAudience(audience: Audience): Story | undefined {
  return stories.find((s) => s.audience === audience);
}

export const portfolioCopy = {
  hero: {
    eyebrow: "the work",
    heading: "Moments, not poses.",
    sub: "A small, honest selection — and two full stories so you can see what an entire day looks like, not just the highlights.",
  },
  film: {
    eyebrow: "photo + film, one team",
    heading: "Ten seconds of film says what forty photos can't.",
    videoFallbackNote: "Highlight reel coming soon — the stills below will hold you over.",
  },
  couplesGallery: {
    eyebrow: "weddings & engagements",
    heading: "For the couples",
    cta: { label: "See the wedding experience", href: "/weddings" },
  },
  gradGallery: {
    eyebrow: "graduation",
    heading: "For the grads",
    cta: { label: "See the milestone session", href: "/graduation" },
  },
  stories: {
    eyebrow: "full stories",
    heading: "One day, start to finish.",
    sub: "Highlight walls are easy to cherry-pick. These are complete events — every chapter of the day, exactly as delivered.",
    cardCta: "View the full story",
  },
  midCta: {
    text: "Picturing your own day yet?",
    linkLabel: "Book a free consult →",
    href: "/book",
  },
  storyPage: {
    backLabel: "← All work",
    backHref: "/portfolio",
    otherStoryEyebrow: "keep looking",
    otherStoryLabel: "Next story",
  },
  nichePage: {
    couples: {
      eyebrow: "the work",
      heading: "Proof, before the pitch.",
      sub: "Twelve-plus favorites from real weddings and engagements. Want to see a full day, not just highlights?",
      storyLinkLabel: "View a complete wedding story →",
    },
    graduation: {
      eyebrow: "the work",
      heading: "This could be you...",
      storyLinkLabel: "View a complete grad session →",
    },
  },
} as const;

/**
 * Real client Instagram posts for the graduation page "This could be you..."
 * wall — screenshots with likes/comments visible, so the social proof does
 * double duty. Separate from `galleries` on purpose: the 12–15 curation
 * rule applies to portfolio walls, not this proof strip.
 */
export const gradCouldBeYouShots: PortfolioImage[] = [
  {
    src: "/photos/could-be-you/could-be-you-1.jpg",
    alt: "Instagram post: Terry College of Business grad in cap and sunglasses, kicked back on a bench outside the business school — 717 likes",
    width: 1206,
    height: 1541,
  },
  {
    src: "/photos/could-be-you/could-be-you-2.jpg",
    alt: "Instagram post: graduate in cap and tassel sitting on top of the UGA Arch in Athens",
    width: 1206,
    height: 1849,
  },
  {
    src: "/photos/could-be-you/could-be-you-3.jpg",
    alt: "Instagram post: doctoral graduate in full regalia under the UGA Arch in Athens, Georgia — 746 likes",
    width: 1206,
    height: 1862,
  },
  {
    src: "/photos/could-be-you/could-be-you-4.jpg",
    alt: "Instagram post: graduate in a keffiyeh-wrapped cap and stole, smiling in his gown",
    width: 1206,
    height: 1856,
  },
  {
    src: "/photos/could-be-you/could-be-you-5.jpg",
    alt: "Instagram post: graduate seated on the steps beneath the UGA Arch, admiring his class ring",
    width: 1206,
    height: 1859,
  },
];
