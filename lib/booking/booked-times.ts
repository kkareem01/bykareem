/**
 * Booked-slot lookups that degrade gracefully when no database is
 * configured (TEMPORARY: production had no TURSO_* vars). Without a DB
 * nothing is known to be booked, so every schedule slot reads as open.
 */

import { ensureBootstrapped, isDbConfigured } from "./db";
import { getBookedTimesForDate, getBookedTimesForMonth } from "./store";

export async function bookedTimesForDate(date: string): Promise<Set<string>> {
  if (!isDbConfigured()) return new Set<string>();
  await ensureBootstrapped();
  return getBookedTimesForDate(date);
}

export async function bookedTimesForMonth(
  year: number,
  month: number,
): Promise<Map<string, Set<string>>> {
  if (!isDbConfigured()) return new Map<string, Set<string>>();
  await ensureBootstrapped();
  return getBookedTimesForMonth(year, month);
}
