"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchPin, type CommentItem, type FeedItem } from "@/lib/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { LikeButton } from "@/components/pins/like-button";
import { SaveButton } from "@/components/pins/save-button";
import { CommentSection } from "@/components/pins/comment-section";
import { PinCard } from "@/components/pins/pin-card";
import { PinActionsMenu } from "@/components/pins/pin-actions-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeftIcon, ShareIcon, LinkIcon } from "@/components/ui/icons";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { timeAgo } from "@/lib/format";

export default function PinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const [data, setData] = useState<{
    pin: FeedItem;
    comments: CommentItem[];
    related: FeedItem[];
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetchPin(id);
        if (!cancel) setData(res);
      } catch {
        if (!cancel) setNotFound(true);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id]);

  function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      navigator.share({ url, title: data?.pin.title }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      toast.success("Link copied");
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl">Pin not found</h1>
        <p className="mt-2 text-sm text-fg-muted">It may have been removed or never existed.</p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Back to feed</Button>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
        <div className="grid gap-6 rounded-3xl border border-border bg-surface p-3 md:grid-cols-2 md:p-4">
          <Skeleton className="h-[420px] md:h-[560px] w-full" />
          <div className="space-y-4 p-2 md:p-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  const { pin, comments, related } = data;
  const liked = !!user && pin.likes.includes(user.id);
  const saved = !!user && pin.saves.includes(user.id);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
      <button
        onClick={() => router.back()}
        className="mb-4 inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2 transition-colors"
      >
        <ArrowLeftIcon size={16} />
        Back
      </button>

      <article className="grid overflow-hidden rounded-3xl border border-border bg-surface shadow-soft md:grid-cols-2 md:max-h-[85vh]">
        <div className="bg-surface-2 md:overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="h-full max-h-[85vh] w-full object-cover md:rounded-l-3xl"
          />
        </div>

        <div className="flex min-h-0 flex-col md:max-h-[85vh]">
          {/* Top — actions, title, meta, author. Stays fixed on desktop. */}
          <div className="shrink-0 space-y-5 p-5 md:p-7 md:pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LikeButton
                  pinId={pin.id}
                  initialCount={pin.likes.length}
                  initialLiked={liked}
                />
                <IconButton variant="ghost" aria-label="Share" onClick={share}>
                  <ShareIcon size={18} />
                </IconButton>
                <PinActionsMenu imageUrl={pin.imageUrl} title={pin.title} />
              </div>
              <SaveButton pinId={pin.id} initialSaved={saved} size="md" />
            </div>

            <div>
              <h1 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                {pin.title}
              </h1>
              {pin.description && (
                <p className="mt-2 text-sm leading-relaxed text-fg/80">{pin.description}</p>
              )}
              {pin.link && (
                <a
                  href={pin.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-fg hover:underline"
                >
                  <LinkIcon size={14} />
                  {new URL(pin.link).hostname.replace(/^www\./, "")}
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium">
                {pin.category}
              </span>
              {pin.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 text-xs text-fg-muted"
                >
                  #{t}
                </span>
              ))}
            </div>

            <Link
              href={`/profile/${pin.author.username}`}
              className="flex items-center gap-3 rounded-2xl border border-border p-3 hover:bg-surface-2 transition-colors"
            >
              <Avatar src={pin.author.avatar} name={pin.author.name} size={44} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{pin.author.name}</div>
                <div className="truncate text-xs text-fg-muted">
                  @{pin.author.username} · posted {timeAgo(pin.createdAt)} ago
                </div>
              </div>
            </Link>
          </div>

          {/* Comments — only this region scrolls on desktop. */}
          <div className="flex min-h-0 flex-1 flex-col border-t border-border">
            <CommentSection pinId={pin.id} initial={comments} />
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl tracking-tight">More like this</h2>
          <div className="masonry mt-5">
            {related.map((p) => (
              <PinCard key={p.id} pin={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
