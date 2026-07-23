/**
 * Card copy + validation for the booking flow. Titles are per consult type
 * (the suit store keyed these by page; the photo site switches occasion inside
 * the card, so the title follows the selected type). Relaxed, low-pressure
 * tone to match the rest of the site.
 */

import type { ConsultType } from "@/lib/booking/types";
import type { Field } from "@/lib/booking/consult-types";

export type BookingStep = 1 | 2 | 3;

export type Customer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  consent: boolean;
};

type CardTitle = { h2: string; sub: string };

export const CARD_TITLES: Record<ConsultType, CardTitle> = {
  couples: {
    h2: "Weddings & Engagements",
    sub: "So glad you're thinking about it. Tell me a little and we'll set up a time to chat.",
  },
  graduation: {
    h2: "Book Your Grad Session",
    sub: "Pick a time and tell me about you — you're on the calendar in about two minutes.",
  },
  general: {
    h2: "Let's set up a quick chat",
    sub: "Tell me a bit about what you're picturing and we'll find a time.",
  },
};

export function sublineFor(step: BookingStep): string {
  return step === 1
    ? "Start with your info to lock in a time."
    : "A few more details and you can pick a time.";
}

/** Digits-only phone, formatted live as (XXX) XXX-XXXX while typing. */
export function maskPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length > 6)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length > 3) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return "";
}

/** Step 1 (core lead fields) — returns the first error, or null when valid. */
export function validateStep1(customer: Customer): string | null {
  if (customer.phone.replace(/\D/g, "").length < 10)
    return "Enter a valid 10-digit phone number.";
  if (!customer.firstName.trim()) return "First name is required.";
  if (!customer.lastName.trim()) return "Last name is required.";
  return null;
}

/** Step 2 (email + qualifying questions + consent) — first error or null. */
export function validateStep2(
  customer: Customer,
  answers: Record<string, string>,
  fields: Field[],
): string | null {
  const step1 = validateStep1(customer);
  if (step1) return step1;
  if (!customer.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
    return "Enter a valid email.";
  for (const f of fields) {
    if (f.required && !(answers[f.name] ?? "").trim())
      return `${f.label} is required.`;
  }
  if (!customer.consent) return "Please agree to the terms.";
  return null;
}
