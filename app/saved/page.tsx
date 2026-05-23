"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { PinFeed } from "@/components/pins/pin-feed";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  const params = useMemo(() => ({ savedBy: user?.id }), [user?.id]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
        <Skeleton className="h-10 w-60" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-display text-4xl tracking-tight">Your saved pins</h1>
        <p className="mt-1 text-sm text-fg-muted">
          A little vault of things worth keeping.
        </p>
      </header>

      <div className="mt-8 pb-20">
        <PinFeed
          params={params}
          emptyTitle="Nothing saved yet"
          emptyHint="Tap the Save button on any pin to keep it here."
        />
      </div>
    </div>
  );
}
