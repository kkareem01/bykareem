"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { bookingConfig } from "@/content/booking-config";
import { FIELD_SCHEMAS } from "@/lib/booking/consult-types";
import type { ConsultType } from "@/lib/booking/types";
import { browserTimezone } from "@/lib/booking/tz";
import { getStoredAttribution } from "./attribution";
import { bookingCardCss } from "./booking-card-css";
import { StepPill } from "./StepPill";
import { BookingForm } from "./BookingForm";
import { Calendar, type MonthDay } from "./Calendar";
import { Slots, type Slot, type TimeFormat } from "./Slots";
import {
  validateStep1,
  validateStep2,
  type BookingStep,
  type Customer,
} from "./booking-titles";

type MonthState = { year: number; month: number };

function currentMonth(): MonthState {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
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
  lockType?: boolean;
}) {
  const router = useRouter();

  const [audience, setAudience] = useState<ConsultType>(initialType);
  const [step, setStep] = useState<BookingStep>(1);

  const [cursor, setCursor] = useState<MonthState>(currentMonth);
  const [days, setDays] = useState<MonthDay[]>([]);
  const [monthLoading, setMonthLoading] = useState(true);
  const [monthRefresh, setMonthRefresh] = useState(0);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12h");
  const [userTz, setUserTz] = useState<string>(bookingConfig.timezone);

  const [customer, setCustomer] = useState<Customer>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    consent: false,
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const formStartedAt = useRef(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields = FIELD_SCHEMAS[audience];

  useEffect(() => {
    formStartedAt.current = Date.now();
    setUserTz(browserTimezone());
  }, []);

  // Load the month grid whenever the cursor, occasion, or a conflict changes.
  useEffect(() => {
    let cancelled = false;
    setMonthLoading(true);
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

  // Two-way sync between step 1 and step 2, keyed off the three core fields:
  //   step 1 + core valid   → reveal step 2
  //   step 2 + core invalid → fold back to step 1
  // (React keeps focus on the live input across these re-renders.)
  useEffect(() => {
    const coreValid = validateStep1(customer) === null;
    if (step === 1 && coreValid) setStep(2);
    else if (step === 2 && !coreValid) setStep(1);
  }, [customer.phone, customer.firstName, customer.lastName, step]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const pickType = (t: ConsultType) => {
    if (t === audience) return;
    setAudience(t);
    setAnswers({});
    setSelectedDate(null);
    setSelectedTime(null);
    setError(null);
    setStep(1);
  };

  const moveCursor = (next: MonthState) => setCursor(next);

  const pickDate = (date: string) => {
    setSelectedDate(date);
    setError(null);
    void loadSlots(date);
  };

  const handleSubmitStep = () => {
    if (step === 1) {
      const err = validateStep1(customer);
      if (err) return setError(err);
      setError(null);
      setStep(2);
      return;
    }
    if (step === 2) {
      const err = validateStep2(customer, answers, fields);
      if (err) return setError(err);
      setError(null);
      setStep(3);
    }
  };

  const confirmBooking = async () => {
    if (!selectedDate || !selectedTime || submitting) return;
    if (honeypot) return; // silent bot reject
    setSubmitting(true);
    setError(null);

    const attribution = getStoredAttribution();
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          customer: { ...customer, consent: customer.consent as true },
          slot: { date: selectedDate, time: selectedTime },
          timezone: userTz,
          answers,
          honeypot,
          formStartedAt: formStartedAt.current,
          ...(attribution ? { attribution } : {}),
        }),
      });
      const json = await res.json().catch(() => ({}));

      if (json.ok) {
        router.push(`/book/confirmed?id=${json.data.id}`);
        return;
      }
      if (res.status === 409 || json.code === "SLOT_TAKEN") {
        setSelectedTime(null);
        await loadSlots(selectedDate);
        setMonthRefresh((k) => k + 1);
        setError("That time was just taken. Please pick another.");
      } else {
        setError(json.error ?? "Could not confirm. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const showCalendar = step !== 2;

  return (
    <div className="booking-section">
      <style dangerouslySetInnerHTML={{ __html: bookingCardCss }} />
      <div className="booking-card" data-step={step}>
        <StepPill step={step} />
        <div className="booking-card__body">
          <div className="booking-pane" data-region="form">
            <BookingForm
              audience={audience}
              step={step}
              lockType={lockType}
              customer={customer}
              answers={answers}
              fields={fields}
              honeypot={honeypot}
              error={error}
              onPickType={pickType}
              onCustomerChange={(patch) =>
                setCustomer((c) => ({ ...c, ...patch }))
              }
              onAnswerChange={(name, value) =>
                setAnswers((a) => ({ ...a, [name]: value }))
              }
              onHoneypotChange={setHoneypot}
              onSubmitStep={handleSubmitStep}
            />
          </div>

          {showCalendar ? (
            <div className="booking-pane" data-region="calendar-pane">
              <Calendar
                year={cursor.year}
                month={cursor.month}
                days={days}
                selectedDate={selectedDate}
                locked={step !== 3}
                canPrev={monthIndex(cursor) > monthIndex(currentMonth())}
                canNext={
                  monthIndex(cursor) <
                  monthIndex(currentMonth()) + MAX_MONTHS_AHEAD
                }
                timezone={userTz}
                onSelect={pickDate}
                onPrev={() =>
                  moveCursor(
                    cursor.month === 1
                      ? { year: cursor.year - 1, month: 12 }
                      : { year: cursor.year, month: cursor.month - 1 },
                  )
                }
                onNext={() =>
                  moveCursor(
                    cursor.month === 12
                      ? { year: cursor.year + 1, month: 1 }
                      : { year: cursor.year, month: cursor.month + 1 },
                  )
                }
                onTimezoneChange={setUserTz}
              />
              {step === 3 ? (
                <Slots
                  selectedDate={selectedDate}
                  slots={slots}
                  loading={slotsLoading}
                  timeFormat={timeFormat}
                  storeTimezone={bookingConfig.timezone}
                  userTimezone={userTz}
                  selectedTime={selectedTime}
                  submitting={submitting}
                  onToggleFormat={setTimeFormat}
                  onSelectTime={setSelectedTime}
                  onConfirm={confirmBooking}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
