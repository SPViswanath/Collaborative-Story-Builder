import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_BASE_URL, {
  withCredentials: true, // ✅ required for cookie auth
  autoConnect: false, // ✅ we connect only when editor opens
});
