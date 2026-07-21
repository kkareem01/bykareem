/**
 * Twilio SMS transport with a dry-run mode.
 * DRY_RUN_SMS=1 (or "true") writes the message to tmp/ instead of sending.
 * Used only for owner alerts — customers get email, never SMS.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { log } from "./log";

export type SendSmsResult =
  | { ok: true; sid: string; dryRun?: boolean }
  | { ok: false; error: string; skipped?: boolean };

/** Normalize a US-ish phone number to E.164, or null. */
export function toE164(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) {
    if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
    return null;
  }
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

function isDryRun(): boolean {
  const v = process.env.DRY_RUN_SMS;
  return v === "1" || v === "true";
}

export async function sendSms(input: {
  to: string;
  body: string;
}): Promise<SendSmsResult> {
  const to = toE164(input.to);
  if (!to) return { ok: false, error: `Invalid phone number: ${input.to}` };
  if (input.body.trim().length === 0) {
    return { ok: false, error: "SMS body is empty." };
  }

  if (isDryRun()) {
    const dir = resolve(process.cwd(), "tmp");
    mkdirSync(dir, { recursive: true });
    const content = `To: ${to}\nLength: ${input.body.length}\n---\n${input.body}\n`;
    const stamp = Date.now();
    writeFileSync(resolve(dir, `sms-${stamp}.txt`), content);
    writeFileSync(resolve(dir, "last-sms.txt"), content);
    log.info(`DRY_RUN_SMS → tmp/last-sms.txt`, { to });
    return { ok: true, sid: `dry-${stamp}`, dryRun: true };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from) {
    return { ok: false, error: "TWILIO_* env vars missing." };
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: input.body }),
      },
    );
    if (!res.ok) {
      const detail = (await res.text()).slice(0, 200);
      return { ok: false, error: `Twilio ${res.status}: ${detail}` };
    }
    const json = (await res.json()) as { sid?: string };
    return { ok: true, sid: json.sid ?? "unknown" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log.error("sendSms transport failure", msg);
    return { ok: false, error: `SMS transport error: ${msg}` };
  }
}
