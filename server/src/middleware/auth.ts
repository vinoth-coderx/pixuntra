import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import { Session } from "../models/session.js";
import { User, type UserDoc } from "../models/user.js";
import type { Types } from "mongoose";

export const SESSION_COOKIE = "pix_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export type AuthedRequest = Request & {
  user?: (UserDoc & { _id: Types.ObjectId }) | null;
};

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function loadUser(req: AuthedRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) {
      req.user = null;
      return next();
    }
    const session = await Session.findOne({ token, expiresAt: { $gt: new Date() } }).lean();
    if (!session) {
      req.user = null;
      return next();
    }
    const user = await User.findById(session.user);
    req.user = user as (UserDoc & { _id: Types.ObjectId }) | null;
    return next();
  } catch (err) {
    return next(err);
  }
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Sign in required" });
    return;
  }
  next();
}

export function buildCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: false,
    path: "/",
    maxAge: SESSION_TTL_MS,
  };
}

export function sessionExpiry() {
  return new Date(Date.now() + SESSION_TTL_MS);
}
