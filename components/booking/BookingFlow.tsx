"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getBookingCopy } from "@/content/copy";
import { bookingConfig } from "@/content/booking-config";
import { CONSULT_TYPES, FIELD_SCHEMAS } from "@/lib/booking/consult-types";
import type { ConsultType } from "@/lib/booking/types";
import { formatLongDate, formatTime12h } from "@/lib/booking/format";
import { Button } from "@/components/ui/Button";
import { Calendar, type MonthDay } from "./Calendar";
import { DetailsFields } from "./DetailsFields";
import { getStoredAttribution } from "./attribution";

type Step = "date" | "details";

type MonthState = { year: number; month: number };

function currentMonth(): MonthState {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function nextMonth(m: MonthState): MonthState {
  return m.month === 12
    ? { year: m.year + 1, month: 1 }
    : { year: m.year, month: m.month + 1 };
}

function monthIndex(m: MonthState): number {
  return m.year * 12 + m.month;
}

const MAX_MONTHS_AHEAD = Math.ceil(bookingConfig.maxAdvanceDays / 30);

export function BookingFlow({
  initialType,
  lockType = false,
}: {
  initialType: ConsultType;
  /** true when the page arrived with a preset type — hides the type picker */
  lockType?: boolean;
}) {
  const router = useRouter();
  const [audience, setAudience] = useState<ConsultType>(initialType);
  const [step, setStep] = useState<Step>("date");

  const [cursor, setCursor] = useState<MonthState>(currentMonth);
  const [days, setDays] = useState<MonthDay[]>([]);
  const [monthLoading, setMonthLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    consent: false,
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const formStartedAt = useRef(0);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [slotTaken, setSlotTaken] = useState(false);

  // Bumped to refetch the month after a SLOT_TAKEN conflict.
  const [monthRefresh, setMonthRefresh] = useState(0);

  const loadSlots = useCallback(
    async (date: string) => {
      setSlotsLoading(true);
      setSelectedTime(null);
      try {
        const res = await fetch(
          `/api/availability?date=${date}&audience=${audience}`,
        );
        const json = await res.json();
        setSlots(json.ok ? json.data.slots : []);
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    },
    [audience],
  );

  useEffect(() => {
    let cancelled = false;
    fetch(
      `/api/availability/month?year=${cursor.year}&month=${cursor.month}&audience=${audience}`,
    )
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        setDays(json.ok ? json.data.days : []);
        setMonthLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setDays([]);
        setMonthLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cursor, audience, monthRefresh]);

  const pickType = (t: ConsultType) => {
    setAudience(t);
    setSelectedDate(null);
    setSelectedTime(null);
    setAnswers({});
    setMonthLoading(true);
    setStep("date");
  };

  const moveCursor = (next: MonthState) => {
    setMonthLoading(true);
    setCursor(next);
  };

  const pickDate = (date: string) => {
    setSelectedDate(date);
    setSlotTaken(false);
    void loadSlots(date);
  };

  const submit = async () => {
    if (!selectedDate || !selectedTime || submitting) return;
    setSubmitting(true);
    setErrors([]);
    setSlotTaken(false);

    const attribution = getStoredAttribution();
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          customer: { ...customer, consent: customer.consent as true },
          slot: { date: selectedDate, time: selectedTime },
          timezone:
            Intl.DateTimeFormat().resolvedOptions().timeZone ??
            "America/New_York",
          answers,
          honeypot,
          formStartedAt: formStartedAt.current,
          ...(attribution ? { attribution } : {}),
        }),
      });
      const json = await res.json();

      if (json.ok) {
        router.push(`/book/confirmed?id=${json.data.id}`);
        return;
      }
      if (json.code === "SLOT_TAKEN") {
        setSlotTaken(true);
        setStep("date");
        if (selectedDate) void loadSlots(selectedDate);
        setMonthLoading(true);
        setMonthRefresh((k) => k + 1);
      } else {
        setErrors([json.error ?? "Something went wrong. Please try again."]);
      }
    } catch {
      setErrors(["Network error. Please check your connection and try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  const openSlots = slots.filter((s) => s.available);
  const fields = FIELD_SCHEMAS[audience];
  const detailsValid =
    customer.firstName.trim() &&
    customer.lastName.trim() &&
    customer.phone.trim() &&
    customer.email.trim() &&
    customer.consent &&
    fields.every((f) => !f.required || (answers[f.name] ?? "").trim() !== "");

  const inputCls =
    "w-full rounded-xl border border-line bg-porcelain px-4 py-3 text-sm text-hunter placeholder:text-moss/50 focus:outline-none focus:border-gold";

  const copy = getBookingCopy(audience);

  return (
    <div className="max-w-xl mx-auto">
      {/* step 1: consult type — hidden when the page arrived pre-picked */}
      {lockType ? (
        <p className="mb-10 text-sm text-moss">
          Booking something else?{" "}
          <a href="/book" className="text-gold hover:text-gold-deep">
            See all options →
          </a>
        </p>
      ) : (
        <>
          <p className="eyebrow eyebrow--gold mb-3">{copy.steps.type}</p>
          <div className="flex flex-wrap gap-2 mb-10">
            {CONSULT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => pickType(t)}
                aria-pressed={audience === t}
                className={`px-4 py-2.5 rounded-full text-sm border transition-colors ${
                  audience === t
                    ? "bg-gold text-porcelain border-gold"
                    : "border-line text-hunter hover:border-gold"
                }`}
              >
                {bookingConfig.consultTypes[t]?.label ?? t}
              </button>
            ))}
          </div>
        </>
      )}

      {slotTaken ? (
        <p className="mb-6 rounded-xl bg-mist border border-line px-4 py-3 text-sm">
          {copy.slotTaken}
        </p>
      ) : null}

      {step === "date" ? (
        <>
          {/* step 2: date */}
          <p className="eyebrow eyebrow--gold mb-3">{copy.steps.date}</p>
          <Calendar
            year={cursor.year}
            month={cursor.month}
            days={days}
            selectedDate={selectedDate}
            loading={monthLoading}
            canGoPrev={monthIndex(cursor) > monthIndex(currentMonth())}
            canGoNext={
              monthIndex(cursor) <
              monthIndex(currentMonth()) + MAX_MONTHS_AHEAD
            }
            onSelect={pickDate}
            onPrev={() =>
              moveCursor(
                cursor.month === 1
                  ? { year: cursor.year - 1, month: 12 }
                  : { year: cursor.year, month: cursor.month - 1 },
              )
            }
            onNext={() => moveCursor(nextMonth(cursor))}
          />

          {/* step 3: time */}
          {selectedDate ? (
            <div className="mt-10">
              <p className="eyebrow eyebrow--gold mb-1">
                {copy.steps.time}
              </p>
              <p className="text-sm text-moss mb-4">
                {formatLongDate(selectedDate)} · times shown in{" "}
                {bookingConfig.timezone.replace("America/", "").replace("_", " ")}{" "}
                time
              </p>
              {slotsLoading ? (
                <p className="text-sm text-moss">Loading times…</p>
              ) : openSlots.length === 0 ? (
                <p className="text-sm text-moss">
                  No times left on this day — pick another date.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {openSlots.map((s) => (
                    <button
                      key={s.time}
                      type="button"
                      onClick={() => setSelectedTime(s.time)}
                      aria-pressed={selectedTime === s.time}
                      className={`px-4 py-2.5 rounded-full text-sm border transition-colors ${
                        selectedTime === s.time
                          ? "bg-gold text-porcelain border-gold"
                          : "border-line text-hunter hover:border-gold"
                      }`}
                    >
                      {formatTime12h(s.time)}
                    </button>
                  ))}
                </div>
              )}
              {selectedTime ? (
                <div className="mt-8">
                  <Button onClick={() => setStep("details")} size="lg">
                    Continue →
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="space-y-5"
        >
          {/* step 4: details */}
          <div className="flex items-baseline justify-between">
            <p className="eyebrow eyebrow--gold">{copy.steps.details}</p>
            <button
              type="button"
              onClick={() => setStep("date")}
              className="text-sm text-gold hover:text-gold-deep"
            >
              ← Change time
            </button>
          </div>

          <p className="rounded-xl bg-mist border border-line px-4 py-3 text-sm">
            {selectedDate && selectedTime
              ? `${formatLongDate(selectedDate)} at ${formatTime12h(selectedTime)}`
              : null}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">
                First name <span className="text-gold">*</span>
              </span>
              <input
                className={`${inputCls} mt-1.5`}
                value={customer.firstName}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, firstName: e.target.value }))
                }
                required
                maxLength={60}
                autoComplete="given-name"
              />
            </label>
            <label className="block">
              <span className="text-sm">
                Last name <span className="text-gold">*</span>
              </span>
              <input
                className={`${inputCls} mt-1.5`}
                value={customer.lastName}
                onChange={(e) =>
                  setCustomer((c) => ({ ...c, lastName: e.target.value }))
                }
                required
                maxLength={60}
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm">
              Phone <span className="text-gold">*</span>
            </span>
            <input
              className={`${inputCls} mt-1.5`}
              type="tel"
              value={customer.phone}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, phone: e.target.value }))
              }
              required
              autoComplete="tel"
              placeholder="(404) 555-1234"
            />
          </label>

          <label className="block">
            <span className="text-sm">
              Email <span className="text-gold">*</span>
            </span>
            <input
              className={`${inputCls} mt-1.5`}
              type="email"
              value={customer.email}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, email: e.target.value }))
              }
              required
              autoComplete="email"
            />
          </label>

          <DetailsFields
            fields={fields}
            answers={answers}
            onChange={(name, value) =>
              setAnswers((a) => ({ ...a, [name]: value }))
            }
          />

          {/* honeypot — hidden from humans, tempting to bots */}
          <div className="hidden" aria-hidden="true">
            <label>
              Company website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
          </div>

          <label className="flex items-start gap-3 text-sm text-moss">
            <input
              type="checkbox"
              checked={customer.consent}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, consent: e.target.checked }))
              }
              required
              className="mt-0.5 accent-[#b8912e]"
            />
            <span>
              I agree to be contacted about my booking by phone and email.{" "}
              <span className="text-gold">*</span>
            </span>
          </label>

          {errors.length > 0 ? (
            <div className="rounded-xl border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold-deep">
              {errors.map((e) => (
                <p key={e}>{e}</p>
              ))}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!detailsValid || submitting}
          >
            {submitting ? "Booking…" : copy.steps.confirm}
          </Button>
          <p className="text-xs text-moss text-center">
            {copy.confirmNote}
          </p>
        </form>
      )}
    </div>
  );
}
