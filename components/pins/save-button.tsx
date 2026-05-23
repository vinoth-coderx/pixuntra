"use client";

import { memo, useState, useTransition } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useLoginPrompt } from "@/components/providers/login-prompt-provider";
import { togglePinSave } from "@/lib/api";
import { cn } from "@/lib/cn";

type Props = {
  pinId: string;
  initialSaved: boolean;
  size?: "sm" | "md";
};

function SaveButtonImpl({ pinId, initialSaved, size = "sm" }: Props) {
  const { user } = useAuth();
  const toast = useToast();
  const { promptLogin } = useLoginPrompt();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, start] = useTransition();

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      promptLogin("save");
      return;
    }
    const optimistic = !saved;
    setSaved(optimistic);
    start(async () => {
      try {
        const res = await togglePinSave(pinId);
        setSaved(res.saved);
        toast.success(res.saved ? "Saved to your pins" : "Removed from saved");
      } catch {
        setSaved(!optimistic);
        toast.error("Couldn't update");
      }
    });
  }

  const heightClass = size === "md" ? "h-11 px-5 text-sm" : "h-9 px-4 text-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-[transform,background] duration-150 active:scale-95",
        heightClass,
        saved
          ? "bg-fg text-bg hover:opacity-90"
          : "bg-brand text-white hover:bg-brand-hover",
      )}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export const SaveButton = memo(SaveButtonImpl);
