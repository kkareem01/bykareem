/**
 * Per-consult-type field schemas for the booking form's details step.
 * One TS module shared by the React form AND server validation — they can
 * never drift (the suit store needed a runtime self-test for this).
 */

import type { ConsultType } from "./types";

export const CONSULT_TYPES: ConsultType[] = ["couples", "graduation", "general"];

export type Field = {
  name: string;
  label: string;
  type: "text" | "date" | "select" | "textarea";
  required: boolean;
  options?: readonly string[];
  maxLength?: number;
  placeholder?: string;
};

export const FIELD_SCHEMAS: Record<ConsultType, Field[]> = {
  couples: [
    {
      name: "eventDate",
      label: "Wedding or engagement date (if you have one)",
      type: "date",
      required: false,
    },
    {
      name: "occasion",
      label: "What are we celebrating?",
      type: "select",
      required: true,
      options: [
        "Wedding",
        "Engagement",
        "Proposal",
        "Anniversary",
        "Not sure yet",
      ],
    },
    {
      name: "venue",
      label: "Venue or city (if known)",
      type: "text",
      required: false,
      maxLength: 120,
      placeholder: "Atlanta, The Wheeler House, still deciding…",
    },
    {
      name: "vision",
      label: "Tell me about you two",
      type: "textarea",
      required: false,
      maxLength: 600,
      placeholder:
        "How you met, what your day looks like, what matters most in your photos & film…",
    },
  ],
  graduation: [
    {
      name: "school",
      label: "School / campus",
      type: "text",
      required: true,
      maxLength: 120,
      placeholder: "UGA, Georgia Tech, Georgia State…",
    },
    {
      name: "gradDate",
      label: "Graduation date",
      type: "date",
      required: false,
    },
    {
      name: "sessionType",
      label: "Who's the session for?",
      type: "select",
      required: true,
      options: ["Just me", "Me + friends", "Me + family", "Group of grads"],
    },
    {
      name: "notes",
      label: "Anything else?",
      type: "textarea",
      required: false,
      maxLength: 500,
      placeholder: "Deadlines, outfit ideas, locations you love…",
    },
  ],
  general: [
    {
      name: "occasion",
      label: "What are you looking for?",
      type: "text",
      required: true,
      maxLength: 120,
      placeholder: "Tell me a bit about the shoot you have in mind…",
    },
    {
      name: "eventDate",
      label: "Date you have in mind (optional)",
      type: "date",
      required: false,
    },
    {
      name: "notes",
      label: "Anything else I should know?",
      type: "textarea",
      required: false,
      maxLength: 600,
    },
  ],
};

export function isValidConsultType(a: unknown): a is ConsultType {
  return typeof a === "string" && (CONSULT_TYPES as string[]).includes(a);
}
