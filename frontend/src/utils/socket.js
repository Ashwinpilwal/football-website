import {io} from "socket.io-client";

console.log("Creating socket...")

export const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
    withCredentials: true
})