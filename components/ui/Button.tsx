import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 rounded-full whitespace-nowrap";

const variants = {
  primary:
    "gold-sheen text-hunter-deep hover:shadow-[0_8px_30px_rgba(184,145,46,0.4)] active:translate-y-px",
  ghost:
    "border border-hunter/25 text-hunter hover:border-gold hover:text-gold bg-transparent",
};

const sizes = {
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function Button({
  href,
  onClick,
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${
    disabled ? "opacity-40 pointer-events-none" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
