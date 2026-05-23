import { Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.js";
import { Session } from "../models/session.js";
import {
  SESSION_COOKIE,
  buildCookieOptions,
  generateSessionToken,
  loadUser,
  sessionExpiry,
  type AuthedRequest,
} from "../middleware/auth.js";
import { publicUser } from "../utils/serialize.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const username = String(req.body?.username ?? "").trim().toLowerCase();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
      return res
        .status(400)
        .json({ error: "Username must be 3–20 chars (a–z, 0–9, _)" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: "Email is already registered" });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ error: "Username is taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
      avatar: `https://i.pravatar.cc/200?u=${username}`,
    });

    const token = generateSessionToken();
    await Session.create({ token, user: user._id, expiresAt: sessionExpiry() });
    res.cookie(SESSION_COOKIE, token, buildCookieOptions());

    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateSessionToken();
    await Session.create({ token, user: user._id, expiresAt: sessionExpiry() });
    res.cookie(SESSION_COOKIE, token, buildCookieOptions());

    return res.json({ user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (token) await Session.deleteOne({ token });
    res.clearCookie(SESSION_COOKIE, buildCookieOptions());
    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

router.get("/me", loadUser, (req: AuthedRequest, res) => {
  res.json({ user: req.user ? publicUser(req.user) : null });
});

export default router;
