"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchUserProfile } from "@/lib/api";
import type { User } from "@/lib/types";
import type { FeedItem } from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PinCard } from "@/components/pins/pin-card";
import { PinSkeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/cn";

type Tab = "created" | "saved";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { user: me } = useAuth();
  const [data, setData] = useState<{
    user: User;
    created: FeedItem[];
    saved: FeedItem[];
  } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>("created");

  useEffect(() => {
    let cancel = false;
    setData(null);
    setNotFound(false);
    (async () => {
      try {
        const res = await fetchUserProfile(username);
        if (!cancel) setData(res);
      } catch {
        if (!cancel) setNotFound(true);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [username]);

  const items = useMemo(() => {
    if (!data) return [];
    return tab === "created" ? data.created : data.saved;
  }, [tab, data]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl">User not found</h1>
        <Link href="/" className="mt-6 inline-block">
          <Button>Back to feed</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <header className="flex flex-col items-center text-center">
        <Avatar src={data?.user.avatar} name={data?.user.name} size={104} />
        <h1 className="mt-5 font-display text-4xl tracking-tight">
          {data?.user.name ?? "Loading…"}
        </h1>
        {data && (
          <>
            <p className="mt-1 text-sm text-fg-muted">@{data.user.username}</p>
            {data.user.bio && (
              <p className="mt-3 max-w-md text-sm text-fg/80">{data.user.bio}</p>
            )}
            <p className="mt-3 text-sm text-fg-muted">
              <strong className="text-fg">{data.created.length}</strong> created
              <span className="mx-2">·</span>
              <strong className="text-fg">{data.saved.length}</strong> saved
            </p>
            {me?.id === data.user.id ? (
              <Link href="/create" className="mt-5">
                <Button size="sm">Create pin</Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" className="mt-5">
                Follow
              </Button>
            )}
          </>
        )}
      </header>

      <div className="mt-10 flex justify-center gap-1 border-b border-border">
        {(["created", "saved"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "relative -mb-px rounded-t-full px-5 py-3 text-sm font-semibold capitalize transition-colors",
              tab === t ? "text-fg" : "text-fg-muted hover:text-fg",
            )}
          >
            {t}
            <span
              className={cn(
                "absolute inset-x-3 -bottom-px h-0.5 rounded-full transition-colors",
                tab === t ? "bg-fg" : "bg-transparent",
              )}
            />
          </button>
        ))}
      </div>

      <div className="mt-8">
        {!data ? (
          <div className="masonry">
            <PinSkeleton count={12} />
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-md py-20 text-center">
            <p className="text-sm text-fg-muted">
              {tab === "created"
                ? "Nothing posted yet."
                : "No saved pins yet."}
            </p>
          </div>
        ) : (
          <div className="masonry">
            {items.map((p) => (
              <PinCard key={p.id} pin={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
