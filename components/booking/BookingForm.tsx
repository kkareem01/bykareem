"use client";

import { bookingConfig } from "@/content/booking-config";
import { CONSULT_TYPES, type Field } from "@/lib/booking/consult-types";
import type { ConsultType } from "@/lib/booking/types";
import { DetailsFields } from "./DetailsFields";
import {
  CARD_TITLES,
  maskPhone,
  sublineFor,
  type BookingStep,
  type Customer,
} from "./booking-titles";

type BookingFormProps = {
  audience: ConsultType;
  step: BookingStep;
  lockType: boolean;
  customer: Customer;
  answers: Record<string, string>;
  fields: Field[];
  honeypot: string;
  error: string | null;
  onPickType: (t: ConsultType) => void;
  onCustomerChange: (patch: Partial<Customer>) => void;
  onAnswerChange: (name: string, value: string) => void;
  onHoneypotChange: (value: string) => void;
  onSubmitStep: () => void;
};

/** The form pane (steps 1 + 2): occasion, lead fields, questions, consent. */
export function BookingForm({
  audience,
  step,
  lockType,
  customer,
  answers,
  fields,
  honeypot,
  error,
  onPickType,
  onCustomerChange,
  onAnswerChange,
  onHoneypotChange,
  onSubmitStep,
}: BookingFormProps) {
  const title = CARD_TITLES[audience];
  const extendedHidden = step === 1;

  return (
    <>
      {lockType ? (
        <p className="booking-occasion__switch">
          Booking something else? <a href="/book">See all options →</a>
        </p>
      ) : (
        <div className="booking-occasion">
          <span className="booking-occasion__label">What&apos;s the occasion?</span>
          <div className="booking-occasion__pills">
            {CONSULT_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={audience === t}
                className={`booking-occasion__pill${audience === t ? " is-active" : ""}`}
                onClick={() => onPickType(t)}
              >
                {bookingConfig.consultTypes[t]?.label ?? t}
              </button>
            ))}
          </div>
        </div>
      )}

      <h2>{title.h2}</h2>
      <p className="booking-pane__sub">{title.sub}</p>
      <p className="booking-pane__sub">{sublineFor(step)}</p>

      {error ? (
        <div className="booking-error" role="alert">
          {error}
        </div>
      ) : null}

      <form
        className="booking-form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitStep();
        }}
      >
        <div className="field">
          <label htmlFor="bk-phone">Phone</label>
          <div className="booking-form__phone-row">
            <span className="booking-form__country" aria-label="United States">
              +1
            </span>
            <input
              id="bk-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              maxLength={14}
              placeholder="(404) 555-0123"
              value={customer.phone}
              onChange={(e) =>
                onCustomerChange({ phone: maskPhone(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="booking-form__row">
          <div className="field">
            <label htmlFor="bk-first">First name</label>
            <input
              id="bk-first"
              type="text"
              autoComplete="given-name"
              required
              maxLength={60}
              placeholder="First name *"
              value={customer.firstName}
              onChange={(e) => onCustomerChange({ firstName: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="bk-last">Last name</label>
            <input
              id="bk-last"
              type="text"
              autoComplete="family-name"
              required
              maxLength={60}
              placeholder="Last name *"
              value={customer.lastName}
              onChange={(e) => onCustomerChange({ lastName: e.target.value })}
            />
          </div>
        </div>

        <div
          className="booking-form__extended"
          aria-hidden={extendedHidden}
        >
          <div className="field">
            <label htmlFor="bk-email">Email Address</label>
            <input
              id="bk-email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email *"
              value={customer.email}
              onChange={(e) => onCustomerChange({ email: e.target.value })}
            />
          </div>
          <DetailsFields
            fields={fields}
            answers={answers}
            onChange={onAnswerChange}
          />
        </div>

        <label className="booking-form__consent">
          <input
            type="checkbox"
            checked={customer.consent}
            onChange={(e) => onCustomerChange({ consent: e.target.checked })}
            required
          />
          <span>
            By entering your information, you agree to be contacted about your
            booking by phone, text, and email, and to your data being saved per
            our <a href="#" tabIndex={-1}>Terms</a> &amp;{" "}
            <a href="#" tabIndex={-1}>Privacy Policy</a>.
          </span>
        </label>

        {/* honeypot — off-screen, tempting to bots */}
        <input
          type="text"
          name="website"
          className="booking-form__honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => onHoneypotChange(e.target.value)}
        />

        <button type="submit">Continue ›</button>
      </form>
    </>
  );
}
