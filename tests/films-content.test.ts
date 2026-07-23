import { describe, expect, it } from "vitest";
import {
  faresYasmeenFilm,
  filmsCopy,
  hudaFilm,
  nikkahFilm,
  reactionFilm,
  type Film,
} from "@/content/films";

/**
 * Guardrails for the full-length films config. The FilmPlayer facade always
 * renders the poster first, so every film needs a valid poster whether or
 * not it's been uploaded yet, and any id we ship must be a real 11-char
 * YouTube id (a typo here silently 404s the embed on click).
 */

const films: [string, Film][] = [
  ["nikkahFilm", nikkahFilm],
  ["faresYasmeenFilm", faresYasmeenFilm],
  ["hudaFilm", hudaFilm],
  ["reactionFilm", reactionFilm],
];

/** YouTube ids are exactly 11 chars of [A-Za-z0-9_-] (can start with - or _). */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

describe("films", () => {
  it.each(films)(
    "%s always has a poster so the section renders before/until play",
    (_, film) => {
      expect(film.poster.src, "poster src must be root-relative").toMatch(/^\//);
      expect(
        film.poster.alt.trim().length,
        "poster needs real alt text",
      ).toBeGreaterThan(10);
      expect(film.poster.width).toBeGreaterThan(0);
      expect(film.poster.height).toBeGreaterThan(0);
    },
  );

  it.each(films)("%s has a title and a fallback note", (_, film) => {
    expect(film.title.trim().length).toBeGreaterThan(0);
    expect(film.fallbackNote.trim().length).toBeGreaterThan(0);
  });

  it.each(films)(
    "%s youtubeId is null or a valid 11-char YouTube id",
    (_, film) => {
      if (film.youtubeId !== null) {
        expect(film.youtubeId).toMatch(YOUTUBE_ID);
      }
    },
  );
});

describe("films copy", () => {
  it("has non-empty eyebrow + heading for every film placement", () => {
    for (const section of Object.values(filmsCopy)) {
      expect(section.eyebrow.length).toBeGreaterThan(0);
      expect(section.heading.length).toBeGreaterThan(0);
    }
  });
});
