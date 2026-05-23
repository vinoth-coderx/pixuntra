"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/types";
import { createPin } from "@/lib/api";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { ImageIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const SAMPLE_URLS = [
  "https://picsum.photos/seed/idea-1/800/1000",
  "https://picsum.photos/seed/idea-2/800/900",
  "https://picsum.photos/seed/idea-3/800/1100",
];

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState<string>("Design");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return setError("Add a title");
    if (!imageUrl.trim()) return setError("Paste an image URL");
    setSubmitting(true);
    try {
      const res = await createPin({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        category,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        link: link.trim() || undefined,
      });
      toast.success("Pin published");
      router.push(`/pin/${res.pin.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't create pin");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight">Create a pin</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Add something to your board. Paste any public image URL.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-6 rounded-3xl border border-border bg-surface p-5 md:grid-cols-[1fr_1.1fr] md:p-7"
      >
        <div className="flex flex-col gap-3">
          <PreviewArea url={imageUrl} />
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS.map((u, i) => (
              <button
                key={u}
                type="button"
                onClick={() => setImageUrl(u)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-fg-muted hover:bg-surface-2"
              >
                Try sample {i + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            label="Image URL"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…/image.jpg"
            required
          />
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A good title catches a wandering eye"
            maxLength={80}
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this remind you of?"
            maxLength={500}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Category</label>
            <div className="no-scrollbar flex flex-wrap gap-2">
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    category === c
                      ? "border-fg bg-fg text-bg"
                      : "border-border text-fg hover:bg-surface-2",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="warm, studio, portrait (comma separated)"
          />
          <Input
            label="Link (optional)"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://your-source.com"
            error={error ?? undefined}
          />

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {submitting ? "Publishing" : "Publish pin"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function PreviewArea({ url }: { url: string }) {
  const valid = /^https?:\/\//.test(url);
  return (
    <div className="aspect-img relative flex h-full min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-surface-2">
      {valid ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Preview"
          className="h-full w-full object-cover animate-fade-in"
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = "0.3";
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-fg-muted">
          <ImageIcon size={28} />
          <p className="text-sm">Paste an image URL to preview</p>
        </div>
      )}
    </div>
  );
}
