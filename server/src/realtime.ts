import type { Server as HTTPServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export function initRealtime(httpServer: HTTPServer, corsOrigin: string[]) {
  io = new SocketIOServer(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    socket.on("pin:join", (pinId: unknown) => {
      if (typeof pinId !== "string" || pinId.length > 64) return;
      socket.join(`pin:${pinId}`);
    });
    socket.on("pin:leave", (pinId: unknown) => {
      if (typeof pinId !== "string") return;
      socket.leave(`pin:${pinId}`);
    });
  });

  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

export function pinRoom(pinId: string) {
  return `pin:${pinId}`;
}
