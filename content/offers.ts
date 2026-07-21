/**
 * Grand slam offers (Hormozi value equation: dream outcome × likelihood,
 * divided by time delay × effort). Every stack item exists to kill one
 * named pain. Value labels are ANCHORS — adjust to your real numbers.
 */

export type OfferItem = {
  name: string;
  pain: string;
  outcome: string;
  valueLabel: string;
  /** physical representation of the deliverable (placeholder SVG mockup — swap for real photos) */
  visual?: { src: string; alt: string };
};

export type Offer = {
  /** The named experience — never sell the commodity ("photography") */
  name: string;
  audience: "couples" | "graduation";
  promise: string;
  items: OfferItem[];
  bonuses: OfferItem[];
  guarantee: {
    name: string;
    terms: string;
    /** shown small under the guarantee */
    finePrint?: string;
  };
  scarcity: {
    limit: number;
    window: string;
    reason: string;
  };
  /** total-value anchor vs. investment framing. PLACEHOLDER numbers. */
  pricing: {
    stackValueLabel: string;
    investmentLabel: string;
    note: string;
  };
};

export const couplesOffer: Offer = {
  name: "The Heirloom Experience",
  audience: "couples",
  promise:
    "Your wedding, photographed and filmed by one team — directed so you look like yourselves, delivered while the champagne is still cold.",
  items: [
    {
      name: "The Direction Session",
      pain: "“We're so awkward in front of a camera.”",
      outcome:
        "A private session before your day where you learn my prompt-based direction — movement and moments, never stiff poses. By the wedding, the camera is just furniture.",
      valueLabel: "$350 value",
    },
    {
      name: "The Story Map",
      pain: "“What if the important moments get missed?”",
      outcome:
        "We co-write a shot map of every person, detail, and moment that matters — grandma's hands, the letter from your dad — then I build your photo timeline around it so nothing is left to luck.",
      valueLabel: "$250 value",
    },
    {
      name: "One Team, Photo + Film",
      pain: "“The photographer and videographer kept getting in each other's shots.”",
      outcome:
        "Photos and cinema from one unified team, choreographed together. No elbowing vendors, no duplicated direction, one consistent style across everything you receive.",
      valueLabel: "$900 value",
    },
    {
      name: "The 48-Hour Sneak Peek",
      pain: "“Why does everyone wait 4 months for their photos?”",
      outcome:
        "25+ fully edited photos and a 60-second teaser film in your inbox within 48 hours of your wedding — posted, shared, and relived while it still feels like yesterday. Because it was.",
      valueLabel: "$400 value",
    },
    {
      name: "The Communication Promise",
      pain: "“I've heard horror stories about vendors ghosting.”",
      outcome:
        "Every message answered within 24 hours, every delivery date in writing before you sign, and a single point of contact from first call to final gallery.",
      valueLabel: "included",
    },
  ],
  bonuses: [
    {
      name: "Golden Hour Engagement Session",
      pain: "You want to practice before the big day.",
      outcome:
        "A full engagement shoot at golden hour — your save-the-dates, your dry run, your first taste of the direction style.",
      valueLabel: "$450 value",
    },
    {
      name: "The Social Cuts",
      pain: "You want to share it everywhere, instantly.",
      outcome:
        "Three vertical edits cut for Instagram and TikTok, delivered with your sneak peek.",
      valueLabel: "$300 value",
    },
    {
      name: "The Private Cinema Gallery",
      pain: "A USB in a drawer isn't a legacy.",
      outcome:
        "Your full gallery and 4K film in a private online cinema you can share with anyone, hosted for life.",
      valueLabel: "$200 value",
    },
  ],
  guarantee: {
    name: "The Heirloom Guarantee",
    terms:
      "If your sneak peek isn't in your inbox within 48 hours of your wedding, $500 comes off your balance. And if you don't love your engagement session photos, we reshoot it — free, no questions.",
    finePrint:
      "PLACEHOLDER terms — confirm the exact guarantee you'll honor before launch.",
  },
  scarcity: {
    limit: 12,
    window: "per season",
    reason:
      "Every wedding gets the full weight of my attention — the Direction Session, the Story Map, the 48-hour edit. That doesn't scale, so I don't try to.",
  },
  pricing: {
    stackValueLabel: "$2,850+ in stacked value",
    investmentLabel: "Experiences begin at $2,000",
    note: "PLACEHOLDER anchors — set real numbers before launch. Exact quote designed on your consult call.",
  },
};

