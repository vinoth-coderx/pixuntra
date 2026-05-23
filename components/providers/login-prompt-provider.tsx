"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

type Action = "save" | "like" | "comment" | "create" | "follow" | "generic";

type ContextValue = {
  promptLogin: (action?: Action) => void;
};

const COPY: Record<Action, { title: string; body: string }> = {
  save: {
    title: "Save this pin?",
    body: "Sign in to keep ideas you love and build your own boards.",
  },
  like: {
    title: "Show some love",
    body: "Sign in to like pins and tell creators what's working.",
  },
  comment: {
    title: "Join the conversation",
    body: "Sign in to leave a comment on this pin.",
  },
  create: {
    title: "Share your pin",
    body: "Sign in to publish your own image to the feed.",
  },
  follow: {
    title: "Follow this creator",
    body: "Sign in to follow people and keep their pins close.",
  },
  generic: {
    title: "Sign in to continue",
    body: "Create an account or log in to take this action.",
  },
};

const LoginPromptContext = createContext<ContextValue | null>(null);

export function LoginPromptProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [action, setAction] = useState<Action | null>(null);

  const promptLogin = useCallback((a: Action = "generic") => setAction(a), []);
  const close = useCallback(() => setAction(null), []);

  const value = useMemo(() => ({ promptLogin }), [promptLogin]);

  const copy = action ? COPY[action] : null;

  return (
    <LoginPromptContext.Provider value={value}>
      {children}
      <Modal open={!!action} onClose={close} labelledBy="login-prompt-title">
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 ring-1 ring-border">
            <Image
              src="/LogoWihtoutText.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
          </span>
          <h2
            id="login-prompt-title"
            className="font-display text-2xl tracking-tight"
          >
            {copy?.title ?? COPY.generic.title}
          </h2>
          <p className="mt-1.5 text-sm text-fg-muted">
            {copy?.body ?? COPY.generic.body}
          </p>
          <div className="mt-6 flex w-full flex-col gap-2.5">
            <Link href="/login" onClick={close} className="w-full">
              <Button full>Log in</Button>
            </Link>
            <Link href="/register" onClick={close} className="w-full">
              <Button full variant="outline">
                Create an account
              </Button>
            </Link>
          </div>
          <button
            type="button"
            onClick={close}
            className="mt-4 text-xs text-fg-muted hover:text-fg"
          >
            Maybe later
          </button>
        </div>
      </Modal>
    </LoginPromptContext.Provider>
  );
}

export function useLoginPrompt() {
  const ctx = useContext(LoginPromptContext);
  if (!ctx)
    throw new Error("useLoginPrompt must be used inside LoginPromptProvider");
  return ctx;
}
