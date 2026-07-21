import { randomBytes } from "node:crypto";

export const BOOKING_ID_RE = /^BK-[A-F0-9]+$/i;

export function newBookingId(): string {
  return `BK-${randomBytes(4).toString("hex").toUpperCase()}`;
}
