import { describe, expect, it } from "vitest";
import {
  CALENDAR_ERROR_MESSAGE,
  CALENDAR_LOADING_MESSAGE,
  calendarStatus,
} from "@/components/booking/calendar-status";

describe("calendarStatus", () => {
  it("shows the loading message while the month is fetching", () => {
    expect(calendarStatus({ loading: true, error: null, dayCount: 0 })).toBe(
      CALENDAR_LOADING_MESSAGE,
    );
  });

  it("prefers loading over a stale error", () => {
    expect(
      calendarStatus({ loading: true, error: "boom", dayCount: 0 }),
    ).toBe(CALENDAR_LOADING_MESSAGE);
  });

  it("surfaces the fetch error once loading finishes", () => {
    expect(
      calendarStatus({ loading: false, error: "boom", dayCount: 0 }),
    ).toBe("boom");
  });

  it("never leaves an empty grid unexplained", () => {
    expect(calendarStatus({ loading: false, error: null, dayCount: 0 })).toBe(
      CALENDAR_ERROR_MESSAGE,
    );
  });

  it("is silent when days rendered", () => {
    expect(
      calendarStatus({ loading: false, error: null, dayCount: 30 }),
    ).toBeNull();
  });
});
