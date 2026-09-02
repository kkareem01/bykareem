/**
 * Status line shown under the month grid. Pure so it can be unit-tested
 * without a DOM: the grid itself stays rendered (possibly empty) and this
 * message explains why there is nothing to click.
 */

export type CalendarStatusInput = {
  loading: boolean;
  error: string | null;
  dayCount: number;
};

export const CALENDAR_LOADING_MESSAGE = "Loading availability…";
export const CALENDAR_ERROR_MESSAGE =
  "Couldn't load availability. Please refresh, or text me and we'll set a time.";

/** Message to display, or null when the grid speaks for itself. */
export function calendarStatus({
  loading,
  error,
  dayCount,
}: CalendarStatusInput): string | null {
  if (loading) return CALENDAR_LOADING_MESSAGE;
  if (error) return error;
  if (dayCount === 0) return CALENDAR_ERROR_MESSAGE;
  return null;
}
