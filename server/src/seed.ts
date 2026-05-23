import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "./models/user.js";
import { Pin } from "./models/pin.js";
import { Comment } from "./models/comment.js";

type SeedUser = { username: string; name: string; email: string; bio: string; password?: string };

const seedUsers: SeedUser[] = [
  { username: "vinoth", name: "Vinoth", email: "vinoth.coderx@gmail.com", bio: "Builder of Pixuntra. Cinema, code, chai.", password: "Vinoth@123" },
  { username: "aanya", name: "Aanya Verma", email: "aanya@pixuntra.io", bio: "Visual storyteller. Mumbai → Lisbon." },
  { username: "leo", name: "Leo Marchetti", email: "leo@pixuntra.io", bio: "Architect. I draw light." },
  { username: "kiyo", name: "Kiyo Tanaka", email: "kiyo@pixuntra.io", bio: "Photographer · 35mm only" },
  { username: "mira", name: "Mira Okafor", email: "mira@pixuntra.io", bio: "Illustrator. Tea. Cats." },
  { username: "felix", name: "Felix Bauer", email: "felix@pixuntra.io", bio: "Type. Grids. Espresso." },
  { username: "noor", name: "Noor Halabi", email: "noor@pixuntra.io", bio: "Plant nerd. Slow design." },
];

type SeedPin = {
  seed: string;
  w: number;
  h: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
};

const seedPins: SeedPin[] = [
  { seed: "studio-1", w: 600, h: 900, title: "Soft studio light", description: "Warm tungsten on linen.", category: "Photography", tags: ["studio", "warm", "portrait"], author: "kiyo" },
  { seed: "atelier", w: 600, h: 700, title: "Atelier mornings", description: "Where I sit, mostly.", category: "Interiors", tags: ["wood", "minimal"], author: "mira" },
  { seed: "skybridge", w: 600, h: 880, title: "Skybridge", description: "Concrete poems.", category: "Architecture", tags: ["brutalist"], author: "leo" },
  { seed: "matcha-set", w: 600, h: 600, title: "Slow matcha set", description: "Saturday ritual.", category: "Food", tags: ["tea", "ceramic"], author: "noor" },
  { seed: "salt-flats", w: 600, h: 800, title: "Salt flats at noon", description: "Sky meets ground.", category: "Travel", tags: ["desert", "minimal"], author: "aanya" },
  { seed: "type-spec", w: 600, h: 800, title: "Specimen — Granat", description: "A serif with shoulders.", category: "Design", tags: ["typography", "specimen"], author: "felix" },
  { seed: "linen-fold", w: 600, h: 760, title: "Linen, folded", description: "Repetition is rest.", category: "Design", tags: ["texture"], author: "mira" },
  { seed: "blue-hour", w: 600, h: 900, title: "Blue hour, Lisbon", description: "Twenty minutes of magic.", category: "Photography", tags: ["city"], author: "aanya" },
  { seed: "leaf-study", w: 600, h: 740, title: "Monstera study", description: "Three leaves, one pose.", category: "Nature", tags: ["plant"], author: "noor" },
  { seed: "kiln", w: 600, h: 800, title: "After the kiln", description: "Glaze that cracked just right.", category: "Art", tags: ["ceramic"], author: "mira" },
  { seed: "concrete-stairs", w: 600, h: 820, title: "Concrete stairs", description: "Shadow does the work.", category: "Architecture", tags: ["stairs", "shadow"], author: "leo" },
  { seed: "linen-suit", w: 600, h: 900, title: "Beige is a season", description: "Soft tailoring.", category: "Fashion", tags: ["tailor", "neutral"], author: "aanya" },
  { seed: "still-life", w: 600, h: 700, title: "Still, with pear", description: "Painters know.", category: "Art", tags: ["still life", "painting"], author: "mira" },
  { seed: "ramen", w: 600, h: 760, title: "Late ramen", description: "Counter seats only.", category: "Food", tags: ["ramen", "tokyo"], author: "kiyo" },
  { seed: "moss", w: 600, h: 820, title: "Moss country", description: "Forest floors of Honshu.", category: "Nature", tags: ["forest", "moss"], author: "noor" },
  { seed: "macbook", w: 600, h: 720, title: "Quiet desk", description: "Only what's needed.", category: "Technology", tags: ["desk", "minimal"], author: "felix" },
  { seed: "bauhaus", w: 600, h: 880, title: "Bauhaus revisit", description: "Primary, still.", category: "Design", tags: ["bauhaus"], author: "felix" },
  { seed: "kyoto", w: 600, h: 780, title: "Kyoto window", description: "Where rain reads.", category: "Travel", tags: ["japan"], author: "kiyo" },
  { seed: "olive-tree", w: 600, h: 900, title: "Olive, alone", description: "Old as light.", category: "Nature", tags: ["tree"], author: "noor" },
  { seed: "marble", w: 600, h: 800, title: "Marble, soft", description: "Curves only the chisel knew.", category: "Art", tags: ["sculpture"], author: "mira" },
  { seed: "loft", w: 600, h: 720, title: "South-facing loft", description: "All the light.", category: "Interiors", tags: ["loft"], author: "leo" },
  { seed: "denim", w: 600, h: 760, title: "Denim, broken-in", description: "Five years and counting.", category: "Fashion", tags: ["denim"], author: "aanya" },
  { seed: "espresso", w: 600, h: 660, title: "Espresso, single", description: "Crema or it didn't happen.", category: "Food", tags: ["coffee"], author: "felix" },
  { seed: "quote-1", w: 600, h: 720, title: "Be slow", description: "Quote — somewhere I read.", category: "Quotes", tags: ["calm"], author: "mira" },
  { seed: "ocean", w: 600, h: 880, title: "Cold Atlantic", description: "Foam holds the form.", category: "Travel", tags: ["sea"], author: "aanya" },
  { seed: "studio2", w: 600, h: 820, title: "Studio with chair", description: "An hour of nothing.", category: "Interiors", tags: ["chair"], author: "leo" },
  { seed: "loom", w: 600, h: 760, title: "On the loom", description: "Warp before weft.", category: "Art", tags: ["weaving"], author: "mira" },
  { seed: "field", w: 600, h: 720, title: "Yellow field", description: "Pollen on the lens.", category: "Photography", tags: ["field"], author: "kiyo" },
  { seed: "code", w: 600, h: 700, title: "Terminal, dark mode", description: "vim still wins.", category: "Technology", tags: ["dev"], author: "felix" },
  { seed: "scarf", w: 600, h: 880, title: "Linen scarf", description: "Wears with everything.", category: "Fashion", tags: ["accessory"], author: "aanya" },
];

