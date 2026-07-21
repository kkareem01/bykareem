/**
 * Email template builders — every builder returns { subject, html, text }.
 * Plain, warm, short. All dynamic strings are HTML-escaped.
 */

import { formatLongDate, formatTime12h } from "./format";
import type { Booking } from "./types";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const WRAPPER_OPEN = `<!doctype html><html><body style="margin:0;padding:0;background:#f6f1e9;font-family:Georgia,serif;color:#211b15;">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;">`;
const WRAPPER_CLOSE = `<p style="font-size:12px;color:#6b6156;margin-top:32px;">bykareem photo &amp; film · Georgia</p>
</div></body></html>`;

export type EmailContent = { subject: string; html: string; text: string };

type TemplateContext = {
  booking: Booking;
  businessName: string;
  businessPhone: string;
  confirmUrl: string;
};

function whenLine(booking: Booking): string {
  return `${formatLongDate(booking.slot.date)} at ${formatTime12h(booking.slot.time)}`;
}

function firstName(booking: Booking): string {
  return booking.customer.firstName || "there";
}

export function customerConfirmationEmail(ctx: TemplateContext): EmailContent {
  const { booking, businessName, confirmUrl } = ctx;
  const when = whenLine(booking);
  const subject = `Your ${businessName} consult is booked — ${when}`;
  const html = `${WRAPPER_OPEN}
<h1 style="font-size:22px;font-weight:normal;">You're booked, ${escapeHtml(firstName(booking))}.</h1>
<p>Your free consult call is confirmed:</p>
<table style="border-collapse:collapse;margin:16px 0;">
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">When</td><td style="padding:4px 0;">${escapeHtml(when)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">How</td><td style="padding:4px 0;">I'll call you at ${escapeHtml(booking.customer.phone)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">Ref</td><td style="padding:4px 0;">${escapeHtml(booking.id)}</td></tr>
</table>
<p>No prep needed — we'll talk through what you're planning, what matters most, and you'll have an exact quote before we hang up.</p>
<p>A calendar invite is attached. Booking details: <a href="${escapeHtml(confirmUrl)}" style="color:#96603a;">${escapeHtml(confirmUrl)}</a></p>
${WRAPPER_CLOSE}`;
  const text = `You're booked, ${firstName(booking)}.

Your free consult call is confirmed:
When: ${when}
How: I'll call you at ${booking.customer.phone}
Ref: ${booking.id}

No prep needed. A calendar invite is attached.
Details: ${confirmUrl}

— ${businessName}`;
  return { subject, html, text };
}

export function ownerNotificationEmail(
  ctx: Omit<TemplateContext, "confirmUrl"> & { audienceLabel: string },
): EmailContent {
  const { booking, audienceLabel } = ctx;
  const c = booking.customer;
  const subject = `[BOOKING] ${audienceLabel} — ${c.firstName} ${c.lastName} — ${booking.slot.date} ${booking.slot.time}`;
  const answerRows = Object.entries(booking.answers)
    .filter(([, v]) => v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">${escapeHtml(k)}</td><td style="padding:4px 0;">${escapeHtml(v)}</td></tr>`,
    )
    .join("\n");
  const html = `${WRAPPER_OPEN}
<h1 style="font-size:20px;font-weight:normal;">New consult booking</h1>
<table style="border-collapse:collapse;margin:16px 0;">
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">Type</td><td style="padding:4px 0;">${escapeHtml(audienceLabel)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">Name</td><td style="padding:4px 0;">${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">Phone</td><td style="padding:4px 0;">${escapeHtml(c.phone)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">Email</td><td style="padding:4px 0;">${escapeHtml(c.email)}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">When</td><td style="padding:4px 0;">${escapeHtml(whenLine(booking))}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#6b6156;">Ref</td><td style="padding:4px 0;">${escapeHtml(booking.id)}</td></tr>
${answerRows}
</table>
${WRAPPER_CLOSE}`;
  const text = `New consult booking
Type: ${audienceLabel}
Name: ${c.firstName} ${c.lastName}
Phone: ${c.phone}
Email: ${c.email}
When: ${whenLine(booking)}
Ref: ${booking.id}
${Object.entries(booking.answers)
  .filter(([, v]) => v !== "")
  .map(([k, v]) => `${k}: ${v}`)
  .join("\n")}`;
  return { subject, html, text };
}

export function reminderT1Email(ctx: TemplateContext): EmailContent {
  const { booking, businessName, confirmUrl } = ctx;
  const when = whenLine(booking);
  const subject = `Tomorrow: your ${businessName} consult call — ${formatTime12h(booking.slot.time)}`;
  const html = `${WRAPPER_OPEN}
<h1 style="font-size:22px;font-weight:normal;">See you tomorrow, ${escapeHtml(firstName(booking))}.</h1>
<p>Quick reminder — your free consult call is <strong>${escapeHtml(when)}</strong>. I'll call you at ${escapeHtml(booking.customer.phone)}.</p>
<p>Nothing to prepare. If the time no longer works, just reply to this email.</p>
<p><a href="${escapeHtml(confirmUrl)}" style="color:#96603a;">Booking details</a></p>
${WRAPPER_CLOSE}`;
  const text = `See you tomorrow, ${firstName(booking)}.

Your free consult call is ${when}. I'll call you at ${booking.customer.phone}.
Nothing to prepare. If the time no longer works, just reply to this email.
Details: ${confirmUrl}

— ${businessName}`;
  return { subject, html, text };
}

export function reminderDayOfEmail(ctx: TemplateContext): EmailContent {
  const { booking, businessName, confirmUrl } = ctx;
  const time = formatTime12h(booking.slot.time);
  const subject = `Today at ${time}: your ${businessName} consult call`;
  const html = `${WRAPPER_OPEN}
<h1 style="font-size:22px;font-weight:normal;">Talk soon, ${escapeHtml(firstName(booking))}.</h1>
<p>Your free consult call is <strong>today at ${escapeHtml(time)}</strong>. I'll call you at ${escapeHtml(booking.customer.phone)}.</p>
<p><a href="${escapeHtml(confirmUrl)}" style="color:#96603a;">Booking details</a></p>
${WRAPPER_CLOSE}`;
  const text = `Talk soon, ${firstName(booking)}.

Your free consult call is today at ${time}. I'll call you at ${booking.customer.phone}.
Details: ${confirmUrl}

— ${businessName}`;
  return { subject, html, text };
}
