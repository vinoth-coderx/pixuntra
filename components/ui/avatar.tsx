"use client";

import { cn } from "@/lib/cn";

type Props = {
  src?: string;
  name?: string;
  size?: number;
  className?: string;
  ring?: boolean;
};
const PALETTE: { bg: string; fg: string }[] = [
  { bg: "#E11D48", fg: "#fff" }, // rose
  { bg: "#DB2777", fg: "#fff" }, // pink
  { bg: "#A21CAF", fg: "#fff" }, // fuchsia
  { bg: "#7C3AED", fg: "#fff" }, // violet
  { bg: "#4F46E5", fg: "#fff" }, // indigo
  { bg: "#2563EB", fg: "#fff" }, // blue
  { bg: "#0891B2", fg: "#fff" }, // cyan
  { bg: "#0D9488", fg: "#fff" }, // teal
  { bg: "#059669", fg: "#fff" }, // emerald
  { bg: "#65A30D", fg: "#fff" }, // lime
  { bg: "#D97706", fg: "#fff" }, // amber
  { bg: "#EA580C", fg: "#fff" }, // orange
];

function colorForName(name: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) {
    h ^= name.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return PALETTE[(h >>> 0) % PALETTE.length];
}

function firstLetter(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

function isPlaceholder(src?: string) {
  if (!src) return true;
  return /pravatar\.cc|placehold|gravatar\.com\/avatar\/0+/.test(src);
}

export function Avatar({ src, name, size = 36, className, ring }: Readonly<Props>) {
  const safeName = name ?? "?";
  const useImage = !isPlaceholder(src);
  const color = colorForName(safeName);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full overflow-hidden font-semibold shrink-0 select-none",
        ring && "ring-2 ring-bg",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.44,
        lineHeight: 1,
        background: useImage ? undefined : color.bg,
        color: useImage ? undefined : color.fg,
      }}
      aria-label={name}
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? ""}
          width={size}
          height={size}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden>{firstLetter(safeName)}</span>
      )}
    </span>
  );
}