const sampleComments = [
  "stunning ✨",
  "saving this for later",
  "the light here is unreal",
  "what's the location?",
  "ok this is goals",
  "took me a moment to scroll past",
];

export async function seedIfEmpty() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const docs = await Promise.all(
    seedUsers.map(async (u) => ({
      username: u.username,
      name: u.name,
      email: u.email,
      bio: u.bio,
      passwordHash: await bcrypt.hash(u.password ?? "demo1234", 10),
      avatar: `https://i.pravatar.cc/200?u=${u.username}`,
    })),
  );
  const created = await User.insertMany(docs);
  const byUsername = new Map(created.map((u) => [u.username, u._id]));

  const now = Date.now();
  const pinDocs = await Pin.insertMany(
    seedPins.map((p, i) => ({
      title: p.title,
      description: p.description,
      imageUrl: `https://picsum.photos/seed/${p.seed}/${p.w}/${p.h}`,
      width: p.w,
      height: p.h,
      category: p.category,
      tags: p.tags,
      author: byUsername.get(p.author),
      createdAt: new Date(now - i * 1000 * 60 * 60),
      likes: pickRandom(created.map((u) => u._id as mongoose.Types.ObjectId), 0, 5),
      saves: pickRandom(created.map((u) => u._id as mongoose.Types.ObjectId), 0, 4),
    })),
  );

  const commentDocs: { pin: mongoose.Types.ObjectId; author: mongoose.Types.ObjectId; content: string }[] = [];
  pinDocs.slice(0, 14).forEach((p, idx) => {
    for (let i = 0; i < (idx % 3) + 1; i++) {
      const author = created[(idx + i) % created.length];
      commentDocs.push({
        pin: p._id,
        author: author._id as mongoose.Types.ObjectId,
        content: sampleComments[(idx + i) % sampleComments.length],
      });
    }
  });
  if (commentDocs.length) await Comment.insertMany(commentDocs);
}

function pickRandom<T>(arr: T[], min: number, max: number): T[] {
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

if (process.argv[1] && process.argv[1].endsWith("seed.ts")) {
  await import("dotenv/config");
  const { connectDB } = await import("./db.js");
  await connectDB();
  await seedIfEmpty();
  console.log("Seeded.");
  await mongoose.disconnect();
  process.exit(0);
}
