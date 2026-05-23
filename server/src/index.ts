import "dotenv/config";
import http from "node:http";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./db.js";
import { seedIfEmpty } from "./seed.js";
import authRoutes from "./routes/auth.js";
import pinRoutes from "./routes/pins.js";
import userRoutes from "./routes/users.js";
import { initRealtime } from "./realtime.js";

const app = express();

const PORT = Number(process.env.PORT ?? 5050);
const CORS_ORIGIN =
  process.env.CORS_ORIGIN ?? "http://localhost:3000,http://localhost:3001";

app.use(
  cors({
    origin: CORS_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "pixuntra-api",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/pins", pinRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[error]", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ error: message });
  },
);

async function start() {
  const { uri } = await connectDB();
  console.log(`[db] connected → ${redact(uri)}`);

  await seedIfEmpty();

  const httpServer = http.createServer(app);
  const origins = CORS_ORIGIN.split(",").map((s) => s.trim()).filter(Boolean);
  initRealtime(httpServer, origins);

  httpServer.listen(PORT, () => {
    console.log(`[api] listening on http://localhost:${PORT}`);
    console.log(`[api] CORS origin → ${CORS_ORIGIN}`);
    console.log(`[realtime] socket.io ready on /socket.io`);
  });
}

function redact(uri: string) {
  return uri.replace(/:\/\/[^@]+@/, "://***@");
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
