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
    {
      src: "/photos/portfolio/couples/wokie-flower-path.jpg",
      alt: "Groom in an embroidered kufi glancing back at his bride as they walk hand in hand through a garden in full bloom",
      width: 1279,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/fares-rolls-royce.jpg",
      alt: "Couple face to face over the fender of a vintage white Rolls-Royce at dusk, bouquet between them",
      width: 1600,
      height: 1279,
    },
    {
      src: "/photos/portfolio/couples/jenan-proposal-kneel.jpg",
      alt: "Groom on one knee at a candlelit rooftop proposal, rose petals scattered across the floor",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/ayesha-twirl.jpg",
      alt: "Bride twirling under her groom's arm in a gold-embroidered lehenga, dupatta in motion",
      width: 1600,
      height: 1066,
    },
    {
      src: "/photos/portfolio/couples/khadija-settee-laugh.jpg",
      alt: "Bride and groom laughing together on a settee beneath a chandelier and cascading light backdrop",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/jenan-ring-macro.jpg",
      alt: "Close-up of the engagement ring and gold hand chain against the groom's white shirt",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/wokie-kufi-closeup.jpg",
      alt: "Over the bride's shoulder: the groom's embroidered kufi and a quiet embrace in the garden",
      width: 1600,
      height: 1066,
    },
    {
      src: "/photos/portfolio/couples/ayesha-rainbow-sendoff.jpg",
      alt: "Groom leaning into the send-off car for one more look at his bride, a rainbow breaking in the sky behind",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/jenan-street-carry.jpg",
      alt: "Groom carrying his bride across a rain-slicked street, her heels off the ground",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/fares-night-lift.jpg",
      alt: "Groom hoisted on shoulders mid-laugh, surrounded by the crowd under the tent at night",
      width: 1600,
      height: 1000,
    },
    {
      src: "/photos/portfolio/couples/wokie-hydrangea-embrace.jpg",
      alt: "Couple wrapped in an embrace beside blooming hydrangeas, her embroidered shawl catching the light",
      width: 1279,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/ayesha-cake-boop.jpg",
      alt: "Bride booping frosting onto her groom's nose at the cake table, henna hands mid-mischief",
      width: 1600,
      height: 1066,
    },
    {
      src: "/photos/portfolio/couples/jenan-running.jpg",
      alt: "Couple running hand in hand down the street, both mid-laugh",
      width: 1066,
      height: 1600,
    },
    {
      src: "/photos/portfolio/couples/wokie-veil-lift.jpg",
      alt: "Closing image: groom lifting his bride on a tree-lined path, her embroidered veil trailing to the ground",
      width: 1279,
      height: 1600,
    },
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
 * Featured stories — a single day told start to finish. The proof the
 * curated wall can't provide: consistency across a day, not cherry-picked
 * highlights.
 */
