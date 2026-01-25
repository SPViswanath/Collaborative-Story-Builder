import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  withCredentials: true, // ✅ required for cookie auth
  autoConnect: false, // ✅ we connect only when editor opens
});
