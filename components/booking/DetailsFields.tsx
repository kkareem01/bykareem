"use client";

import type { Field } from "@/lib/booking/consult-types";

type DetailsFieldsProps = {
  fields: Field[];
  answers: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

const inputCls =
  "w-full rounded-xl border border-line bg-porcelain px-4 py-3 text-sm text-hunter placeholder:text-moss/50 focus:outline-none focus:border-gold";

/** Renders the per-consult-type answer fields from FIELD_SCHEMAS. */
export function DetailsFields({ fields, answers, onChange }: DetailsFieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="text-sm text-hunter">
            {field.label}
            {field.required ? <span className="text-gold"> *</span> : null}
          </span>
          <div className="mt-1.5">
            {field.type === "select" ? (
              <select
                value={answers[field.name] ?? ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                required={field.required}
                className={inputCls}
              >
                <option value="" disabled>
                  Choose…
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                value={answers[field.name] ?? ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                rows={4}
                className={inputCls}
              />
            ) : (
              <input
                type={field.type === "date" ? "date" : "text"}
                value={answers[field.name] ?? ""}
                onChange={(e) => onChange(field.name, e.target.value)}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                className={inputCls}
              />
            )}
          </div>
        </label>
      ))}
    </>
  );
}
