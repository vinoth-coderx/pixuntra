"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PinFeed } from "@/components/pins/pin-feed";
import { useAuth } from "@/components/providers/auth-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SparkleIcon, ArrowRightIcon } from "@/components/ui/icons";
import { PinSkeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFallback />}>
      <HomeInner />
    </Suspense>
  );
}

function HomeFallback() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6">
      <div className="h-10 w-72 rounded-2xl shimmer" />
      <div className="masonry mt-8">
        <PinSkeleton count={18} />
      </div>
    </div>
  );
}

function HomeInner() {
  const params = useSearchParams();
  const { user, loading } = useAuth();
  const q = params.get("q") ?? "";
  const [seed] = useState(() => Math.random().toString(36).slice(2, 10));

  const feedParams = useMemo(
    () => ({ q: q || undefined, seed: q ? undefined : seed }),
    [q, seed],
  );

  if (q) return <SearchResults q={q} feedParams={feedParams} />;

  return (
    <div>
      <Hero user={user} loading={loading} />
      <section className="mx-auto max-w-[1500px] px-4 sm:px-6">
        <div className="flex items-end justify-between gap-3 pb-4">
          <div>
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Today on Pixuntra
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              A fresh stack of ideas. Save the ones that stick.
            </p>
          </div>
          <Link
            href="/explore"
            className="hidden shrink-0 items-center gap-1 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 sm:inline-flex"
          >
            Explore by category
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="pb-20">
          <PinFeed params={feedParams} />
        </div>
      </section>
    </div>
  );
}

function SearchResults({
  q,
  feedParams,
}: {
  q: string;
  feedParams: { q?: string };
}) {
  const router = useRouter();
  return (
    <section className="mx-auto max-w-[1500px] px-4 sm:px-6">
      <div className="flex items-end justify-between gap-3 pt-8 pb-4">
        <div>
          <p className="text-sm text-fg-muted">Showing results for</p>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">
            &ldquo;{q}&rdquo;
          </h1>
        </div>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2"
        >
          Clear search
        </button>
      </div>
      <div className="pb-20">
        <PinFeed
          params={feedParams}
          emptyTitle="No matches"
          emptyHint="Try a broader keyword or different spelling."
        />
      </div>
    </section>
  );
}

function Hero({
  user,
  loading,
}: {
  user: { name: string; username: string } | null;
  loading: boolean;
}) {
  const greeting = user ? `Welcome back, ${user.name.split(" ")[0]}` : "Now in soft launch";
  return (
    <section className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/15" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-amber-300/40 blur-3xl dark:bg-amber-500/15" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/15" />
      </div>
      <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1.1fr_1fr] md:py-16">
        <div className="animate-float-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted">
            <SparkleIcon size={14} />
            {loading ? "Loading your feed…" : greeting}
          </span>
          <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            {user ? (
              <>
                Your <span className="gradient-text">quieter</span> corner of the internet.
              </>
            ) : (
              <>
                Ideas you&rsquo;ll <span className="gradient-text">actually</span> come back to.
              </>
            )}
          </h1>
          <p className="mt-5 max-w-xl text-base text-fg-muted sm:text-lg">
            {user
              ? "Pick up where you left off — your saved pins, your boards, and a feed that learns your taste, not your impulses."
              : "Pixuntra is a quiet, beautiful place to collect what moves you — photographs, palettes, plans, places. No noise. No infinite outrage. Just a feed you'd be proud to scroll."}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {user ? (
              <>
                <Link href="/create">
                  <Button size="lg">
                    Create a pin
                    <ArrowRightIcon size={18} />
                  </Button>
                </Link>
                <Link href="/saved">
                  <Button variant="outline" size="lg">
                    Your saved
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg">
                    Start your board
                    <ArrowRightIcon size={18} />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="lg">
                    Browse the feed
                  </Button>
                </Link>
              </>
            )}
          </div>
          {!user && !loading && (
            <div className="mt-8 flex items-center gap-5 text-xs text-fg-muted">
              <span>Free forever</span>
              <span aria-hidden>·</span>
              <span>No ads, ever</span>
              <span aria-hidden>·</span>
              <span>Works in dark mode</span>
            </div>
          )}
        </div>
        <HeroCollage />
      </div>
    </section>
  );
}

function HeroCollage() {
  const tiles = [
    { src: "https://picsum.photos/seed/hero-1/600/800", h: 260, delay: 0 },
    { src: "https://picsum.photos/seed/hero-2/600/700", h: 180, delay: 80 },
    { src: "https://picsum.photos/seed/hero-3/600/900", h: 300, delay: 160 },
    { src: "https://picsum.photos/seed/hero-4/600/600", h: 160, delay: 240 },
    { src: "https://picsum.photos/seed/hero-5/600/800", h: 240, delay: 320 },
    { src: "https://picsum.photos/seed/hero-6/600/700", h: 200, delay: 400 },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {tiles.map((t, i) => (
        <div
          key={t.src}
          className="overflow-hidden rounded-2xl bg-surface-2 shadow-[var(--shadow-soft)] animate-pop-in"
          style={{ animationDelay: `${t.delay}ms`, animationFillMode: "both" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.src}
            alt=""
            loading={i < 3 ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            style={{ height: t.h }}
          />
        </div>
      ))}
    </div>
  );
}
