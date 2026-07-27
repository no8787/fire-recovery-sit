import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-orange-600 text-white hover:bg-orange-700",
  secondary: "bg-slate-900 text-white hover:bg-slate-800",
  outline: "border border-slate-300 text-slate-900 hover:bg-slate-100",
  ghost: "text-slate-900 hover:bg-slate-100",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
