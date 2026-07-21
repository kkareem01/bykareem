/**
 * PLACEHOLDER TESTIMONIALS — every entry below is illustrative filler and
 * MUST be replaced with real client words (with permission) before launch.
 * The `placeholder` flag keeps that state auditable.
 */

export type Testimonial = {
  quote: string;
  names: string;
  context: string;
  placeholder: boolean;
};

export const couplesTestimonials: Testimonial[] = [
  {
    quote:
      "We told him we were the most awkward couple alive. Two hours later we had photos where we're actually laughing — real laughing. Our sneak peek was in our inbox before our flight to the honeymoon.",
    names: "M. & J.",
    context: "Wedding — Atlanta, GA",
    placeholder: true,
  },
  {
    quote:
      "One person handled our photos AND our film and somehow caught everything. My dad crying during the toast. My grandmother's hands. Things we didn't even see that day.",
    names: "S. & D.",
    context: "Wedding — Athens, GA",
    placeholder: true,
  },
  {
    quote:
      "Every message answered same-day. Every date hit. After the vendor horror stories our friends told us, it honestly felt one of one.",
    names: "A. & K.",
    context: "Engagement + Wedding — North Georgia",
    placeholder: true,
  },
];

export const graduationTestimonials: Testimonial[] = [
  {
    quote:
      "Gallery came back in two days — my announcements went out on time and my mom cried at the family shots he threw in for free.",
    names: "T. R.",
    context: "Graduation — UGA",
    placeholder: true,
  },
  {
    quote:
      "I don't take good photos. That's what I believed until this session. He directs you the entire time — you never just stand there.",
    names: "L. B.",
    context: "Graduation — Georgia Tech",
    placeholder: true,
  },
];
