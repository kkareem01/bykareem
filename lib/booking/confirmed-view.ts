/**
 * What the confirmation page renders. Normally hydrated from the DB row;
 * in the TEMPORARY no-database mode the booking route echoes the slot
 * back in the redirect URL and we validate it here instead.
 */

import { BOOKING_ID_RE } from "./id";
import { isValidConsultType } from "./consult-types";
import type { Booking, ConsultType } from "./types";
import { validateDateString, validateTimeString } from "./validate";

export type ConfirmedView = {
  id: string;
  audience: ConsultType;
  date: string;
  time: string;
  /** false when the booking was never persisted (no ICS endpoint) */
  icsAvailable: boolean;
};

export function viewFromBooking(booking: Booking): ConfirmedView {
  return {
    id: booking.id,
    audience: booking.audience,
    date: booking.slot.date,
    time: booking.slot.time,
    icsAvailable: true,
  };
}

type Param = string | string[] | undefined;

/** Rebuild the view from URL params; null when anything is malformed. */
export function viewFromParams(params: {
  id: Param;
  date: Param;
  time: Param;
  type: Param;
}): ConfirmedView | null {
  const { id, date, time, type } = params;
  if (typeof id !== "string" || !BOOKING_ID_RE.test(id)) return null;
  if (!validateDateString(date).ok) return null;
  if (!validateTimeString(time).ok) return null;
  if (!isValidConsultType(type)) return null;
  return {
    id,
    audience: type,
    date: date as string,
    time: time as string,
    icsAvailable: false,
  };
}
