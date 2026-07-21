/**
 * Booking payload validation (ported from the suit store's lib/validate.mjs,
 * consult-type flavored). Fail fast, friendly messages, never trust input.
 */

import { FIELD_SCHEMAS, isValidConsultType, type Field } from "./consult-types";
import type { Attribution, Validated } from "./types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ok<T>(value: T): Validated<T> {
  return { ok: true, value };
}
function bad(...errors: string[]): { ok: false; errors: string[] } {
  return { ok: false, errors };
}

export function validatePhone(input: unknown): Validated<string> {
  if (typeof input !== "string") return bad("Phone is required.");
  const digits = input.replace(/\D/g, "");
  let ten = digits;
  if (digits.length === 11 && digits.startsWith("1")) ten = digits.slice(1);
  if (ten.length !== 10) return bad("Enter a valid US phone number.");
  return ok(`(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6)}`);
}

export function validateEmail(input: unknown): Validated<string> {
  if (typeof input !== "string") return bad("Email is required.");
  const trimmed = input.trim();
  if (trimmed.length === 0) return bad("Email is required.");
  if (trimmed.length > 254) return bad("Email is too long.");
  if (!EMAIL_RE.test(trimmed)) return bad("Enter a valid email.");
  return ok(trimmed.toLowerCase());
}

export function validateName(input: unknown, label = "Name"): Validated<string> {
  if (typeof input !== "string") return bad(`${label} is required.`);
  const trimmed = input.trim();
  if (trimmed.length === 0) return bad(`${label} is required.`);
  if (trimmed.length > 60) return bad(`${label} is too long.`);
  return ok(trimmed);
}

export function validateDateString(
  input: unknown,
  label = "Date",
): Validated<string> {
  if (typeof input !== "string" || !DATE_RE.test(input)) {
    return bad(`${label} must be in YYYY-MM-DD format.`);
  }
  const [y, m, d] = input.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return bad(`${label} is not a real date.`);
  }
  return ok(input);
}

export function validateTimeString(input: unknown): Validated<string> {
  if (typeof input !== "string" || !TIME_RE.test(input)) {
    return bad("Time must be in HH:MM format.");
  }
  const [h, m] = input.split(":").map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return bad("Time is out of range.");
  return ok(input);
}

const CLICK_ID_RE = /^[A-Za-z0-9_.\-]{1,200}$/;
const UTM_KEYS = ["source", "medium", "campaign", "term", "content"] as const;

/**
 * Normalize the optional `attribution` object sent with booking POSTs.
 * Best-effort marketing metadata — anything malformed is silently dropped so
 * it can never block a booking.
 */
export function validateAttribution(raw: unknown): Attribution | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;

  const clickId = (v: unknown) =>
    typeof v === "string" && CLICK_ID_RE.test(v.trim()) ? v.trim() : null;
  const cleanText = (v: unknown, max: number) => {
    if (typeof v !== "string") return null;
    const s = v
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim()
      .slice(0, max);
    return s.length > 0 ? s : null;
  };

  const gclid = clickId(obj.gclid);
  const gbraid = clickId(obj.gbraid);
  const wbraid = clickId(obj.wbraid);

  let utmJson: string | null = null;
  if (obj.utm && typeof obj.utm === "object" && !Array.isArray(obj.utm)) {
    const utmRaw = obj.utm as Record<string, unknown>;
    const utm: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = cleanText(utmRaw[key], 200);
      if (v) utm[key] = v;
    }
    if (Object.keys(utm).length > 0) utmJson = JSON.stringify(utm);
  }

  const landingPage = cleanText(obj.landingPage, 500);
  const referrer = cleanText(obj.referrer, 500);

  if (!gclid && !gbraid && !wbraid && !utmJson && !landingPage && !referrer) {
    return null;
  }
  return { gclid, gbraid, wbraid, utmJson, landingPage, referrer };
}

function validateField(field: Field, raw: unknown): Validated<string> {
  const isEmpty =
    raw === undefined ||
    raw === null ||
    (typeof raw === "string" && raw.trim() === "");
  if (isEmpty) {
    if (field.required) return bad(`${field.label} is required.`);
    return ok("");
  }

  if (field.type === "date") return validateDateString(raw, field.label);

  if (field.type === "select") {
    if (typeof raw !== "string" || !field.options?.includes(raw)) {
      return bad(`${field.label}: invalid choice.`);
    }
    return ok(raw);
  }

  if (typeof raw !== "string") return bad(`${field.label}: invalid value.`);
  const trimmed = raw.trim();
  if (field.maxLength && trimmed.length > field.maxLength) {
    return bad(`${field.label} is too long (max ${field.maxLength}).`);
  }
  return ok(trimmed);
}

export type BookingPayload = {
  audience: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    consent: true;
  };
  slot: { date: string; time: string };
  timezone: string;
  answers: Record<string, string>;
};

/** Validate a full POST /api/bookings body. value is normalized. */
export function validateBookingPayload(
  body: unknown,
  nowMs: number = Date.now(),
): Validated<BookingPayload> {
  if (!body || typeof body !== "object") return bad("Invalid request body.");
  const b = body as Record<string, unknown>;
  const customer = (b.customer ?? {}) as Record<string, unknown>;
  const slot = (b.slot ?? null) as Record<string, unknown> | null;

  const errors: string[] = [];

  if (!isValidConsultType(b.audience)) errors.push("Unknown consult type.");

  const fn = validateName(customer.firstName, "First name");
  if (!fn.ok) errors.push(...fn.errors);
  const ln = validateName(customer.lastName, "Last name");
  if (!ln.ok) errors.push(...ln.errors);
  const ph = validatePhone(customer.phone);
  if (!ph.ok) errors.push(...ph.errors);
  const em = validateEmail(customer.email);
  if (!em.ok) errors.push(...em.errors);
  if (customer.consent !== true) errors.push("You must agree to be contacted.");

  let slotOut = { date: "", time: "" };
  if (!slot || typeof slot !== "object") {
    errors.push("Slot is required.");
  } else {
    const sd = validateDateString(slot.date, "Slot date");
    const st = validateTimeString(slot.time);
    if (!sd.ok) errors.push(...sd.errors);
    if (!st.ok) errors.push(...st.errors);
    slotOut = {
      date: sd.ok ? sd.value : "",
      time: st.ok ? st.value : "",
    };
  }

  const timezone =
    typeof b.timezone === "string" &&
    b.timezone.length > 0 &&
    b.timezone.length < 64
      ? b.timezone
      : "America/New_York";

  const answers: Record<string, string> = {};
  if (isValidConsultType(b.audience)) {
    const schema = FIELD_SCHEMAS[b.audience];
    const rawAnswers = (b.answers ?? {}) as Record<string, unknown>;
    for (const field of schema) {
      const r = validateField(field, rawAnswers[field.name]);
      if (!r.ok) errors.push(...r.errors);
      else answers[field.name] = r.value;
    }
  }

  // Spam guards: hidden honeypot field + minimum time-on-form.
  if (typeof b.honeypot === "string" && b.honeypot.length > 0) {
    errors.push("Submission rejected.");
  }
  if (typeof b.formStartedAt === "number" && nowMs - b.formStartedAt < 4000) {
    errors.push("Submission rejected: please take a moment to review.");
  }

  if (errors.length > 0) return { ok: false, errors };

  return ok({
    audience: b.audience as string,
    customer: {
      firstName: (fn as { value: string }).value,
      lastName: (ln as { value: string }).value,
      phone: (ph as { value: string }).value,
      email: (em as { value: string }).value,
      consent: true,
    },
    slot: slotOut,
    timezone,
    answers,
  });
}
