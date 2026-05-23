import { io, type Socket } from "socket.io-client";

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5050").replace(/\/$/, "");

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (socket) return socket;
  socket = io(API_BASE, {
    withCredentials: true,
    path: "/socket.io",
    autoConnect: true,
    transports: ["websocket", "polling"],
  });
  return socket;
}
