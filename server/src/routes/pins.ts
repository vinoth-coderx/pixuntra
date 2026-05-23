import { Router } from "express";
import mongoose from "mongoose";
import { Pin } from "../models/pin.js";
import { User } from "../models/user.js";
import { Comment } from "../models/comment.js";
import { loadUser, requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { publicPin, publicUser } from "../utils/serialize.js";
import { getIO, pinRoom } from "../realtime.js";

const router = Router();

const PAGE = 18;

router.get("/", loadUser, async (req: AuthedRequest, res, next) => {
  try {
    const cursor = Math.max(0, Number(req.query.cursor ?? 0));
    const limit = Math.min(48, Math.max(1, Number(req.query.limit ?? PAGE)));
    const q = String(req.query.q ?? "").trim();
    const category = String(req.query.category ?? "");
    const authorId = String(req.query.authorId ?? "");
    const savedBy = String(req.query.savedBy ?? "");
    const seed = String(req.query.seed ?? "").trim();

    const filter: Record<string, unknown> = {};
    if (category && category.toLowerCase() !== "all") {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
    }
    if (authorId && mongoose.isValidObjectId(authorId)) {
      filter.author = authorId;
    }
    if (savedBy && mongoose.isValidObjectId(savedBy)) {
      filter.saves = savedBy;
    }
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: rx }, { description: rx }, { category: rx }, { tags: rx }];
    }

    if (seed) {
      const all = await Pin.find(filter).populate("author").lean({ virtuals: false });
      all.sort((a, b) => {
        const ah = seededHash(seed, String(a._id));
        const bh = seededHash(seed, String(b._id));
        return ah - bh;
      });
      const slice = all.slice(cursor, cursor + limit);
      res.json({
        items: slice.map((p) => publicPin(p as Parameters<typeof publicPin>[0])),
        nextCursor: cursor + limit < all.length ? cursor + limit : null,
      });
      return;
    }

    const total = await Pin.countDocuments(filter);
    const pins = await Pin.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip(cursor)
      .limit(limit)
      .populate("author")
      .lean({ virtuals: false });

    res.json({
      items: pins.map((p) => publicPin(p as Parameters<typeof publicPin>[0])),
      nextCursor: cursor + limit < total ? cursor + limit : null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", loadUser, requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const title = String(req.body?.title ?? "").trim();
    const description = String(req.body?.description ?? "").trim();
    const imageUrl = String(req.body?.imageUrl ?? "").trim();
    const category = String(req.body?.category ?? "Design").trim();
    const link = req.body?.link ? String(req.body.link).trim() : undefined;
    const tags = Array.isArray(req.body?.tags)
      ? req.body.tags.map((t: unknown) => String(t).trim()).filter(Boolean).slice(0, 8)
      : [];

    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!imageUrl) return res.status(400).json({ error: "Image URL is required" });
    if (!/^https?:\/\//.test(imageUrl)) {
      return res.status(400).json({ error: "Image must be a valid URL" });
    }

    const pin = await Pin.create({
      title,
      description,
      imageUrl,
      category,
      tags,
      link,
      author: req.user!._id,
    });
    const populated = await pin.populate("author");
    return res.status(201).json({ pin: publicPin(populated.toObject() as Parameters<typeof publicPin>[0]) });
  } catch (err) {
    return next(err);
  }
});

router.get("/:id", loadUser, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ error: "Not found" });

    const pin = await Pin.findById(id).populate("author").lean();
    if (!pin) return res.status(404).json({ error: "Not found" });

    const [comments, related] = await Promise.all([
      Comment.find({ pin: id }).sort({ createdAt: 1 }).populate("author").lean(),
      Pin.find({
        _id: { $ne: pin._id },
        $or: [{ category: pin.category }, { tags: { $in: pin.tags ?? [] } }],
      })
        .sort({ createdAt: -1 })
        .limit(12)
        .populate("author")
        .lean(),
    ]);

    return res.json({
      pin: publicPin(pin as Parameters<typeof publicPin>[0]),
      comments: comments.map((c) => ({
        id: c._id.toString(),
        pinId: id,
        authorId: typeof c.author === "object" && c.author !== null && "_id" in c.author
          ? (c.author as { _id: unknown })._id?.toString()
          : String(c.author),
        content: c.content,
        createdAt: c.createdAt ? new Date(c.createdAt as Date).getTime() : Date.now(),
        author: typeof c.author === "object" && c.author !== null && "username" in c.author
          ? publicUser(c.author as unknown as Parameters<typeof publicUser>[0])
          : null,
      })),
      related: related.map((p) => publicPin(p as Parameters<typeof publicPin>[0])),
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/like", loadUser, requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ error: "Not found" });
    const userId = req.user!._id;

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ error: "Not found" });

    const has = pin.likes.some((u) => String(u) === String(userId));
    if (has) {
      pin.likes = pin.likes.filter((u) => String(u) !== String(userId));
    } else {
      pin.likes.push(userId);
    }
    await pin.save();

    const io = getIO();
    io?.to(pinRoom(id)).emit("like:update", {
      pinId: id,
      count: pin.likes.length,
    });

    return res.json({ liked: !has, count: pin.likes.length });
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/save", loadUser, requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ error: "Not found" });
    const userId = req.user!._id;

    const pin = await Pin.findById(id);
    if (!pin) return res.status(404).json({ error: "Not found" });

    const has = pin.saves.some((u) => String(u) === String(userId));
    if (has) {
      pin.saves = pin.saves.filter((u) => String(u) !== String(userId));
    } else {
      pin.saves.push(userId);
    }
    await pin.save();
    return res.json({ saved: !has, count: pin.saves.length });
  } catch (err) {
    return next(err);
  }
});

router.post("/:id/comments", loadUser, requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ error: "Not found" });

    const content = String(req.body?.content ?? "").trim();
    if (!content) return res.status(400).json({ error: "Comment cannot be empty" });
    if (content.length > 500) return res.status(400).json({ error: "Comment too long" });

    const pin = await Pin.findById(id).select("_id");
    if (!pin) return res.status(404).json({ error: "Not found" });

    const comment = await Comment.create({
      pin: pin._id,
      author: req.user!._id,
      content,
    });

    const payload = {
      id: comment._id?.toString?.() ?? String(comment._id),
      pinId: id,
      authorId: req.user!._id.toString(),
      content: comment.content,
      createdAt:
        (comment as unknown as { createdAt?: Date }).createdAt?.getTime?.() ??
        Date.now(),
      author: publicUser(req.user!),
    };

    const io = getIO();
    io?.to(pinRoom(id)).emit("comment:new", payload);

    return res.status(201).json({ comment: payload });
  } catch (err) {
    return next(err);
  }
});

function escapeRegex(s: string) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function seededHash(seed: string, id: string): number {
  let h = 0x811c9dc5;
  const s = `${seed}|${id}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export default router;
export { User };
