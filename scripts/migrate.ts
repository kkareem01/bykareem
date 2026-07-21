/**
 * Manual migration runner: `npm run migrate`.
 * Reads TURSO_DATABASE_URL / TURSO_AUTH_TOKEN from .env.local (or the
 * environment) — same idempotent migration the app self-runs on boot.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { migrate } from "../lib/booking/migrate";

function loadEnvLocal(): void {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].trim();
      }
    }
  } catch {
    // no .env.local — rely on the ambient environment
  }
}

async function main(): Promise<void> {
  loadEnvLocal();
  if (!process.env.TURSO_DATABASE_URL) {
    process.env.TURSO_DATABASE_URL = "file:local.db";
  }
  await migrate();
  console.log(`Migration complete → ${process.env.TURSO_DATABASE_URL}`);
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
