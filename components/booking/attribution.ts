/**
 * Client-side marketing attribution: captured once per session on first
 * page view, read at booking time. Best-effort — failures never block UX.
 */

const KEY = "bk-attribution";

export type StoredAttribution = {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utm?: Record<string, string>;
  landingPage?: string;
  referrer?: string;
};

const UTM_KEYS = ["source", "medium", "campaign", "term", "content"] as const;

export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY)) return; // first touch wins

    const params = new URLSearchParams(window.location.search);
    const out: StoredAttribution = {
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer || undefined,
    };

    for (const id of ["gclid", "gbraid", "wbraid"] as const) {
      const v = params.get(id);
      if (v) out[id] = v;
    }

    const utm: Record<string, string> = {};
    for (const k of UTM_KEYS) {
      const v = params.get(`utm_${k}`);
      if (v) utm[k] = v;
    }
    if (Object.keys(utm).length > 0) out.utm = utm;

    sessionStorage.setItem(KEY, JSON.stringify(out));
  } catch {
    // storage unavailable (private mode etc.) — attribution is optional
  }
}

export function getStoredAttribution(): StoredAttribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredAttribution) : null;
  } catch {
    return null;
  }
}
