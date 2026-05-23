"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, hint, error, leading, trailing, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {label}
        </label>
      )}
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border-2 bg-surface px-4 h-12 transition-[border-color,box-shadow] duration-150",
          error
            ? "border-rose-400 focus-within:border-rose-500 focus-within:shadow-[0_0_0_4px_rgb(244_63_94/0.18)]"
            : "border-border focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgb(var(--brand)/0.18)]",
        )}
      >
        {leading && <span className="text-fg-muted">{leading}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex-1 bg-transparent outline-none focus:outline-none focus:ring-0 text-[15px] text-fg placeholder:text-fg-muted",
            className,
          )}
          {...rest}
        />
        {trailing && <span className="text-fg-muted">{trailing}</span>}
      </div>
      {(error || hint) && (
        <p className={cn("text-xs", error ? "text-rose-500" : "text-fg-muted")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});

type TAProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TAProps>(function Textarea(
  { label, hint, error, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          "w-full rounded-2xl border-2 bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-fg-muted outline-none transition-[border-color,box-shadow] duration-150 min-h-24 resize-y",
          error
            ? "border-rose-400 focus:border-rose-500 focus:shadow-[0_0_0_4px_rgb(244_63_94/0.18)]"
            : "border-border focus:border-brand focus:shadow-[0_0_0_4px_rgb(var(--brand)/0.18)]",
          className,
        )}
        {...rest}
      />
      {(error || hint) && (
        <p className={cn("text-xs", error ? "text-rose-500" : "text-fg-muted")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});
