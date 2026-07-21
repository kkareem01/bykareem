/** Minimal structured logger — server-side detail, nothing leaks to clients. */

function line(level: string, msg: string, extra?: unknown) {
  const ts = new Date().toISOString();
  if (extra !== undefined) {
    console[level === "error" ? "error" : "log"](`[${ts}] ${level} ${msg}`, extra);
  } else {
    console[level === "error" ? "error" : "log"](`[${ts}] ${level} ${msg}`);
  }
}

export const log = {
  info: (msg: string, extra?: unknown) => line("info", msg, extra),
  warn: (msg: string, extra?: unknown) => line("warn", msg, extra),
  error: (msg: string, extra?: unknown) => line("error", msg, extra),
};
