"use client";

import Link from "next/link";
import { Logo } from "./logo";
import { useAuth } from "@/components/providers/auth-provider";

export function Footer() {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  const productLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    ...(user ? [{ href: "/create", label: "Create" }] : []),
  ];

  const accountLinks =
    user
      ? [
          { href: `/profile/${user.username}`, label: "Your profile" },
          { href: "/saved", label: "Saved" },
          { href: "/create", label: "Create pin" },
        ]
      : [
          { href: "/login", label: "Log in" },
          { href: "/register", label: "Sign up" },
        ];

  return (
    <footer className="mt-24 border-t border-border bg-bg">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-fg-muted">
            A quieter place to keep what inspires you. Built for creators who want
            their feed to feel like a notebook, not a stream.
          </p>
        </div>
        <FooterCol title="Pixuntra" links={productLinks} />
        <FooterCol title="Account" links={accountLinks} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-2 px-6 py-5 text-xs text-fg-muted sm:flex-row sm:items-center">
          <span>© {year} Pixuntra. All rights reserved.</span>
          <span>Crafted by Vinoth · with care, in code.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: Readonly<{
  title: string;
  links: { href: string; label: string }[];
}>) {
  return (
    <div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2 text-sm text-fg-muted">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-fg transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
