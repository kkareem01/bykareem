/**
 * Page-level copy — headlines, section intros, pains, process steps.
 * Written for decommoditization: sell the dream outcome and the named
 * experience, never the commodity service.
 */

export const homeCopy = {
  hero: {
    // Google rating trust badge rendered as the eyebrow
    googleBadge: {
      label: "5.0 / 5",
      srLabel: "Rated 5.0 out of 5 stars on Google",
    },
    // Each entry renders on its own line on mobile; flows naturally on md+.
    // <em> segments render as italic gold accents
    h1: [
      "Professional",
      "Photographer & Videographer",
      "in Atlanta, Georgia.",
    ],
    h1Accent: "100+ Captured.",
    sub: "bykareem is a one-team photo and film experience for couples in Georgia — directed so you look like yourselves, delivered while it still feels like yesterday.",
    cta: "View Portfolio",
    trust: [
      "Super fast turnaround",
      "Love your photo guarantee",
      "Planning done easy",
    ],
  },
  pains: {
    eyebrow: "sound familiar?",
    heading: "Most wedding photography is a gamble. You feel it too.",
    cards: [
      {
        title: "The mannequin problem",
        body: "Stiff, posed, say-cheese photos that look like everyone else's — and nothing like the two of you.",
      },
      {
        title: "The missing moments",
        body: "Your dad's face during the toast. Grandma's hands. The look before the doors opened. Gone, because nobody planned to catch them.",
      },
      {
        title: "The four-month wait",
        body: "The most alive day of your life, delivered one season later, when the feeling has already faded.",
      },
      {
        title: "The vendor ghost",
        body: "Deposits paid, emails unanswered. You shouldn't have to chase the person holding your memories.",
      },
    ],
  },
  manifesto: {
    eyebrow: "why one of one",
    heading: "I don't sell photography. I build heirlooms.",
    body: [
      "Photography is a commodity. Scroll long enough and every Georgia photographer starts to blur together — same poses, same presets, same four-month wait.",
      "This is built differently: one person directing your photos and your film as a single story, a process designed around the moments that can't be re-staged, and delivery measured in hours, not seasons.",
      "That only works at small scale. So the calendar stays small — a handful of weddings a season, each one treated like the only one.",
    ],
  },
  process: {
    eyebrow: "how it works",
    heading: "Three steps between you and never worrying about this again.",
    steps: [
      {
        title: "Book a free call",
        body: "20 relaxed minutes. Your story, your date, your questions — and an exact quote before we hang up.",
      },
      {
        title: "We design your day",
        body: "Direction Session, Story Map, timeline. Every moment that matters gets a plan.",
      },
      {
        title: "Relive it forever",
        body: "Sneak peek in 48 hours. Full gallery and film on a date you knew before you signed.",
      },
    ],
  },
  gallery: {
    eyebrow: "the work",
    heading: "Moments, not poses.",
  },
  reviews: {
    heading: "What people are saying",
  },
  about: {
    eyebrow: "about me",
    heading: "Hi, I'm Kareem.",
    body: [
      "I'm a photographer and filmmaker based in Georgia, and I built bykareem around one belief: the best photos happen in the moments between the poses.",
      "I direct the whole way through — prompts, movement, real laughter — so you never stand there wondering what to do with your hands. Then I edit fast, because a memory relived while it's still warm hits different than one delivered a season later.",
      "PLACEHOLDER — swap in your real story: how you started, what you shoot on, why you care about this work.",
    ],
  },
  testimonialsSection: {
    eyebrow: "real couples",
    heading: "The reviews say “awkward.” The galleries say otherwise.",
  },
  finalCta: {
    heading: "Your date is being asked about by other couples right now.",
    sub: "That's not a scare tactic — it's a small calendar. Book the free call; the worst case is a great conversation and an exact quote.",
    cta: "Book a Free Consult",
  },
  gradStrip: {
    text: "Graduating this year?",
    linkLabel: "The Milestone Session →",
  },
} as const;

