"use client";

import type { BookingStep } from "./booking-titles";

/** Two-step indicator strip at the top of the card (form → pick a time). */
export function StepPill({
  step,
  bookLabel,
}: {
  step: BookingStep;
  bookLabel: string;
}) {
  const items = [
    { label: "Fill out the form", active: step <= 2, done: step === 3 },
    { label: bookLabel, active: step === 3, done: false },
  ];
  return (
    <div className="booking-step-pill">
      {items.map((item, idx) => {
        const cls = item.done ? "is-done" : item.active ? "is-active" : "";
        return (
          <span key={item.label} style={{ display: "inline-flex", alignItems: "center" }}>
            {idx > 0 ? <span className="booking-step-pill__sep">·</span> : null}
            <span className={`booking-step-pill__item ${cls}`}>
              <span className="booking-step-pill__dot" />
              {item.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
