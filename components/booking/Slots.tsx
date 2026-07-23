"use client";

import { formatTime12h } from "@/lib/booking/format";
import { convertSlotToUserTz, formatDateShort } from "@/lib/booking/tz";

export type Slot = { time: string; available: boolean };
export type TimeFormat = "12h" | "24h";

type SlotsProps = {
  selectedDate: string | null;
  slots: Slot[];
  loading: boolean;
  timeFormat: TimeFormat;
  storeTimezone: string;
  userTimezone: string;
  selectedTime: string | null;
  submitting: boolean;
  onToggleFormat: (fmt: TimeFormat) => void;
  onSelectTime: (time: string) => void;
  onConfirm: () => void;
};

/** Slot list + 12h/24h toggle + confirm bar (suit store step 3). */
export function Slots({
  selectedDate,
  slots,
  loading,
  timeFormat,
  storeTimezone,
  userTimezone,
  selectedTime,
  submitting,
  onToggleFormat,
  onSelectTime,
  onConfirm,
}: SlotsProps) {
  if (!selectedDate) {
    return (
      <div className="booking-slots">
        <div className="booking-slots__empty">
          Pick a date to see available times.
        </div>
      </div>
    );
  }

  const open = slots.filter((s) => s.available);

  return (
    <div className="booking-slots">
      <div className="booking-slots__header">
        <div className="booking-slots__date">
          {formatDateShort(selectedDate)}
        </div>
        <div
          className="booking-slots__toggle"
          role="group"
          aria-label="Time format"
        >
          <button
            type="button"
            className={timeFormat === "12h" ? "is-active" : ""}
            onClick={() => onToggleFormat("12h")}
          >
            12h
          </button>
          <button
            type="button"
            className={timeFormat === "24h" ? "is-active" : ""}
            onClick={() => onToggleFormat("24h")}
          >
            24h
          </button>
        </div>
      </div>

      {loading ? (
        <div className="booking-slots__empty">Loading times…</div>
      ) : open.length === 0 ? (
        <div className="booking-slots__empty">
          No times available on this date. Try another day.
        </div>
      ) : (
        <div className="booking-slots__list">
          {open.map((s) => {
            const userTime = convertSlotToUserTz(
              selectedDate,
              s.time,
              storeTimezone,
              userTimezone,
            );
            const label =
              timeFormat === "24h" ? userTime : formatTime12h(userTime);
            return (
              <button
                type="button"
                key={s.time}
                className={`booking-slots__item${selectedTime === s.time ? " is-selected" : ""}`}
                onClick={() => onSelectTime(s.time)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {selectedTime ? (
        <div className="booking-confirm-bar">
          <button type="button" onClick={onConfirm} disabled={submitting}>
            {submitting ? "Booking…" : "Confirm booking"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
