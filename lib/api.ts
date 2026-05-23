import type { Pin, User, Comment } from "./types";

export type FeedItem = Pin & { author: User };
export type CommentItem = Comment & { author: User };

export type FeedResponse = {
  items: FeedItem[];
  nextCursor: number | null;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050").replace(/\/$/, "");

export async function api<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export async function fetchFeed(params: {
  cursor?: number;
  q?: string;
  category?: string;
  authorId?: string;
  savedBy?: string;
  limit?: number;
  seed?: string;
}): Promise<FeedResponse> {
  const usp = new URLSearchParams();
  if (params.cursor != null) usp.set("cursor", String(params.cursor));
  if (params.q) usp.set("q", params.q);
  if (params.category && params.category !== "All") usp.set("category", params.category);
  if (params.authorId) usp.set("authorId", params.authorId);
  if (params.savedBy) usp.set("savedBy", params.savedBy);
  if (params.limit) usp.set("limit", String(params.limit));
  if (params.seed) usp.set("seed", params.seed);
  return api<FeedResponse>(`/api/pins?${usp.toString()}`);
}

export async function fetchPin(id: string): Promise<{
  pin: FeedItem;
  comments: CommentItem[];
  related: FeedItem[];
}> {
  return api(`/api/pins/${id}`);
}

export async function togglePinLike(id: string): Promise<{ liked: boolean; count: number }> {
  return api(`/api/pins/${id}/like`, { method: "POST" });
}

export async function togglePinSave(id: string): Promise<{ saved: boolean; count: number }> {
  return api(`/api/pins/${id}/save`, { method: "POST" });
}

export async function addComment(id: string, content: string): Promise<{ comment: CommentItem }> {
  return api(`/api/pins/${id}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function createPin(input: {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  link?: string;
}): Promise<{ pin: FeedItem }> {
  return api(`/api/pins`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchUserProfile(username: string): Promise<{
  user: User;
  created: FeedItem[];
  saved: FeedItem[];
}> {
  return api(`/api/users/${encodeURIComponent(username)}`);
}
