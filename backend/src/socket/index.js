import {Server} from 'socket.io'
import { chatSocketHandler } from './chat.socket.js';
import {User} from '../models/user.model.js'

import jwt from "jsonwebtoken"
import { ApiError } from '../utils/ApiError.js';

let io;
const onlineUsers = new Map(); // userId -> Set of socketIds

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        }
    });

    // Socket middleware: authenticate before 'connection' listener
    io.use(async (socket, next) => {
        try {
            // Extract token from cookies, handshake auth, or auth header
            const cookies = socket.handshake.headers.cookie;
            let accessToken = socket.handshake.auth?.token || socket.handshake.headers.authorization?.replace("Bearer ", "");

            if (!accessToken && cookies) {
                accessToken = cookies
                    .split("; ")
                    .find((cookie) => cookie.startsWith("accessToken="))
                    ?.split("=")[1];
            }

            if (!accessToken) {
                return next(new Error("Authentication error: No access token provided"));
            }

            const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            if (!decodedToken?._id) {
                return next(new Error("Authentication error: Invalid access token"));
            }

            const user = await User.findById(decodedToken._id).select("-password -refreshToken");
            if (!user) {
                return next(new Error("Authentication error: User not found"));
            }

            socket.user = user;
            return next();
        } catch (error) {
            console.log("Socket authentication rejected:", error.message);
            return next(new Error("Authentication error: " + (error.message || "Unauthorized")));
        }
    });

    const broadcastOnlineUsers = async () => {
        try {
            const activeUserIds = Array.from(onlineUsers.keys());
            if (activeUserIds.length === 0) {
                io.emit("get-online-users", []);
                return;
            }

            // Find all connected users who have NOT disabled showOnlineStatus
            const visibleUsers = await User.find({
                _id: { $in: activeUserIds },
                showOnlineStatus: { $ne: false },
                "privacy.showOnlineStatus": { $ne: false }
            }).select("_id");

            const visibleUserIds = visibleUsers.map((u) => u._id.toString());
            io.emit("get-online-users", visibleUserIds);
        } catch (err) {
            console.log("Error broadcasting online users:", err);
            io.emit("get-online-users", Array.from(onlineUsers.keys()));
        }
    };

    io.on('connection', (socket) => {
        if (!socket.user?._id) {
            socket.disconnect(true);
            return;
        }

        const userId = socket.user._id.toString();

        // Joining personal user room
        socket.join(userId);
        console.log(`⚡ Socket connected: ${socket.user.username} (${userId})`);

        // Track online status
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);

        // Broadcast updated online users list (filtered by privacy preferences)
        broadcastOnlineUsers();

        socket.on("get-online-users-req", () => {
            broadcastOnlineUsers();
        });

        socket.on("update-privacy-settings", () => {
            broadcastOnlineUsers();
        });

        socket.on('disconnect', async () => {
            console.log(`🔌 Socket disconnected: ${socket.user?.username || socket.id}`);
            if (onlineUsers.has(userId)) {
                onlineUsers.get(userId).delete(socket.id);
                if (onlineUsers.get(userId).size === 0) {
                    onlineUsers.delete(userId);
                    const now = new Date();
                    try {
                        await User.findByIdAndUpdate(userId, { lastSeen: now, isOnline: false });
                        io.emit("user-status-change", { userId, isOnline: false, lastSeen: now });
                    } catch (e) {
                        console.log("Error updating lastSeen on disconnect:", e);
                    }
                }
            }
            broadcastOnlineUsers();
        });

        chatSocketHandler(socket);
    });
};

const getIO = () => io;

export { initializeSocket, getIO };