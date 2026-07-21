/**
 * Resend transport with a dry-run mode for local dev.
 * DRY_RUN_EMAIL=1 (or "true") writes the rendered email to tmp/ instead of
 * calling the API — tests and local booking flows never send real mail.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { log } from "./log";

export type EmailAttachment = {
  filename: string;
  content: string; // base64
  contentType?: string;
};

export type SendEmailInput = {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

export type SendEmailResult =
  | { ok: true; id: string; dryRun?: boolean }
  | { ok: false; error: string };

function isDryRun(): boolean {
  const v = process.env.DRY_RUN_EMAIL;
  return v === "1" || v === "true";
}

function writeDryRunFile(input: SendEmailInput): string {
  const dir = resolve(process.cwd(), "tmp");
  mkdirSync(dir, { recursive: true });
  const banner = `<!-- DRY RUN
To: ${input.to}
From: ${input.from}
Subject: ${input.subject}
Attachments: ${(input.attachments ?? []).map((a) => a.filename).join(", ") || "none"}
-->\n`;
  const body = banner + input.html;
  const stamped = resolve(dir, `email-${Date.now()}.html`);
  writeFileSync(stamped, body);
  writeFileSync(resolve(dir, "last-email.html"), body);
  return stamped;
}

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  if (isDryRun()) {
    const file = writeDryRunFile(input);
    log.info(`DRY_RUN_EMAIL → ${file}`, { subject: input.subject });
    return { ok: true, id: `dry-${Date.now()}`, dryRun: true };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY missing." };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        ...(input.attachments && input.attachments.length > 0
          ? {
              attachments: input.attachments.map((a) => ({
                filename: a.filename,
                content: a.content,
                content_type: a.contentType ?? "application/octet-stream",
              })),
            }
          : {}),
      }),
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 200);
      return { ok: false, error: `Resend ${res.status}: ${detail}` };
    }
    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id ?? "unknown" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log.error("sendEmail transport failure", msg);
    return { ok: false, error: `Email transport error: ${msg}` };
  }
}
