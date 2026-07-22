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
    {
      src: "/photos/portfolio/grad/abdullah-cap-laugh.jpg",
      alt: "Graduate mid-laugh in cap and gown, orange tassel swinging, on campus",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/fares-stadium-wide.jpg",
      alt: "Wide shot: graduate alone at the rail of an empty Sanford Stadium",
      width: 1600,
      height: 1066,
    },
    {
      src: "/photos/portfolio/grad/suhayb-shades.jpg",
      alt: "Terry College grad adjusting his sunglasses, red UGA stole over his gown",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/arch-walk.jpg",
      alt: "Grad walking in front of the UGA Arch in a black dress and red heels, full length",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/nizar-friends-pile.jpg",
      alt: "Three grads stacked in a laughing pile on the lawn, green and black gowns",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/emanuel-bell-swing.jpg",
      alt: "Graduate swinging off the ground on the UGA Chapel Bell rope, gown flying",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/fares-cap-toss.jpg",
      alt: "Cap spinning high above a graduate on the concourse of Sanford Stadium",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/emory-tunnel.jpg",
      alt: "From above: a lone graduate in gown walking the stadium tunnel toward the field",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/gsu-plays-here.jpg",
      alt: "Grad in cap, gown, and blue stole under the Georgia State bridge downtown",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/uga-bulldog-cap.jpg",
      alt: "Grad at dusk by an iron gate, holding her Bulldog-painted cap, red UGA stole",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/emory-stadium-dad.jpg",
      alt: "Graduate and his dad side by side on the field under the Sanford Stadium scoreboard",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/nizar-grad-glasses.jpg",
      alt: "Close-up grin in novelty GRAD glasses, keffiyeh draped over the shoulders",
      width: 1600,
      height: 1066,
    },
    {
      src: "/photos/portfolio/grad/grad-steps-laugh.jpg",
      alt: "Master's grad cracking up on the steps at the base of a lamppost, hood over his gown",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/cameron-rotunda.jpg",
      alt: "Overhead frame: law graduate standing on the marble rotunda floor in JD regalia",
      width: 1279,
      height: 1600,
    },
    {
      src: "/photos/portfolio/grad/ksu-twirl.jpg",
      alt: "Closing image: grad twirling her dress on a stone wall at sunset, Kennesaw Hall behind",
      width: 1066,
      height: 1600,
    },
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
    slug: "fares-uga-milestone-session",
    audience: "graduation",
    title: "Fares — The Milestone Session",
    location: "University of Georgia — Athens, GA",
    intro:
      "An empty Sanford Stadium to ourselves, then the Arch, North Campus, and Old College before the crowds showed up. One directed session, start to finish — this is every chapter of it, exactly as delivered.",
    cover: {
      src: "/photos/portfolio/grad/fares-diploma-laugh.jpg",
      alt: "Cover: Fares laughing with his diploma cover at Sanford Stadium, red UGA stole",
      width: 1600,
      height: 1066,
    },
    images: [
      {
        src: "/photos/portfolio/grad/fares-stadium-wide.jpg",
        alt: "Opening wide: Fares alone at the rail of an empty Sanford Stadium",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/grad/fares-diploma-laugh.jpg",
        alt: "Laughing with the diploma cover, stadium seats stretching behind",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/grad/fares-cap-up.jpg",
        alt: "Holding the cap up to ninety thousand empty seats",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/grad/fares-cap-toss.jpg",
        alt: "The cap toss on the stadium concourse",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/grad/fares-stadium-back.jpg",
        alt: "A quiet look back at the field, gown silhouetted against the stands",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/grad/fares-arch.jpg",
        alt: "Straightening the gown under the UGA Arch",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/grad/fares-lawn-walk.jpg",
        alt: "Mid-stride across the North Campus lawn, gown flowing",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/grad/fares-walkway.jpg",
        alt: "Cap in hand on the campus walkway between locations",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/grad/fares-golden-hour.jpg",
        alt: "Golden-hour portrait under the trees, red stole and tassel",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/grad/fares-old-college.jpg",
        alt: "Closing frame: cracking up on the brick steps of Old College",
        width: 1066,
        height: 1600,
      },
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
      heading: "This could be you two...",
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
/**
 * Proof set for the graduation page, rendered right before the offer
 * pitch as a static editorial collage (<SessionCollage/>) — celebration
 * energy (cap toss, friends, the Chapel Bell) so the "Introducing"
 * section lands on someone already picturing it.
 * Ordered portrait/landscape alternating for the collage's rhythm; keep
 * 8–14 images so the staggered columns stay balanced.
 * Not a full wall; the 12–15 rule applies to `galleries`, not here.
 */
export const gradSessionStrip: PortfolioImage[] = [
  {
    src: "/photos/portfolio/grad/fares-cap-toss.jpg",
    alt: "Cap spinning high above a graduate on the concourse of Sanford Stadium",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/grad/suhayb-stadium-laugh.jpg",
    alt: "Graduate laughing over his shoulder in the stands, green and white stole",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/grad/nizar-friends-stack.jpg",
    alt: "Three friends in gowns stacked up and laughing on the quad",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/grad/fares-diploma-laugh.jpg",
    alt: "Graduate laughing with his diploma cover at Sanford Stadium, red UGA stole",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/grad/emanuel-bell-swing.jpg",
    alt: "Graduate swinging off the ground on the UGA Chapel Bell rope, gown flying",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/grad/ksu-bouquet.jpg",
    alt: "Grad glancing over her shoulder with a rose bouquet at golden hour on the Kennesaw State green",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/grad/emory-stadium-dad.jpg",
    alt: "Graduate and his dad side by side on the field under the Sanford Stadium scoreboard",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/grad/nizar-grad-glasses.jpg",
    alt: "Close-up grin in novelty GRAD glasses, keffiyeh draped over the shoulders",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/grad/uga-cherry-blossoms.jpg",
    alt: "Grad in her gown under the cherry blossoms, red stole with the Arch crest",
    width: 1280,
    height: 1600,
  },
  {
    src: "/photos/portfolio/grad/ksu-couple-carry.jpg",
    alt: "Grad swept off her feet mid-laugh, cap in hand, on the Kennesaw State lawn",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/grad/nizar-fountain.jpg",
    alt: "Grad in a green gown laughing by the Herty Field fountain",
    width: 1066,
    height: 1600,
  },
];

/**
 * Proof set for the weddings page, rendered right before the offer pitch
 * as a static editorial collage (<SessionCollage/>) — celebration energy
 * (first dance, toasts, the sparkler exit) so the "Introducing" section
 * lands on a couple already picturing their own day.
 * Reuses the couples placeholder slots (cross-array reuse is fine — the
 * 12–15 rule and per-array dup checks apply to `galleries`, not here);
 * swap for real wedding frames alongside the gallery.
 * Ordered portrait/landscape alternating for the collage's rhythm; keep
 * 8–14 images so the staggered columns stay balanced.
 */
export const couplesSessionStrip: PortfolioImage[] = [
  shot("couples-8-4x5.svg", "4x5", "Couple cracking up mid-toast at the reception — placeholder"),
  shot("couples-6-3x2.svg", "3x2", "First dance under string lights — placeholder"),
  shot("couples-2-4x5.svg", "4x5", "Vow exchange close-up, teary laugh — placeholder"),
  shot("couples-14-3x2.svg", "3x2", "Sparkler exit, night wide shot — placeholder"),
  shot("couples-13-4x5.svg", "4x5", "Quiet in-between moment, foreheads together — placeholder"),
  shot("couples-9-3x2.svg", "3x2", "Couple mid-stride through the venue grounds — placeholder"),
  shot("couples-10-4x5.svg", "4x5", "Father of the bride's reaction, caught candid — placeholder"),
  shot("couples-11-16x9.svg", "16x9", "Dance floor at full tilt, reception wide — placeholder"),
  shot("couples-12-2x3.svg", "2x3", "Engagement session portrait in the field — placeholder"),
  shot("couples-4-16x9.svg", "16x9", "Ceremony wide, the walk back up the aisle — placeholder"),
];

/**
 * Placeholder Instagram-post mocks for the weddings page "This could be
 * you two..." wall. Swap for screenshots of real client posts (likes and
 * comments visible) the way the graduation wall does — same intrinsic
 * sizes as real IG screenshots so nothing reflows on swap.
 */
export const couplesCouldBeYouShots: PortfolioImage[] = [
  {
    src: "/placeholders/could-be-you/couples-1.svg",
    alt: "Instagram post: couple's first dance under string lights — placeholder",
    width: 1206,
    height: 1540,
  },
  {
    src: "/placeholders/could-be-you/couples-2.svg",
    alt: "Instagram post: sparkler exit at the end of the night — placeholder",
    width: 1206,
    height: 1620,
  },
  {
    src: "/placeholders/could-be-you/couples-3.svg",
    alt: "Instagram post: golden hour portrait from the engagement session — placeholder",
    width: 1206,
    height: 1560,
  },
  {
    src: "/placeholders/could-be-you/couples-4.svg",
    alt: "Instagram post: bride mid-spin, veil in motion — placeholder",
    width: 1206,
    height: 1600,
  },
  {
    src: "/placeholders/could-be-you/couples-5.svg",
    alt: "Instagram post: glasses raised during the toasts — placeholder",
    width: 1206,
    height: 1500,
  },
];

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
