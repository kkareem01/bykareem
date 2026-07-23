"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Spam-scraper protection: the phone number never appears in
 * server-rendered HTML or as a plain digit string in the JS bundle.
 * Digits are stored shifted (+2 mod 10) and decoded in the browser
 * after hydration, so bots scanning page source or bundles for
 * phone-number patterns find nothing. To change the number, shift
 * each digit up by 2 (wrapping 8→0, 9→1) and update the array.
 */
const SHIFTED_DIGITS = [6, 2, 6, 4, 4, 3, 1, 3, 3, 3] as const;

function decodeDigits(): string {
  return SHIFTED_DIGITS.map((d) => (d + 8) % 10).join("");
}

function formatDisplay(digits: string): string {
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type ProtectedTelProps = {
  scheme?: "tel" | "sms";
  className?: string;
  /** Custom label (e.g. "Call"); defaults to the formatted number. */
  children?: ReactNode;
};

export function ProtectedTel({
  scheme = "tel",
  className,
  children,
}: ProtectedTelProps) {
  const [digits, setDigits] = useState<string | null>(null);

  useEffect(() => {
    setDigits(decodeDigits());
  }, []);

  return (
    <a
      href={digits ? `${scheme}:+1${digits}` : undefined}
      className={className}
    >
      {children ?? (digits ? formatDisplay(digits) : " ")}
    </a>
  );
}
