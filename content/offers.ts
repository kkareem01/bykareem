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

/**
 * Couples stack values are anchored to published Atlanta/Georgia market
 * rates (researched July 2026): established Atlanta wedding photography
 * medians ~$3,150 with base packages $1,800–4,500 (Rateven, The Knot);
 * Atlanta videography typically $2,000–10,000 with $2,133–2,607 the
 * typical hire (Roose Film Co, Wedding Report); standalone engagement
 * sessions $300–1,000, $500–1,500 for two hours (Simply Eloped, local
 * studios). Pain research: post-payment ghosting and 10–12-month
 * delivery horror stories, missed-moment galleries, and the #1 married
 * regret — skipping video (see content/weddings-copy.ts header).
 */
export const couplesOffer: Offer = {
  name: "The Whole Story Experience",
  audience: "couples",
  promise:
    "Your wedding in photos and cinema from one directed team — every moment mapped before the day, and proof in your inbox 48 hours after it.",
  items: [
    {
      name: "One Team, Photo + Cinema",
      pain: "“Our biggest regret was skipping the video.”",
      outcome:
        "Full-day photography and a cinematic wedding film from one unified team — one style, one story, nothing to coordinate. You never have to join the couples who saved money on film and talk about it forever.",
      valueLabel: "$5,200 value",
      visual: {
        src: "/placeholders/offer/one-team.svg",
        alt: "One team capturing photo and film together — a camera and a cinema frame sharing the same moment",
      },
    },
    {
      name: "The Moments Map",
      pain: "“Our photographer missed the shots that actually mattered.”",
      outcome:
        "Before the day, we co-write the list of every person, detail, and moment that matters — you with your bridesmaids, the letter from your dad, grandma dancing — and your coverage timeline is built around it. Nothing important is left to luck.",
      valueLabel: "$250 value",
      visual: {
        src: "/placeholders/offer/moments-map.svg",
        alt: "A written moments checklist, every must-have moment ticked off",
      },
    },
    {
      name: "Directed, Never Posed",
      pain: "“We're just not photogenic.”",
      outcome:
        "You two are directed every second the camera is up — prompts, movement, real reactions, never stiff poses. It works even if you've hated every photo of yourselves. Especially then.",
      valueLabel: "included",
      visual: {
        src: "/placeholders/offer/direction-day.svg",
        alt: "Direction prompt card: “Walk toward me — now look at each other and laugh.”",
      },
    },
    {
      name: "The 48-Hour Sneak Peek",
      pain: "“Couples wait months — some wait a year — for their photos.”",
      outcome:
        "25+ fully edited photos and a 60-second teaser film in your inbox within 48 hours of your wedding — shared, posted, and relived while it still feels like yesterday. Because it was.",
      valueLabel: "$400 value",
      visual: {
        src: "/placeholders/offer/sneak-peek-48h.svg",
        alt: "Phone notification: your sneak peek is ready, 48 hours after the wedding",
      },
    },
    {
      name: "The In-Writing Promise",
      pain: "“I've read the ghosting horror stories.”",
      outcome:
        "Every delivery date in your contract before you sign, every message answered within 24 hours, and one point of contact from the first call to the final gallery. Booked means booked.",
      valueLabel: "included",
      visual: {
        src: "/placeholders/offer/in-writing.svg",
        alt: "A signed contract page with the delivery dates highlighted in gold",
      },
    },
  ],
  bonuses: [
    {
      name: "The Golden Hour Engagement Session",
      pain: "You want a dry run before the big day.",
      outcome:
        "A full directed engagement shoot at golden hour — your save-the-dates, your practice round, and proof the direction works before the day that counts.",
      valueLabel: "$450 value",
      visual: {
        src: "/placeholders/offer/engagement-golden-hour.svg",
        alt: "Couple silhouetted at golden hour during their engagement session",
      },
    },
    {
      name: "The Social Cuts",
      pain: "You want to share it everywhere, instantly.",
      outcome:
        "Three vertical edits cut for Instagram and TikTok, delivered with your sneak peek — while your wedding is still the group chat's main story.",
      valueLabel: "$300 value",
      visual: {
        src: "/placeholders/offer/social-cuts.svg",
        alt: "Three vertical phone frames of wedding film clips, cut for social",
      },
    },
    {
      name: "The Private Cinema Gallery",
      pain: "A USB in a drawer isn't a legacy.",
      outcome:
        "Your full gallery and 4K film in a private online cinema — share it with anyone, stream it on any anniversary, hosted for life.",
      valueLabel: "$200 value",
      visual: {
        src: "/placeholders/offer/cinema-gallery.svg",
        alt: "A private online cinema screen playing the wedding film",
      },
    },
  ],
  guarantee: {
    name: "The Whole Story Guarantee",
    terms:
      "If your sneak peek isn't in your inbox within 48 hours of your wedding, $500 comes off your balance. If you don't love your engagement session, we reshoot it free. And every delivery date lives in your contract — if one slips, you're compensated in writing too.",
    finePrint:
      "PLACEHOLDER terms — confirm the exact guarantee you'll honor before launch.",
  },
  scarcity: {
    limit: 12,
    window: "per season",
    reason:
      "Every wedding gets the Moments Map, full direction, and the 48-hour edit. That doesn't scale, so the calendar is capped — when the season is full, it's full.",
  },
  pricing: {
    stackValueLabel: "$6,800+ in stacked value",
    investmentLabel: "Collections start at $3,000",
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
      valueLabel: "$400 value",
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
      valueLabel: "$75 value",
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
      valueLabel: "$100 value",
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
        "Fifteen minutes of your session, reserved and yours to choose: family portraits, your best friends jumping in, or a solo second look with a fresh outfit — whenever it fits the session best.",
      valueLabel: "$75 value",
      visual: {
        src: "/placeholders/offer/closing-fifteen.svg",
        alt: "Three ways to spend your reserved fifteen minutes: family, friends, or a solo second look",
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
    stackValueLabel: "$1,100+ in stacked value",
    investmentLabel: "The full session: $297",
    note: "Every value above is anchored to published Georgia rates — the same sessions, headshots, and minis you can Google. One flat price, every digital included.",
  },
};
