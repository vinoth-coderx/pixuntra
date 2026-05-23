"use client";

import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import type { FeedItem } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { SaveButton } from "./save-button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/cn";

type Props = {
  pin: FeedItem;
};

function PinCardImpl({ pin }: Readonly<Props>) {
  const { user } = useAuth();
  const initialSaved = !!user && pin.saves.includes(user.id);
  const aspect = pin.height / pin.width;
  const [loaded, setLoaded] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (revealed) return;
    const node = rootRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            obs.disconnect();
            break;
          }
        }
      },
      { rootMargin: "150px 0px 150px 0px", threshold: 0.01 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [revealed]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "group block w-full break-inside-avoid mb-4",
        revealed ? "animate-pin-rise" : "pin-rise-hidden",
      )}
    >
      <Link
        href={`/pin/${pin.id}`}
        prefetch={false}
        className="relative block overflow-hidden rounded-2xl bg-surface-2"
      >
        <div
          className="aspect-img w-full"
          style={{ paddingTop: `${aspect * 100}%` }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pin.imageUrl}
          alt={pin.title}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500",
            loaded ? "opacity-100" : "opacity-0",
            "group-hover:scale-[1.03]",
          )}
        />
        <div className="pin-overlay pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <span className="absolute right-3 top-3 z-10 translate-y-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <SaveButton pinId={pin.id} initialSaved={initialSaved} />
        </span>

        {pin.link && (
          <span className="absolute bottom-3 left-3 z-10 translate-y-1 opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="rounded-full bg-bg/95 px-3 py-1.5 text-xs font-medium text-fg backdrop-blur">
              {new URL(pin.link).hostname.replace(/^www\./, "")}
            </span>
          </span>
        )}
      </Link>

      <div className="mt-2 px-1">
        <Link href={`/pin/${pin.id}`} prefetch={false}>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug hover:underline">
            {pin.title}
          </h3>
        </Link>
        <Link
          href={`/profile/${pin.author.username}`}
          className="mt-2 inline-flex items-center gap-2 text-xs text-fg-muted hover:text-fg transition-colors"
        >
          <Avatar src={pin.author.avatar} name={pin.author.name} size={22} />
          {pin.author.name}
        </Link>
      </div>
    </div>
  );
}

export const PinCard = memo(PinCardImpl);