export const stories: Story[] = [
  {
    slug: "ayesha-faisal-wedding",
    audience: "couples",
    title: "Ayesha & Faisal — Nikkah to Walima",
    location: "Atlanta, GA",
    intro:
      "Two celebrations, one story — a nikkah in blush and gold, and a walima in mint and grey. Between them, the rain broke just long enough for a rainbow over the send-off car. The day, told the way it unfolded.",
    cover: {
      src: "/photos/portfolio/couples/ayesha-floral-hoop.jpg",
      alt: "Cover: Ayesha and Faisal seated inside a circular floral arch against a blush pink backdrop",
      width: 1600,
      height: 1066,
    },
    images: [
      {
        src: "/photos/portfolio/couples/ayesha-entrance.jpg",
        alt: "The first dance-in: Ayesha in her rose and gold lehenga meeting Faisal on the ballroom floor",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/couples/ayesha-floral-hoop.jpg",
        alt: "Seated together inside the circular floral arch, sharing a look between poses",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/couples/ayesha-hoop-embrace.jpg",
        alt: "Faisal wrapping Ayesha from behind under the floral hoop, her henna hands over his",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/couples/ayesha-twirl.jpg",
        alt: "A twirl under his arm, the gold-embroidered lehenga in full motion",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/couples/ayesha-embrace.jpg",
        alt: "A quiet close embrace, foreheads nearly touching, before rejoining the celebration",
        width: 1600,
        height: 1066,
      },
      {
        src: "/photos/portfolio/couples/ayesha-rainbow-sendoff.jpg",
        alt: "The send-off: Faisal leaning into the car for one more look at his bride, a rainbow overhead",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/couples/ayesha-walima-arch.jpg",
        alt: "Walima day: Ayesha in mint and silver glancing back under the white floral arch",
        width: 1066,
        height: 1600,
      },
      {
        src: "/photos/portfolio/couples/ayesha-walima-portrait.jpg",
        alt: "Face to face at the walima, mint gown and grey suit against the white florals",
        width: 900,
        height: 1600,
      },
      {
        src: "/photos/portfolio/couples/ayesha-cake-boop.jpg",
        alt: "Closing frame: frosting booped onto Faisal's nose at the cake table",
        width: 1600,
        height: 1066,
      },
    ],
  },
  {
    slug: "fares-uga-milestone-session",
    audience: "graduation",
    title: "Fares — The Milestone Session",
    location: "University of Georgia — Athens, GA",
    intro:
      "An empty Sanford Stadium to ourselves, then the Arch, North Campus, and Old College before the crowds showed up. One directed session, told start to finish — the way the morning actually went.",
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
    sub: "A small, honest selection — and two stories so you can see how a day unfolds, not just the highlights.",
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
    eyebrow: "stories",
    heading: "One day, start to finish.",
    sub: "Highlight walls are easy to cherry-pick. These follow a single day in order — the arc of it, chapter to chapter, not just the peaks.",
    cardCta: "View the story",
  },
  midCta: {
    text: "Picturing your own day yet?",
    linkLabel: "Tell me about your day →",
    href: "/book",
  },
  storyPage: {
    backLabel: "← All work",
    backHref: "/portfolio",
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
 * (the proposal, the crowd, the cake) so the "Introducing" section
 * lands on a couple already picturing their own day.
 * Cross-array reuse with `galleries` and the story is fine — the 12–15
 * rule and per-array dup checks apply to `galleries`, not here.
 * Ordered portrait/landscape alternating for the collage's rhythm; keep
 * 8–14 images so the staggered columns stay balanced.
 */
export const couplesSessionStrip: PortfolioImage[] = [
  {
    src: "/photos/portfolio/couples/fares-stage-celebration.jpg",
    alt: "Couple celebrating on the flower-lined stage, a little boy in white looking up at them",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/fares-shoulder-lift.jpg",
    alt: "Groom hoisted above the crowd under the tent chandelier, guests reaching up around him",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/couples/jenan-proposal-wide.jpg",
    alt: "The proposal: down on one knee among candles and white rose petals, her hand over her mouth",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/ayesha-embrace.jpg",
    alt: "Bride and groom in a close embrace against the blush backdrop, mid-laugh",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/couples/wokie-shawl-hug.jpg",
    alt: "Groom sweeping his bride into a hug, her embroidered shawl swinging with the spin",
    width: 1279,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/wokie-meadow-dance.jpg",
    alt: "Couple dancing on the open lawn, her white gown and veil catching the summer light",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/couples/jenan-staircase.jpg",
    alt: "Engagement portrait at the base of the staircase, white drapery and Arabic calligraphy behind them",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/jenan-back-to-back.jpg",
    alt: "Back-to-back grins under the plum tree, arms crossed like a movie poster",
    width: 1600,
    height: 1066,
  },
  {
    src: "/photos/portfolio/couples/khadija-cake-candles.jpg",
    alt: "Cutting the cake together by candlelight, her rose-gold shawl glowing against his black sherwani",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/ayesha-floral-hoop.jpg",
    alt: "Seated together inside a circular floral arch against the blush pink backdrop",
    width: 1600,
    height: 1066,
  },
];

/**
 * Photos for the weddings page "This could be you two..." wall — real
 * frames shown as-is (unlike the grad wall's IG screenshots), one per
 * couple, all portrait so the tilted cards sit at a consistent height.
 * None of these repeat elsewhere on /weddings (hero + session collage).
 */
export const couplesCouldBeYouShots: PortfolioImage[] = [
  {
    src: "/photos/portfolio/couples/wokie-flower-path.jpg",
    alt: "Groom in an embroidered kufi glancing back at his bride as they walk hand in hand through a garden in full bloom",
    width: 1279,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/jenan-proposal-kneel.jpg",
    alt: "Groom on one knee at a candlelit rooftop proposal, rose petals scattered across the floor",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/ayesha-rainbow-sendoff.jpg",
    alt: "Groom leaning into the send-off car for one more look at his bride, a rainbow breaking in the sky behind",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/khadija-settee-laugh.jpg",
    alt: "Bride and groom laughing together on a settee beneath a chandelier and cascading light backdrop",
    width: 1066,
    height: 1600,
  },
  {
    src: "/photos/portfolio/couples/fares-rolls-bouquet.jpg",
    alt: "Couple holding a peach bouquet in front of a vintage white Rolls-Royce at dusk",
    width: 1066,
    height: 1600,
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
