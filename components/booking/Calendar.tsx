"use client";

import { monthLabel } from "@/lib/booking/format";
import { buildTzList, formatTzLabel } from "@/lib/booking/tz";

export type MonthDay = { date: string; hasOpenSlots: boolean };

type CalendarProps = {
  year: number;
  month: number;
  days: MonthDay[];
  selectedDate: string | null;
  /** true at steps 1-2: calendar shown but greyed with a "fill the form" pill */
  locked: boolean;
  canPrev: boolean;
  canNext: boolean;
  timezone: string;
  onSelect: (date: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onTimezoneChange: (tz: string) => void;
};

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function dayOfWeekUtc(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Month grid + timezone selector, styled as the suit store navy calendar. */
export function Calendar({
  year,
  month,
  days,
  selectedDate,
  locked,
  canPrev,
  canNext,
  timezone,
  onSelect,
  onPrev,
  onNext,
  onTimezoneChange,
}: CalendarProps) {
  const leadingBlanks = days.length > 0 ? dayOfWeekUtc(days[0].date) : 0;
  const today = todayISO();

  return (
    <div className={`booking-calendar ${locked ? "is-locked" : ""}`}>
      {locked ? (
        <div className="booking-calendar__lock">
          <div className="booking-calendar__lock-pill">
            Please fill out the form before choosing your time slot.
          </div>
        </div>
      ) : (
        <div className="booking-calendar__tz">
          <span>Time zone:</span>
          <select
            aria-label="Time zone"
            value={timezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
          >
            {buildTzList(timezone).map((tz) => (
              <option key={tz} value={tz}>
                {formatTzLabel(tz, new Date())}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="booking-calendar__header">
        <div className="booking-calendar__month">{monthLabel(year, month)}</div>
        <div className="booking-calendar__nav">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="booking-calendar__weekdays">
        {WEEKDAYS.map((w) => (
          <div className="booking-calendar__weekday" key={w}>
            {w}
          </div>
        ))}
      </div>
      <div className="booking-calendar__grid">
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div
            className="booking-calendar__day booking-calendar__day--blank"
            key={`blank-${i}`}
          />
        ))}
        {days.map((day) => {
          const num = Number(day.date.slice(-2));
          const past = day.date < today;
          const open = day.hasOpenSlots && !past;
          const selected = day.date === selectedDate;
          let cls = "booking-calendar__day";
          if (past) cls += " booking-calendar__day--past";
          else if (!day.hasOpenSlots) cls += " booking-calendar__day--closed";
          else cls += " booking-calendar__day--open";
          if (selected) cls += " booking-calendar__day--selected";
          return (
            <button
              type="button"
              key={day.date}
              className={cls}
              disabled={!open}
              aria-pressed={selected}
              onClick={open ? () => onSelect(day.date) : undefined}
            >
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
