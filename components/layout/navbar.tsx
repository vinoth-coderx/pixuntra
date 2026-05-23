"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/cn";
import { PlusIcon } from "@/components/ui/icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
];

export function Navbar() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if (isAuthRoute) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[backdrop-filter,background,border-color] duration-200",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-bg",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-3 px-4 sm:px-6">
        <Logo />

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-fg text-bg" : "text-fg hover:bg-surface-2",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          {user && (
            <Link
              href="/create"
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                pathname === "/create" ? "bg-fg text-bg" : "text-fg hover:bg-surface-2",
              )}
            >
              Create
            </Link>
          )}
        </nav>

        <div className="flex-1 px-2">
          <Suspense fallback={<div className="h-11 w-full max-w-2xl rounded-full bg-surface-2" />}>
            <SearchBar />
          </Suspense>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {!loading && !user && (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
          {!loading && user && (
            <>
              <Link href="/create" className="md:hidden">
                <Button size="sm" aria-label="Create pin">
                  <PlusIcon size={16} />
                  <span className="sr-only">Create</span>
                </Button>
              </Link>
              <UserMenu />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
