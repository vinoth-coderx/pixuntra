"use client";

import { cn } from "@/lib/cn";

type Props = {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

export function CategoryChips({ options, value, onChange, className }: Props) {
  return (
    <div className={cn("no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1", className)}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "shrink-0 rounded-full px-4 h-9 text-sm font-medium border transition-colors",
              active
                ? "bg-fg text-bg border-fg"
                : "bg-surface text-fg border-border hover:bg-surface-2",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
