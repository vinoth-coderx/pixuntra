"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { SendIcon } from "@/components/ui/icons";
import { addComment, type CommentItem } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useLoginPrompt } from "@/components/providers/login-prompt-provider";
import { getSocket } from "@/lib/socket";

type Props = {
  pinId: string;
  initial: CommentItem[];
};

export function CommentSection({ pinId, initial }: Readonly<Props>) {
  const { user } = useAuth();
  const toast = useToast();
  const { promptLogin } = useLoginPrompt();
  const [items, setItems] = useState<CommentItem[]>(initial);
  const [value, setValue] = useState("");
  const [pending, start] = useTransition();
  const [liveCount, setLiveCount] = useState(0);

  // Join the pin room and listen for live comments.
  useEffect(() => {
    const socket = getSocket();
    socket.emit("pin:join", pinId);

    function onNew(incoming: CommentItem) {
      if (incoming.pinId !== pinId) return;
      setItems((prev) => {
        if (prev.some((c) => c.id === incoming.id)) return prev;
        if (incoming.authorId !== user?.id) {
          setLiveCount((n) => n + 1);
        }
        return [...prev, incoming];
      });
    }

    socket.on("comment:new", onNew);
    return () => {
      socket.off("comment:new", onNew);
      socket.emit("pin:leave", pinId);
    };
  }, [pinId, user?.id]);

  // Clear the "new" indicator after a brief moment.
  useEffect(() => {
    if (liveCount === 0) return;
    const t = window.setTimeout(() => setLiveCount(0), 2500);
    return () => window.clearTimeout(t);
  }, [liveCount]);

  function submit() {
    const content = value.trim();
    if (!content) return;
    if (!user) {
      promptLogin("comment");
      return;
    }
    start(async () => {
      try {
        const res = await addComment(pinId, content);
        setItems((prev) =>
          prev.some((c) => c.id === res.comment.id) ? prev : [...prev, res.comment],
        );
        setValue("");
      } catch {
        toast.error("Couldn't post comment");
      }
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header — fixed at top of the comments area */}
      <div className="shrink-0 px-5 pt-5 pb-3 md:px-7">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <span>
            Comments{" "}
            <span className="text-fg-muted font-normal">({items.length})</span>
          </span>
          {liveCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand animate-pop-in">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
              {liveCount} new
            </span>
          )}
        </h3>
      </div>

      {/* List — the only thing that scrolls */}
      <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-3 md:px-7">
        {items.length === 0 && (
          <li className="text-sm text-fg-muted">Be the first to say something kind.</li>
        )}
        {items.map((c) => (
          <li key={c.id} className="flex gap-3">
            <Avatar src={c.author.avatar} name={c.author.name} size={32} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <Link
                  href={`/profile/${c.author.username}`}
                  className="text-sm font-semibold hover:underline"
                >
                  {c.author.name}
                </Link>
                <span className="text-xs text-fg-muted">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="mt-0.5 break-words text-sm text-fg/90">{c.content}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Input — fixed at bottom */}
      <div className="shrink-0 border-t border-border bg-surface px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 rounded-full border-2 border-border bg-surface px-2 py-1.5 transition-[border-color,box-shadow] duration-150 focus-within:border-brand focus-within:shadow-[0_0_0_4px_rgb(var(--brand)/0.18)]">
          <Avatar src={user?.avatar} name={user?.name ?? "?"} size={32} />
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={user ? "Add a comment…" : "Sign in to comment"}
            maxLength={500}
            className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-fg-muted"
          />
          <IconButton
            onClick={submit}
            disabled={pending || !value.trim()}
            aria-label="Post comment"
            size="sm"
            variant="ghost"
          >
            <SendIcon size={16} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