export const weddingsCopy = {
  hero: {
    eyebrow: "the flagship experience",
    h1: "The last wedding vendor decision",
    h1Accent: "you'll actually enjoy making.",
    sub: "One team for photos and film. A process built around the moments that can't be re-staged. Proof in your inbox 48 hours later.",
    cta: "Book a Free Consult",
  },
  narrative: {
    eyebrow: "the truth about wedding media",
    heading: "Why most wedding galleries feel the same",
    body: [
      "Because most of them are made the same way: show up, run the standard shot list, pose the couple like furniture, disappear into a four-month editing queue.",
      "The parts of your day you'll actually ache to relive — the shaky breath before the aisle, your people laughing at dinner, the last song — don't survive that process. They were never in the plan.",
      "The Heirloom Experience exists because those moments deserve a plan of their own.",
    ],
  },
  offerIntro: {
    eyebrow: "the offer",
    heading: "Everything inside The Heirloom Experience",
    sub: "Each piece exists to kill a specific way weddings get ruined for couples. Nothing here is filler.",
  },
  bonusesIntro: {
    eyebrow: "included bonuses",
    heading: "And because you shouldn't have to ask —",
  },
  caseStudies: {
    eyebrow: "recent stories",
    heading: "Three couples, three completely different days.",
    items: [
      {
        title: "The rain plan that became the favorite photo",
        body: "A downpour at an outdoor ceremony in Athens. Because the Story Map had a weather plan, the umbrella shot became the one they printed over the fireplace. PLACEHOLDER — replace with a real story.",
      },
      {
        title: "The toast nobody else caught",
        body: "The film team was on the couple; the photo side was pre-positioned on dad. Both got it. One team, one plan. PLACEHOLDER — replace with a real story.",
      },
      {
        title: "Married Saturday, sneak peek Monday",
        body: "Their gallery preview and teaser film landed before they boarded the honeymoon flight. PLACEHOLDER — replace with a real story.",
      },
    ],
  },
  finalCta: {
    heading: "If your date is open, it won't stay open.",
    sub: "The free call takes 20 minutes and ends with an exact quote. No deposit, no pressure — just a straight answer.",
    cta: "Book a Free Consult",
  },
} as const;

export const contactCopy = {
  hero: {
    eyebrow: "general inquiries",
    h1: "Not a wedding? Not graduating?",
    h1Accent: "Still worth a call.",
    sub: "Proposals, birthdays, brand shoots, events — a limited number of other projects make the calendar each month. Tell me what you're planning and let's find out if yours fits.",
    cta: "Book a Free Call",
  },
  direct: {
    heading: "Prefer to just reach out?",
    sub: "Email or DM anytime — every message gets a reply within 24 hours. That's not a slogan; it's in writing on every contract.",
  },
} as const;

export type BookingCopy = {
  title: string;
  sub: string;
  steps: {
    type: string;
    date: string;
    time: string;
    details: string;
    confirm: string;
  };
  confirmNote: string;
  slotTaken: string;
  confirmed: {
    heading: string;
    sub: string;
    steps: readonly string[];
  };
};

/** Consult-call copy — couples and general inquiries book a free call. */
export const bookingCopy: BookingCopy = {
  title: "Book your free consult call",
  sub: "Pick a time that works. The call is 20–30 minutes, obligation-free, and ends with an exact quote.",
  steps: {
    type: "What's the occasion?",
    date: "Pick a day",
    time: "Pick a time",
    details: "Tell me about you",
    confirm: "Confirm your call",
  },
  confirmNote:
    "You'll get an email confirmation with a calendar invite. I'll call you at the number you provide.",
  slotTaken:
    "Ah — someone just grabbed that time. Here are the times still open:",
  confirmed: {
    heading: "You're booked.",
    sub: "Check your inbox for the confirmation and calendar invite. Here's what happens next:",
    steps: [
      "I call you at your chosen time — no prep needed.",
      "We talk through your date, your vision, and what matters most.",
      "You get an exact quote before we hang up. Decide whenever you're ready.",
    ],
  },
};

/**
 * Graduation books the Milestone Session itself — no consult call in
 * between. Copy keeps the promise of the page CTA: date, time, done.
 */
export const gradBookingCopy: BookingCopy = {
  title: "Book your grad session",
  sub: "Pick your date, pick your start time, tell me about you — you're on the calendar in about two minutes. No payment due today.",
  steps: {
    type: "What's the occasion?",
    date: "Pick your session day",
    time: "Pick your start time",
    details: "Tell me about you",
    confirm: "Book My Grad Session",
  },
  confirmNote:
    "You'll get an email confirmation with a calendar invite, and I'll text you to lock in your campus meeting spot. No payment due today.",
  slotTaken:
    "Ah — someone just grabbed that time. Here are the times still open:",
  confirmed: {
    heading: "You're on the calendar.",
    sub: "Check your inbox for the confirmation and calendar invite. Here's what happens next:",
    steps: [
      "I text you within 24 hours to confirm your campus, your route, and where we meet.",
      "You get the one-page prep guide — outfits, cap and gown, what to bring.",
      "Show up and get directed every second. Your full gallery lands within 72 hours.",
    ],
  },
};

/** Booking copy for a consult type — graduation gets session copy. */
export function getBookingCopy(audience: string): BookingCopy {
  return audience === "graduation" ? gradBookingCopy : bookingCopy;
}
