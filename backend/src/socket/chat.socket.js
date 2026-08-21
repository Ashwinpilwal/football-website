import { getIO } from "./index.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const chatSocketHandler = (socket) => {
    const io = getIO();

    // 1. Send Message
    socket.on('send-message', async ({message, chatId, attachment = "text", sharedPost = null, matchPass = null, replyTo = null}) => {
        try {
            const chat = await Chat.findById(chatId);
            if(!chat) return;
            
            const isParticipant = chat.participants.some(
                id => id.toString() === socket.user._id.toString()
            );
            if(!isParticipant) return;
            
            const newMessage = await Message.create({
                chat: chatId,
                sender: socket.user._id,
                message: message,
                attachment: attachment || "text",
                sharedPost: sharedPost || null,
                matchPass: matchPass || null,
                replyTo: replyTo || null
            });

            if(!newMessage) return;

            await newMessage.populate("sender", "username fullName avatar");

            chat.lastMessage = newMessage._id;
            await chat.save();
            
            // Broadcasting to all participants of this chat
            for(const participant of chat.participants){
                io.to(participant.toString()).emit("receive-message", newMessage);
            }
        } catch(error){
            console.log("send-message socket error: ", error);
        }
    });

    // 2. Edit Message
    socket.on('edit-message', async ({messageId, chatId, newContent}) => {
        try {
            if (!messageId || !newContent || !newContent.trim()) return;

            const chat = await Chat.findById(chatId);
            if (!chat) return;

            const message = await Message.findById(messageId);
            if (!message) return;

            // Security check: Only original sender can edit
            if (message.sender.toString() !== socket.user._id.toString()) return;

            message.message = newContent.trim();
            message.isEdited = true;
            await message.save();

            await message.populate("sender", "username fullName avatar");

            for (const participant of chat.participants) {
                io.to(participant.toString()).emit("message-edited", {
                    _id: message._id,
                    chatId: chat._id,
                    message: message.message,
                    isEdited: true,
                    updatedAt: message.updatedAt
                });
            }
        } catch (error) {
            console.log("edit-message socket error:", error);
        }
    });

    // 3. Mark Messages as Seen (Read Receipt)
    socket.on('mark-seen', async ({chatId}) => {
        try {
            if (!chatId) return;

            const chat = await Chat.findById(chatId);
            if (!chat) return;

            const isParticipant = chat.participants.some(
                id => id.toString() === socket.user._id.toString()
            );
            if (!isParticipant) return;

            await Message.updateMany(
                {
                    chat: chatId,
                    sender: { $ne: socket.user._id },
                    isRead: false
                },
                {
                    $set: { isRead: true }
                }
            );

            for (const participant of chat.participants) {
                io.to(participant.toString()).emit("messages-seen", {
                    chatId,
                    seenBy: socket.user._id
                });
            }
        } catch (error) {
            console.log("mark-seen socket error:", error);
        }
    });

    // 4. Delete Message (and cascading replies)
    socket.on('delete-message', async ({messageId, chatId}) => {
        try {
            if (!messageId || !chatId) return;

            const chat = await Chat.findById(chatId);
            if (!chat) return;

            const message = await Message.findById(messageId);
            if (!message) return;

            const isSender = message.sender.toString() === socket.user._id.toString();
            const isGroupAdmin = chat.admin && chat.admin.toString() === socket.user._id.toString();

            if (!isSender && !isGroupAdmin) return;

            let messagesToDeleteIds = [messageId.toString()];
            let queue = [messageId.toString()];

            while (queue.length > 0) {
                const currentParentId = queue.shift();
                const replies = await Message.find({
                    chat: chatId,
                    $or: [
                        { "replyTo.messageId": currentParentId },
                        { "replyTo.messageId": new mongoose.Types.ObjectId(currentParentId) },
                        { "replyTo._id": currentParentId },
                        { "replyTo._id": new mongoose.Types.ObjectId(currentParentId) }
                    ]
                }).select("_id");

                for (const r of replies) {
                    const rId = r._id.toString();
                    if (!messagesToDeleteIds.includes(rId)) {
                        messagesToDeleteIds.push(rId);
                        queue.push(rId);
                    }
                }
            }

            await Message.deleteMany({ _id: { $in: messagesToDeleteIds } });

            if (chat.lastMessage && messagesToDeleteIds.includes(chat.lastMessage.toString())) {
                const newestRemaining = await Message.findOne({ chat: chatId }).sort({ createdAt: -1 });
                chat.lastMessage = newestRemaining ? newestRemaining._id : null;
                await chat.save();
            }

            for (const participant of chat.participants) {
                io.to(participant.toString()).emit("messages-deleted", {
                    chatId,
                    deletedIds: messagesToDeleteIds
                });
            }
        } catch (error) {
            console.log("delete-message socket error:", error);
        }
    });
};   

export { chatSocketHandler };
