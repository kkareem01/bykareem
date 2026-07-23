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
    sub: "bykareem is a one-team photo and film experience for Georgia's biggest moments — directed so you look like yourselves, delivered while it still feels like yesterday.",
    trust: [
      "Super fast turnaround",
      "Love your photo guarantee",
      "Planning done easy",
    ],
  },
  /**
   * The only two doors on the home page — every CTA funnels visitors
   * into one of the two niche landing pages, never straight to booking.
   */
  paths: {
    weddings: { label: "We're Getting Married", href: "/weddings" },
    graduation: { label: "I'm Graduating", href: "/graduation" },
  },
  pathCta: {
    eyebrow: "two experiences",
    heading: "Big day, or big milestone?",
    sub: "Everything here is built for one of two chapters. Pick yours — each page walks you through exactly how it works.",
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
    ],
  },
  testimonialsSection: {
    eyebrow: "real couples",
    heading: "The reviews say “awkward.” The galleries say otherwise.",
  },
  finalCta: {
    heading: "Ready when you are.",
    sub: "Two experiences, one team behind the camera. Pick yours and see exactly how it works — and what it costs.",
  },
} as const;

export const contactCopy = {
  eyebrow: "contact",
  heading: "Let's talk.",
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
