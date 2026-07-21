/**
 * libSQL/Turso client singleton.
 * - Production (Vercel): TURSO_DATABASE_URL=libsql://... + TURSO_AUTH_TOKEN
 * - Local dev: TURSO_DATABASE_URL=file:local.db (no auth token needed)
 *
 * ensureBootstrapped() runs the idempotent migration on the first call per
 * warm container so a fresh DB self-heals without manual scripts.
 */

import { createClient, type Client } from "@libsql/client";
import { migrate } from "./migrate";

let client: Client | null = null;
let bootstrapPromise: Promise<void> | null = null;

export function getDb(): Client {
  if (client && !client.closed) return client;

  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      'TURSO_DATABASE_URL is not set. Use "file:local.db" for local dev or "libsql://...turso.io" for production.',
    );
  }

  const authToken = process.env.TURSO_AUTH_TOKEN;
  client = createClient({
    url,
    ...(authToken ? { authToken } : {}),
  });
  return client;
}

export async function ensureBootstrapped(): Promise<void> {
  if (!bootstrapPromise) {
    bootstrapPromise = migrate().catch((e) => {
      bootstrapPromise = null;
      throw e;
    });
  }
  await bootstrapPromise;
}

/** Test helper — closes the handle so the next getDb() reopens fresh. */
export function resetDbForTests(): void {
  if (client && !client.closed) client.close();
  client = null;
  bootstrapPromise = null;
}
