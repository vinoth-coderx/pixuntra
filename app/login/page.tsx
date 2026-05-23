"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState("vinoth.coderx@gmail.com");
  const [password, setPassword] = useState("Vinoth@123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden md:block relative">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/login-art/1200/1600"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="relative flex h-full flex-col p-10 text-white">
          <Logo
            variant="full"
            imgClassName="size-40 lg:size-52 xl:size-60"
          />
          <div className="mt-auto max-w-md">
            <p className="font-display text-3xl leading-tight">
              &ldquo;Good taste hides in the things you keep coming back to.&rdquo;
            </p>
            <p className="mt-3 text-sm opacity-80">— a note tucked in a notebook</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-4 flex justify-center">
            <Logo
              variant="full"
              imgClassName="size-36 sm:size-44"
            />
          </div>
          <h1 className="font-display text-3xl tracking-tight text-center md:text-left">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-fg-muted text-center md:text-left">
            Sign in to pick up where you left off.
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
            />
            <Input
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={error ?? undefined}
              hint="Demo: vinoth.coderx@gmail.com / Vinoth@123"
            />
            <Button type="submit" loading={submitting} full>
              {submitting ? "Signing in" : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            New here?{" "}
            <Link href="/register" className="font-semibold text-fg hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-fg-muted">
            <Link href="/" className="hover:text-fg">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
