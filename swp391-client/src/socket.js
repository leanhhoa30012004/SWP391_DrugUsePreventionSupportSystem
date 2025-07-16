import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; 

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Chỉ connect khi đã có userId
});
