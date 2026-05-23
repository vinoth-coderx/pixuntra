import { Router } from "express";
import { User } from "../models/user.js";
import { Pin } from "../models/pin.js";
import { publicPin, publicUser } from "../utils/serialize.js";

const router = Router();

router.get("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    const [created, saved] = await Promise.all([
      Pin.find({ author: user._id })
        .sort({ createdAt: -1 })
        .populate("author")
        .lean(),
      Pin.find({ saves: user._id })
        .sort({ createdAt: -1 })
        .populate("author")
        .lean(),
    ]);

    return res.json({
      user: publicUser(user),
      created: created.map((p) => publicPin(p as Parameters<typeof publicPin>[0])),
      saved: saved.map((p) => publicPin(p as Parameters<typeof publicPin>[0])),
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
