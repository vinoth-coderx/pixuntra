"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PinCard } from "./pin-card";
import { PinSkeleton } from "@/components/ui/skeleton";
import { fetchFeed, type FeedItem } from "@/lib/api";

type Params = {
  q?: string;
  category?: string;
  authorId?: string;
  savedBy?: string;
  seed?: string;
};

type Props = {
  params: Params;
  emptyTitle?: string;
  emptyHint?: string;
};

export function PinFeed({ params, emptyTitle = "Nothing here yet", emptyHint = "Try a different search or category." }: Props) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastKeyRef = useRef<string>("");
  const inflightRef = useRef(false);

  const load = useCallback(
    async (nextCursor: number) => {
      if (inflightRef.current) return;
      inflightRef.current = true;
      try {
        setError(null);
        const res = await fetchFeed({ ...params, cursor: nextCursor });
        setItems((prev) => (nextCursor === 0 ? res.items : [...prev, ...res.items]));
        setCursor(res.nextCursor);
      } catch {
        setError("Couldn't load more — check your connection.");
      } finally {
        setLoading(false);
        inflightRef.current = false;
      }
    },
    [params],
  );

  useEffect(() => {
    const key = JSON.stringify(params);
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    setItems([]);
    setCursor(0);
    setLoading(true);
    load(0);
  }, [params, load]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || cursor == null) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !inflightRef.current) {
          load(cursor);
        }
      },
      { rootMargin: "1200px 0px 1200px 0px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [cursor, load]);

  if (!loading && items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h2 className="text-xl font-semibold">{emptyTitle}</h2>
        <p className="mt-1 text-sm text-fg-muted">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="masonry">
        {items.map((it) => (
          <PinCard key={it.id} pin={it} />
        ))}
        {loading && items.length === 0 && <PinSkeleton count={18} />}
      </div>
      {error && (
        <div className="py-6 text-center text-sm text-rose-500">{error}</div>
      )}
      {cursor != null && (
        <div ref={sentinelRef} className="py-8">
          <div className="masonry">
            <PinSkeleton count={6} />
          </div>
        </div>
      )}
      {cursor == null && items.length > 0 && (
        <div className="py-10 text-center text-sm text-fg-muted">
          You&rsquo;ve reached the end. Nicely curated.
        </div>
      )}
    </div>
  );
}
