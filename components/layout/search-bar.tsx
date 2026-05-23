"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, CloseIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function SearchBar({ className }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  function submit(next: string) {
    const usp = new URLSearchParams(params.toString());
    if (next) usp.set("q", next);
    else usp.delete("q");
    const qs = usp.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  return (
    <form
      role="search"
      className={cn(
        "group relative flex h-11 w-full max-w-2xl items-center gap-2 rounded-full border border-border bg-surface-2 pl-4 pr-1.5 transition-colors focus-within:border-fg/30 focus-within:bg-surface",
        className,
      )}
      onSubmit={(e) => {
        e.preventDefault();
        submit(value.trim());
      }}
    >
      <SearchIcon className="text-fg-muted shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for ideas, palettes, places…"
        aria-label="Search"
        className="flex-1 min-w-0 bg-transparent text-[15px] outline-none placeholder:text-fg-muted"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear"
          className="rounded-full p-1.5 text-fg-muted hover:bg-border transition-colors"
          onClick={() => {
            setValue("");
            submit("");
            inputRef.current?.focus();
          }}
        >
          <CloseIcon size={16} />
        </button>
      )}
      <button
        type="submit"
        aria-label="Search"
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-[0_4px_14px_-6px_rgb(var(--brand)/.7)] transition-[transform,background] duration-150 hover:bg-brand-hover active:scale-95"
      >
        <SearchIcon size={16} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}
