/**
 * The brand-wide satisfaction guarantee — rendered as its own sealed
 * section after the FAQ on every sales page. Distinct from the per-offer
 * guarantee terms inside each offer stack (see offers.ts): this is the
 * umbrella promise in its simplest, most memorable form.
 */
export type Guarantee = {
  eyebrow: string;
  /** heading renders as: headingPre <gold accent> headingPost */
  headingPre: string;
  headingAccent: string;
  headingPost: string;
  body: string;
};

export const satisfactionGuarantee: Guarantee = {
  eyebrow: "Book your session risk-free",
  headingPre: "The",
  headingAccent: "Frame-Worthy",
  headingPost: "Guarantee",
  body: "You should love your photos — not talk yourself into them. If you open your gallery and it isn't everything you hoped for, just tell me, and I'll shoot your entire session again for free. No fine print, no hoops, no hard feelings — I don't stop until you have photos you can't wait to frame.",
};
