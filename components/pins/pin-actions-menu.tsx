"use client";

import { useEffect, useRef, useState } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { useToast } from "@/components/providers/toast-provider";
import {
  MoreIcon,
  DownloadIcon,
  ClipboardIcon,
  ExternalLinkIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Props = {
  imageUrl: string;
  pinUrl?: string;
  title: string;
};

export function PinActionsMenu({ imageUrl, pinUrl, title }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60) || "pin";

  async function downloadOriginal() {
    if (busy) return;
    setBusy(true);
    setOpen(false);
    try {
      const res = await fetch(imageUrl, { mode: "cors", cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const ext = guessExtension(blob.type, imageUrl);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixuntra-${slug}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Saved to downloads");
    } catch {
      window.open(imageUrl, "_blank", "noreferrer");
      toast.info("Right-click the image to save");
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    const link = pinUrl ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy");
    }
    setOpen(false);
  }

  function openOriginal() {
    window.open(imageUrl, "_blank", "noreferrer");
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <IconButton
        variant="ghost"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreIcon size={18} />
      </IconButton>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute left-0 top-12 z-50 w-56 origin-top-left rounded-2xl border border-border bg-surface p-1.5 shadow-[var(--shadow-soft)] animate-pop-in",
          )}
        >
          <MenuItem
            icon={<DownloadIcon size={16} />}
            label={busy ? "Downloading…" : "Download image"}
            sub="Full resolution"
            onClick={downloadOriginal}
            disabled={busy}
          />
          <MenuItem
            icon={<ClipboardIcon size={16} />}
            label="Copy link"
            onClick={copyLink}
          />
          <MenuItem
            icon={<ExternalLinkIcon size={16} />}
            label="Open original"
            onClick={openOriginal}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  sub,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      role="menuitem"
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-surface-2 transition-colors",
        disabled && "opacity-60 cursor-not-allowed",
      )}
    >
      <span className="text-fg-muted">{icon}</span>
      <span className="flex-1">
        <span className="block font-medium text-fg">{label}</span>
        {sub && <span className="block text-xs text-fg-muted">{sub}</span>}
      </span>
    </button>
  );
}

function guessExtension(mime: string, url: string): string {
  if (mime.startsWith("image/")) {
    const t = mime.slice(6).toLowerCase();
    if (t === "jpeg") return "jpg";
    if (t === "svg+xml") return "svg";
    if (["jpg", "png", "gif", "webp", "avif"].includes(t)) return t;
  }
  const m = /\.(jpe?g|png|gif|webp|avif)(?:\?|$)/i.exec(url);
  if (m) return m[1].toLowerCase() === "jpeg" ? "jpg" : m[1].toLowerCase();
  return "jpg";
}
