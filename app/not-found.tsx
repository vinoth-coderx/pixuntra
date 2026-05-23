import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-7xl tracking-tight">404</p>
      <h1 className="mt-2 font-display text-2xl tracking-tight">
        That page wandered off.
      </h1>
      <p className="mt-2 text-sm text-fg-muted">
        It probably never existed, but the feed still does.
      </p>
      <Link href="/" className="mt-6">
        <Button>Take me home</Button>
      </Link>
    </div>
  );
}
