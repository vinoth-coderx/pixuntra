"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PinFeed } from "@/components/pins/pin-feed";
import { CategoryChips } from "@/components/ui/category-chips";
import { CATEGORIES } from "@/lib/types";
import { PinSkeleton } from "@/components/ui/skeleton";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
          <div className="h-10 w-40 rounded-2xl shimmer" />
          <div className="masonry mt-8">
            <PinSkeleton count={18} />
          </div>
        </div>
      }
    >
      <ExploreInner />
    </Suspense>
  );
}

function ExploreInner() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") ?? "All";
  const q = params.get("q") ?? "";
  const [seed] = useState(() => Math.random().toString(36).slice(2, 10));

  const feedParams = useMemo(
    () => ({ q: q || undefined, category, seed: q ? undefined : seed }),
    [q, category, seed],
  );

  function setCategory(c: string) {
    const usp = new URLSearchParams(params.toString());
    if (c === "All") usp.delete("category");
    else usp.set("category", c);
    router.replace(`/explore?${usp.toString()}`);
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Explore</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Browse by mood. Save what stays with you.
        </p>
      </header>

      <div className="mt-6">
        <CategoryChips options={CATEGORIES} value={category} onChange={setCategory} />
      </div>

      <div className="mt-6 pb-20">
        <PinFeed params={feedParams} />
      </div>
    </div>
  );
}
