"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  full?: boolean;
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-12 px-6 text-base rounded-full",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white hover:bg-brand-hover active:scale-[0.98] shadow-[0_8px_22px_-12px_rgb(var(--brand)/.85)]",
  secondary:
    "bg-surface-2 text-fg hover:bg-border active:scale-[0.98]",
  ghost:
    "bg-transparent text-fg hover:bg-surface-2 active:scale-[0.98]",
  outline:
    "border border-border text-fg hover:bg-surface-2 active:scale-[0.98]",
  dark:
    "bg-accent text-bg hover:opacity-90 active:scale-[0.98]",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", loading, full, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background,color,box-shadow] duration-150",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        sizes[size],
        variants[variant],
        full && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});
