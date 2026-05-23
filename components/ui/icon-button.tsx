"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "solid" | "elevated";
  size?: "sm" | "md" | "lg";
  active?: boolean;
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export const IconButton = forwardRef<HTMLButtonElement, Props>(function IconButton(
  { variant = "ghost", size = "md", active, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-[transform,background,color] duration-150 active:scale-90",
        sizes[size],
        variant === "ghost" && "text-fg hover:bg-surface-2",
        variant === "solid" && "bg-surface text-fg hover:bg-surface-2 border border-border",
        variant === "elevated" && "bg-surface text-fg shadow-[var(--shadow-soft)] hover:bg-surface-2",
        active && "text-brand",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
