export type User = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  createdAt: number;
};

export type Pin = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  category: string;
  tags: string[];
  link?: string;
  authorId: string;
  createdAt: number;
  likes: string[];
  saves: string[];
};

export type Comment = {
  id: string;
  pinId: string;
  authorId: string;
  content: string;
  createdAt: number;
};

export type AuthSession = {
  token: string;
  userId: string;
};

export const CATEGORIES = [
  "All",
  "Design",
  "Art",
  "Photography",
  "Architecture",
  "Travel",
  "Food",
  "Fashion",
  "Nature",
  "Technology",
  "Interiors",
  "Quotes",
] as const;

export type Category = (typeof CATEGORIES)[number];
