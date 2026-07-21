"use client";

import { monthLabel } from "@/lib/booking/format";

export type MonthDay = { date: string; hasOpenSlots: boolean };

type CalendarProps = {
  year: number;
  month: number;
  days: MonthDay[];
  selectedDate: string | null;
  loading: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  onSelect: (date: string) => void;
  onPrev: () => void;
  onNext: () => void;
};

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function dayOfWeekUtc(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function Calendar({
  year,
  month,
  days,
  selectedDate,
  loading,
  canGoPrev,
  canGoNext,
  onSelect,
  onPrev,
  onNext,
}: CalendarProps) {
  const leadingBlanks = days.length > 0 ? dayOfWeekUtc(days[0].date) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="w-9 h-9 rounded-full border border-line text-hunter disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
        >
          ←
        </button>
        <p className="font-display text-lg">{monthLabel(year, month)}</p>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Next month"
          className="w-9 h-9 rounded-full border border-line text-hunter disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d, i) => (
          <p key={`${d}-${i}`} className="eyebrow py-2">
            {d}
          </p>
        ))}
        {Array.from({ length: leadingBlanks }, (_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const num = Number(day.date.slice(-2));
          const selected = day.date === selectedDate;
          return (
            <button
              key={day.date}
              type="button"
              disabled={!day.hasOpenSlots || loading}
              onClick={() => onSelect(day.date)}
              aria-pressed={selected}
              className={`aspect-square rounded-full text-sm transition-colors ${
                selected
                  ? "bg-gold text-porcelain"
                  : day.hasOpenSlots
                    ? "text-hunter hover:bg-mist"
                    : "text-moss/30 cursor-default"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
      {loading ? (
        <p className="mt-3 text-center text-xs text-moss">Loading…</p>
      ) : null}
    </div>
  );
}
