"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Avatar } from "@/components/ui/avatar";
import { LogoutIcon, UserIcon, BookmarkIcon, ImageIcon } from "@/components/ui/icons";

export function UserMenu() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full transition-transform active:scale-95"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar src={user.avatar} name={user.name} size={36} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-64 origin-top-right rounded-2xl border border-border bg-surface p-2 shadow-[var(--shadow-soft)] animate-pop-in"
        >
          <div className="flex items-center gap-3 rounded-xl px-3 py-3">
            <Avatar src={user.avatar} name={user.name} size={40} />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{user.name}</div>
              <div className="truncate text-xs text-fg-muted">@{user.username}</div>
            </div>
          </div>
          <div className="my-1 h-px bg-border" />
          <MenuItem href={`/profile/${user.username}`} icon={<UserIcon size={18} />} onSelect={() => setOpen(false)}>
            Your profile
          </MenuItem>
          <MenuItem href="/saved" icon={<BookmarkIcon size={18} />} onSelect={() => setOpen(false)}>
            Saved pins
          </MenuItem>
          <MenuItem href="/create" icon={<ImageIcon size={18} />} onSelect={() => setOpen(false)}>
            Create pin
          </MenuItem>
          <div className="my-1 h-px bg-border" />
          <button
            role="menuitem"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-fg hover:bg-surface-2"
            onClick={async () => {
              setOpen(false);
              await logout();
              toast.success("Signed out");
              router.push("/");
            }}
          >
            <LogoutIcon size={18} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  children,
  onSelect,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg hover:bg-surface-2"
    >
      {icon}
      {children}
    </Link>
  );
}
