import { describe, expect, it } from "vitest";
import {
  couplesCouldBeYouShots,
  couplesSessionStrip,
  filmReel,
  galleries,
  gradCouldBeYouShots,
  gradSessionStrip,
  portfolioCopy,
  stories,
  type PortfolioImage,
} from "@/content/portfolio";

/**
 * Guardrails for the portfolio content config. These encode the curation
 * rules the galleries were designed around, so swapping placeholders for
 * real work can't silently break the layout or the strategy:
 * - 12–15 images per niche gallery (curated wall, not a dump)
 * - natural intrinsic dimensions on every image (no forced crops)
 * - real alt text everywhere (a11y + SEO)
 * - stories are complete arcs, not mini-walls
 */

function expectValidImage(img: PortfolioImage) {
  expect(img.src, "src must be a root-relative path").toMatch(/^\//);
  expect(img.alt.trim().length, `alt missing for ${img.src}`).toBeGreaterThan(
    10,
  );
  expect(img.width, `width missing for ${img.src}`).toBeGreaterThan(0);
  expect(img.height, `height missing for ${img.src}`).toBeGreaterThan(0);
}

function expectNoDuplicates(images: PortfolioImage[], label: string) {
  const srcs = images.map((i) => i.src);
  expect(new Set(srcs).size, `duplicate images in ${label}`).toBe(srcs.length);
}

describe("niche galleries", () => {
  const entries = Object.entries(galleries) as [string, PortfolioImage[]][];

  it("has a gallery for both audiences", () => {
    expect(Object.keys(galleries).sort()).toEqual(["couples", "graduation"]);
  });

  it.each(entries)("%s gallery holds 12–15 curated images", (_, images) => {
    expect(images.length).toBeGreaterThanOrEqual(12);
    expect(images.length).toBeLessThanOrEqual(15);
  });

  it.each(entries)("%s gallery images are valid and unique", (name, images) => {
    images.forEach(expectValidImage);
    expectNoDuplicates(images, name);
  });

  it.each(entries)(
    "%s gallery varies aspect ratios (portrait and landscape both present)",
    (_, images) => {
      const portrait = images.filter((i) => i.height > i.width);
      const landscape = images.filter((i) => i.width > i.height);
      expect(portrait.length).toBeGreaterThan(0);
      expect(landscape.length).toBeGreaterThan(0);
    },
  );
});

describe("featured stories", () => {
  it("ships exactly two stories, one per audience", () => {
    expect(stories).toHaveLength(2);
    expect(new Set(stories.map((s) => s.audience))).toEqual(
      new Set(["couples", "graduation"]),
    );
  });

  it("uses unique kebab-case slugs", () => {
    const slugs = stories.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it.each(stories.map((s) => [s.slug, s] as const))(
    "%s has title, location, intro, cover, and a full arc of 8+ images",
    (_, story) => {
      expect(story.title.trim().length).toBeGreaterThan(0);
      expect(story.location.trim().length).toBeGreaterThan(0);
      expect(story.intro.trim().length).toBeGreaterThan(20);
      expectValidImage(story.cover);
      expect(story.images.length).toBeGreaterThanOrEqual(8);
      story.images.forEach(expectValidImage);
      expectNoDuplicates(story.images, story.slug);
    },
  );
});

describe("session strips (editorial collages)", () => {
  const strips: [string, PortfolioImage[]][] = [
    ["gradSessionStrip", gradSessionStrip],
    ["couplesSessionStrip", couplesSessionStrip],
  ];

  it.each(strips)(
    "%s holds 8–14 images so the staggered columns stay balanced",
    (_, strip) => {
      expect(strip.length).toBeGreaterThanOrEqual(8);
      expect(strip.length).toBeLessThanOrEqual(14);
    },
  );

  it.each(strips)("%s images are valid and unique", (name, strip) => {
    strip.forEach(expectValidImage);
    expectNoDuplicates(strip, name);
  });

  it.each(strips)(
    "%s mixes portrait and landscape for the strip's rhythm",
    (_, strip) => {
      const portrait = strip.filter((i) => i.height > i.width);
      const landscape = strip.filter((i) => i.width > i.height);
      expect(portrait.length).toBeGreaterThan(0);
      expect(landscape.length).toBeGreaterThan(0);
    },
  );
});

describe("could-be-you walls (social proof strips)", () => {
  const walls: [string, PortfolioImage[]][] = [
    ["gradCouldBeYouShots", gradCouldBeYouShots],
    ["couplesCouldBeYouShots", couplesCouldBeYouShots],
  ];

  it.each(walls)("%s is non-empty with valid, unique images", (name, wall) => {
    expect(wall.length).toBeGreaterThan(0);
    wall.forEach(expectValidImage);
    expectNoDuplicates(wall, name);
  });
});

describe("film reel", () => {
  it("always has a poster so the section renders before a video exists", () => {
    expectValidImage(filmReel.poster);
  });

  it("videoSrc is either null or a root-relative mp4 path", () => {
    if (filmReel.videoSrc !== null) {
      expect(filmReel.videoSrc).toMatch(/^\/.+\.(mp4|webm)$/);
    }
  });
});

describe("portfolio copy", () => {
  it("has non-empty strings for every section heading", () => {
    expect(portfolioCopy.hero.heading.length).toBeGreaterThan(0);
    expect(portfolioCopy.film.heading.length).toBeGreaterThan(0);
    expect(portfolioCopy.stories.heading.length).toBeGreaterThan(0);
    expect(portfolioCopy.couplesGallery.heading.length).toBeGreaterThan(0);
    expect(portfolioCopy.gradGallery.heading.length).toBeGreaterThan(0);
  });
});