/**
 * Grad stack values are anchored to published Georgia market rates
 * (researched July 2026): 90-min sessions $700–850 in Athens (Heather
 * Wall) / $400–700 in Atlanta (Byoodefel); Atlanta headshots $195–375
 * (CK Headshots, Steve Glass); GA mini-sessions $285–450 for 20 min;
 * fastest published competitor gallery turnaround 7–10 days;
 * GradImages charges $44.99 per single ceremony digital (the enemy).
 */
export const graduationOffer: Offer = {
  name: "The Milestone Session",
  audience: "graduation",
  promise:
    "Graduation photos that look like the moment felt — directed, edited, and back in your hands before the announcements and commencement slides are due.",
  items: [
    {
      name: "The Campus Victory Lap",
      pain: "“Everyone's photos are the same three spots.”",
      outcome:
        "A 90-minute directed session across a pre-scouted route — 3+ locations in your campus's best light, unlimited outfit changes.",
      valueLabel: "$550 value",
      visual: {
        src: "/placeholders/offer/victory-lap.svg",
        alt: "Planned photo route across campus with a gold star at the best spot",
      },
    },
    {
      name: "Every Photo, Yours",
      pain: "“$45 for one watermarked download is a scam.”",
      outcome:
        "45+ individually edited photos, every digital included, full print release. No watermarks, no per-photo pricing — ever.",
      valueLabel: "$450 value",
      visual: {
        src: "/placeholders/offer/every-photo-yours.svg",
        alt: "A grid of photos, every one checked off as included — no locks, no watermarks",
      },
    },
    {
      name: "The Recruiter-Ready Headshot",
      pain: "“My LinkedIn photo is a cropped party pic.”",
      outcome:
        "A retouched professional headshot from your session — LinkedIn-ready before your first day.",
      valueLabel: "$200 value",
      visual: {
        src: "/placeholders/offer/headshot.svg",
        alt: "Professional profile card with a polished graduate headshot",
      },
    },
    {
      name: "The 72-Hour Gallery",
      pain: "Announcements and commencement slides have real due dates.",
      outcome:
        "Your full gallery in 72 hours, in writing — every select post-ready in feed, story, and banner crops, with your commencement-slide photo sized to your school's specs.",
      valueLabel: "$150 value",
      visual: {
        src: "/placeholders/offer/gallery-72h.svg",
        alt: "Phone notification: your gallery is ready, 72 hours after your session",
      },
    },
    {
      name: "Never-Awkward Direction",
      pain: "“I'm just not photogenic.”",
      outcome:
        "You're directed every second — where to look, how to move, what to do with your hands. It's how every session runs.",
      valueLabel: "included",
      visual: {
        src: "/placeholders/offer/direction.svg",
        alt: "Direction prompt card: “Look back over your shoulder — now laugh.”",
      },
    },
  ],
  bonuses: [
    {
      name: "The Closing Fifteen",
      pain: "The people who got you here — or just you.",
      outcome:
        "The final 15 minutes, reserved and yours to choose: family portraits, your best friends jumping in, or a solo second look with a fresh outfit.",
      valueLabel: "$285 value",
      visual: {
        src: "/placeholders/offer/closing-fifteen.svg",
        alt: "Three ways to spend the final fifteen minutes: family, friends, or a solo second look",
      },
    },
    {
      name: "The Champagne Send-Off",
      pain: "The shot everyone actually posts.",
      outcome:
        "A champagne-spray finale to close the session — you bring the bottle, I've got the timing, the angle, and the edit.",
      valueLabel: "$75 value",
      visual: {
        src: "/placeholders/offer/champagne-sendoff.svg",
        alt: "Champagne bottle mid-spray with gold confetti",
      },
    },
  ],
  guarantee: {
    name: "The Milestone Guarantee",
    terms:
      "Don't love your gallery? We reshoot free before season ends — or refund you in full. Gallery late? Half price. And if I ever have to cancel, every dollar back, same day.",
    finePrint:
      "PLACEHOLDER terms — confirm the exact guarantee you'll honor before launch.",
  },
  scarcity: {
    limit: 20,
    window: "per graduation season",
    reason:
      "Grad season is short, everyone books late, and the 72-hour turnaround is real — so the calendar is capped. When it's full, it's full.",
  },
  pricing: {
    stackValueLabel: "$1,710+ in stacked value",
    investmentLabel: "The full session: $395",
    note: "Every value above is anchored to published Georgia rates — the same sessions, headshots, and minis you can Google. One flat price, every digital included.",
  },
};
