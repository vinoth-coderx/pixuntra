"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";

export default function RegisterPage() {
  const router = useRouter();
  const toast = useToast();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      const u = await register({ name, username, email, password });
      toast.success(`Welcome, ${u.name.split(" ")[0]}`);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-4 flex justify-center md:justify-start">
            <Logo
              variant="full"
              imgClassName="size-36 sm:size-44 md:size-48 lg:size-56"
            />
          </div>
          <h1 className="font-display text-3xl tracking-tight text-center md:text-left">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-fg-muted text-center md:text-left">
            Save what you love. Share what you make.
          </p>

          <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
            <Input
              label="Full name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vinoth R"
            />
            <Input
              label="Username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="vinoth12"
              hint="Letters, numbers, underscore. 3–20 characters."
            />
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              error={error ?? undefined}
            />
            <Button type="submit" loading={submitting} full>
              {submitting ? "Creating account" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-fg-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-fg hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-fg-muted">
            <Link href="/" className="hover:text-fg">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block relative">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/register-art/1200/1600"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-black/60 via-black/15 to-transparent" />
        </div>
        <div className="relative flex h-full flex-col p-10 text-white">
          <div className="mt-auto max-w-md">
            <p className="font-display text-3xl leading-tight">
              Your taste deserves a better notebook.
            </p>
            <p className="mt-3 text-sm opacity-80">
              Join 50k+ creators building quiet collections on Pixuntra.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
