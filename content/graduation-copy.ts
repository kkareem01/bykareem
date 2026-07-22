/**
 * Graduation page copy — current circumstances → dream outcome → the
 * bridge (the named offer). Kept short and direct on purpose.
 *
 * Pain points sourced from archived grad threads on Reddit (r/UGA,
 * r/gatech, r/college, July 2026 research): per-photo "scam" pricing
 * from ceremony contractors ($45/watermarked download — the #1 rage),
 * the last-minute booking scramble, flaky photographers, "I'm just
 * not photogenic," and the alumni-regret pattern ("take it from an
 * alum that never got their grad photos — you'll regret it").
 * Turnaround complaints were ABSENT in research — speed is framed
 * around their real deadlines (announcements, commencement slides),
 * not an invented "galleries take a month" pain.
 */

export const graduationCopy = {
  hero: {
    eyebrow: "class of 2027 · georgia campuses",
    h1: "Grad photos you'll actually love —",
    h1Accent: "even if you swear you're not photogenic.",
    sub: "Directed sessions on your Georgia campus — every pose coached, and your full gallery back in 72 hours, guaranteed in writing.",
    cta: "Book My Grad Session",
  },

  /** One trust line under every CTA — pre-answers time, money, speed. */
  ctaNote: "Takes ~2 minutes · No payment due today · Gallery back in 72 hours",

  /** Section 1 — where they are right now */
  problem: {
    heading: "Grad photos are on your list. They keep not happening.",
    paragraphs: [
      "Finals. Job interviews. Family asking about flights and dates you don't know yet. And then there are the photos — the one thing you can't push back. In a few weeks, campus won't be yours anymore.",
      "You've seen how it goes for other people. The university's contract photographer wants $45 for one watermarked download of a handshake. The cheap shooter rushes you through the same three spots. And every alum says the same thing: the ones who skipped photos still regret it.",
      "And be honest — there's another reason you keep putting it off. You think you look bad in photos. Standing there while a stranger snaps away sounds awful.",
      "So the plan becomes a friend with a camera and crossed fingers. For a moment you only get once.",
    ],
  },

  /** Social proof between problem and dream — same wall as the home page */
  socialProof: {
    heading: "What people are saying",
  },

  /** Section 2 — the dream outcome */
  dream: {
    heading: "An easy photoshoot with photos that actually look like you",
    paragraphs: [
      "A shoot where someone tells you what to do the whole time. Where to look. How to move. What to do with your hands. It works even if you've never liked a photo of yourself. Especially then.",
      "Three days later, your photos land in your inbox. Announcements go out on time, your commencement slide is submitted early. Your LinkedIn photo finally matches the degree. Your mom sends the same picture to everyone she knows.",
      "Four years of hard work — up on a wall, not lost in your camera roll.",
    ],
  },

  /** Section 3 — self-select before the pitch */
  filter: {
    heading: "But.... This isn't for everyone",
    notFor: {
      title: "Not for you if…",
      items: [
        "A phone pic at the campus sign is all you really want",
        "You're hunting for the cheapest shooter on campus",
        "You have no deadline — no announcements, no slide due, nobody waiting",
      ],
    },
    builtFor: {
      title: "Built for you if…",
      items: [
        "You're “not photogenic” — and want photos that prove otherwise",
        "Your family flew in, and this matters to them too",
        "You have real deadlines: announcements, LinkedIn, the group chat",
        "You want it planned and handled — you just show up",
      ],
    },
  },

  /** Photo proof strip right before the offer pitch */
  sessionStrip: {
    heading: "Real sessions. Real grads.",
    sub: "Straight from this season's camera rolls — every laugh on this wall was directed, not lucky.",
  },

  /** Section 4 — the bridge */
  offerIntro: {
    heading: "Introducing The Milestone Session",
    sub: "Everything above, solved in one directed session. Here's what you walk away with:",
  },

  bonusesIntro: {
    heading: "And for the people who got you here — or just for you —",
  },

  /** Below the offer stack — value tally, big CTA */
  offerClosing: {
    preValue: "That's",
    stackValue: "$1,100+",
    midValue: "of value",
    priceLead: "for only",
    price: "$297.",
    ctaPrimary: "Yes Kareem, I'm In!",
    ctaSecondary: "Book your grad session today",
  },

  finalCta: {
    heading: "Campus stops being yours in a few weeks.",
    sub: "Grad season is short and the calendar is capped at 20. The price is on this page — pick your date, pick your time, and you're booked in about two minutes. No payment due today.",
    cta: "Book My Grad Session",
  },
} as const;
