"use client";

import { memo, useEffect, useState, useTransition } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useLoginPrompt } from "@/components/providers/login-prompt-provider";
import { togglePinLike } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { HeartIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Props = {
  pinId: string;
  initialCount: number;
  initialLiked: boolean;
  showCount?: boolean;
  size?: number;
};

function LikeButtonImpl({
  pinId,
  initialCount,
  initialLiked,
  showCount = true,
  size = 20,
}: Readonly<Props>) {
  const { user } = useAuth();
  const toast = useToast();
  const { promptLogin } = useLoginPrompt();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [burst, setBurst] = useState(0);
  const [, start] = useTransition();

  // Listen for like updates from other users on the same pin.
  useEffect(() => {
    const socket = getSocket();
    socket.emit("pin:join", pinId);

    function onUpdate(payload: { pinId: string; count: number }) {
      if (payload.pinId !== pinId) return;
      setCount(payload.count);
    }

    socket.on("like:update", onUpdate);
    return () => {
      socket.off("like:update", onUpdate);
      socket.emit("pin:leave", pinId);
    };
  }, [pinId]);

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      promptLogin("like");
      return;
    }
    const optimistic = !liked;
    setLiked(optimistic);
    setCount((c) => c + (optimistic ? 1 : -1));
    if (optimistic) setBurst((n) => n + 1);
    start(async () => {
      try {
        const res = await togglePinLike(pinId);
        setLiked(res.liked);
        setCount(res.count);
      } catch {
        setLiked(!optimistic);
        setCount((c) => c + (optimistic ? -1 : 1));
        toast.error("Couldn't update");
      }
    });
  }

  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-fg hover:bg-surface-2"
    >
      <span
        key={burst}
        className={cn(liked && burst > 0 && "animate-heart-burst")}
      >
        <HeartIcon
          size={size}
          className={cn(liked ? "fill-rose-500 stroke-rose-500" : "stroke-current")}
        />
      </span>
      {showCount && <span className="tabular-nums">{count}</span>}
    </button>
  );
}

export const LikeButton = memo(LikeButtonImpl);
