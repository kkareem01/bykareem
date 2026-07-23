/**
 * Weddings & engagements page copy — current circumstances → dream
 * outcome → the bridge (the named offer). Same arc as the graduation
 * page, kept short and direct on purpose.
 *
 * Pain points sourced from wedding-planning communities and press
 * coverage of r/weddingplanning threads (July 2026 research): vendors
 * ghosting after full payment (dozens-of-brides cases, $7k paid and
 * only sneak peeks delivered), galleries promised in "10–12 months,"
 * blurry/missed-moment galleries (no bride-with-bridesmaids shots, no
 * shot list), the #1 recurring married-couple regret — skipping or
 * cheaping out on video ("all we have are stills") — and the universal
 * first-call line: "we're just not photogenic."
 * NOT used, because research didn't confirm them as top pains: "photo
 * and video teams colliding on the day" and opaque-pricing rage — both
 * appear only as minor gripes, so neither leads a section.
 */

export const weddingsCopy = {
  hero: {
    eyebrow: "weddings & engagements · georgia",
    h1: "Wedding photos and film you'll actually relive —",
    h1Accent: "even if you two are “the awkward ones.”",
    sub: "One directed team for photos and cinema, anywhere in Georgia — every moment mapped before the day, and your sneak peek back in 48 hours, guaranteed in writing.",
    cta: "See If Your Date's Open",
  },

  /** One trust line under every CTA — pre-answers time, money, risk. */
  ctaNote: "Free 30-min call · Exact quote on the call · No deposit due today",

  /** Section 1 — where they are right now */
  problem: {
    heading: "Everything is booked. Except the one vendor you can't get wrong.",
    paragraphs: [
      "The venue is locked. The guest list keeps mutating. And the photo-and-video decision keeps sliding to next weekend — because every option feels like a coin flip with the only day you can't redo.",
      "You've read the threads. Couples who paid thousands, got a handful of sneak peeks, then silence. Galleries that showed up a year later — or blurry, with no photo of the bride and her bridesmaids, because nobody ever asked what mattered. These aren't urban legends. They're last month's posts.",
      "And be honest — there's a quieter worry underneath. You two feel awkward in front of a camera. Three hundred photos of you standing stiff next to each other sounds like a nightmare you're paying for.",
      "So the temptation is to go cheap, or skip the film to protect the budget. Ask any married couple their biggest regret — it's that. Every time.",
    ],
  },

  /** Social proof between problem and dream — same wall as the home page */
  socialProof: {
    heading: "What people are saying",
  },

  /** Section 2 — the dream outcome */
  dream: {
    heading: "A wedding day where the camera is the last thing on your mind",
    paragraphs: [
      "Someone directs you two the whole way through — where to stand, when to walk, what to do with your hands. It's prompts and real moments, never mannequin poses. By the ceremony, the camera is just furniture.",
      "Forty-eight hours later — before the honeymoon flight lands — a sneak peek gallery and a teaser film are in your inbox. The group chat detonates. Your mom has already made one of them her profile picture.",
      "And years from now, on a random anniversary, you press play and get the whole day back: your dad's face during the toast, grandma on the dance floor, the parts you two were too busy living to see.",
    ],
  },

  /** Section 3 — self-select before the pitch */
  filter: {
    heading: "But.... This isn't for everyone",
    notFor: {
      title: "Not for you if…",
      items: [
        "You're collecting quotes to find the cheapest shooter, full stop",
        "A friend with a nice camera feels like basically the same thing",
        "Photos are a checkbox to you — and film isn't even on the list",
      ],
    },
    builtFor: {
      title: "Built for you if…",
      items: [
        "You two are “the awkward ones” — and want a gallery that proves otherwise",
        "You want photos and film as one story, without juggling two vendors",
        "You've read the horror stories and want every date and deliverable in writing",
        "You want the whole thing planned and handled — you just get married",
      ],
    },
  },

  /** Photo proof strip right before the offer pitch */
  sessionStrip: {
    heading: "Real weddings. Real couples.",
    sub: "Straight from recent galleries — every in-between moment on this wall was directed, not lucky.",
  },

  /** Section 4 — the bridge */
  offerIntro: {
    heading: "Introducing The Whole Story Experience",
    sub: "Everything above, handled by one team. Here's what you walk away with:",
  },

  bonusesIntro: {
    heading: "And because your wedding doesn't end at the last dance —",
  },

  /** Below the offer stack — value tally, big CTA */
  offerClosing: {
    preValue: "That's",
    stackValue: "$6,800+",
    midValue: "of value",
    priceLead: "with collections starting at",
    price: "$3,000.",
    ctaPrimary: "Yes Kareem, Let's Talk!",
    ctaSecondary: "One call. Exact quote. Zero pressure.",
  },

  finalCta: {
    heading: "Your date only happens once.",
    sub: "The calendar holds twelve weddings a season, and dates go to whoever calls first. The consult is free, takes about 30 minutes, and ends with an exact quote in writing. No deposit due today.",
    cta: "Claim Your Date",
  },
} as const;
