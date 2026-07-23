"use client";

import type { Field } from "@/lib/booking/consult-types";

type DetailsFieldsProps = {
  fields: Field[];
  answers: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * Per-consult-type qualifying questions, rendered inside the card's extended
 * block with `.field` markup (labels shown — these are real questions).
 */
export function DetailsFields({ fields, answers, onChange }: DetailsFieldsProps) {
  return (
    <>
      {fields.map((field) => {
        const id = `bk-f-${field.name}`;
        const value = answers[field.name] ?? "";
        return (
          <div className="field" data-field={field.name} key={field.name}>
            <label htmlFor={id}>
              {field.label}
              {field.required ? " *" : ""}
            </label>
            {field.type === "select" ? (
              <select
                id={id}
                value={value}
                required={field.required}
                onChange={(e) => onChange(field.name, e.target.value)}
              >
                <option value="">Select</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={id}
                rows={3}
                value={value}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            ) : (
              <input
                id={id}
                type={field.type === "date" ? "date" : "text"}
                value={value}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                min={field.type === "date" ? todayISO() : undefined}
                onChange={(e) => onChange(field.name, e.target.value)}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
