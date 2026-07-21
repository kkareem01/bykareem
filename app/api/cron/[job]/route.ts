import { NextRequest, NextResponse } from "next/server";
import { runReminders, type ReminderKind } from "@/lib/booking/cron";
import { ensureBootstrapped } from "@/lib/booking/db";
import { verifyBearer } from "@/lib/booking/http";
import { log } from "@/lib/booking/log";

const JOBS: Record<string, ReminderKind> = {
  "reminders-t1": "t1",
  "reminders-dayof": "dayof",
};

/**
 * GET /api/cron/[job] — Vercel Cron entrypoint.
 * Auth: Bearer CRON_SECRET (Vercel includes it automatically).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ job: string }> },
) {
  if (!verifyBearer(request.headers, "CRON_SECRET")) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { job } = await params;
  const kind = JOBS[job];
  if (!kind) {
    return NextResponse.json(
      { ok: false, error: "UNKNOWN_JOB", job },
      { status: 404 },
    );
  }

  try {
    await ensureBootstrapped();
    const result = await runReminders(kind);
    return NextResponse.json({ ok: true, job, result });
  } catch (e) {
    log.error(`cron ${job} crashed`, e);
    const msg = e instanceof Error ? e.message : "CRASH";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
