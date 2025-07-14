import { io } from "socket.io-client";
const socket = io("http://localhost:3000"); // Đổi thành địa chỉ server của bạn
export default socket;
