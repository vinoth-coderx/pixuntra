import type { Types } from "mongoose";

type Authorish = {
  _id: Types.ObjectId | string;
  username: string;
  name: string;
  email?: string;
  avatar: string;
  bio?: string;
};

export function publicUser(u: Authorish) {
  return {
    id: u._id.toString(),
    username: u.username,
    name: u.name,
    email: u.email ?? "",
    avatar: u.avatar,
    bio: u.bio ?? "",
  };
}

type PinPopulated = {
  _id: Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  category: string;
  tags: string[];
  link?: string;
  author: Authorish | Types.ObjectId | string;
  likes: (Types.ObjectId | string)[];
  saves: (Types.ObjectId | string)[];
  createdAt?: Date;
};

export function publicPin(p: PinPopulated) {
  const authorObj =
    typeof p.author === "object" && p.author !== null && "username" in p.author
      ? publicUser(p.author as Authorish)
      : null;
  return {
    id: p._id.toString(),
    title: p.title,
    description: p.description ?? "",
    imageUrl: p.imageUrl,
    width: p.width,
    height: p.height,
    category: p.category,
    tags: p.tags ?? [],
    link: p.link ?? undefined,
    authorId: authorObj ? authorObj.id : String(p.author),
    likes: (p.likes ?? []).map(String),
    saves: (p.saves ?? []).map(String),
    createdAt: p.createdAt ? p.createdAt.getTime() : Date.now(),
    author: authorObj,
  };
}
