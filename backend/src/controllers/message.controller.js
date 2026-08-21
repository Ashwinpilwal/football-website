import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const getAllMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const page = req.query.page ? Number(req.query.page) : null;
    const limit = req.query.limit ? Number(req.query.limit) : (page ? 30 : null);

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new ApiError(400, "Invalid chat ID!");
    }

    // Security Check: Verify user is an authorized participant of this chat
    const chat = await Chat.findOne({
        _id: chatId,
        participants: req.user._id
    });

    if (!chat) {
        throw new ApiError(403, "Access denied: You are not a participant in this conversation.");
    }

    const matchStage = {
        chat: new mongoose.Types.ObjectId(chatId)
    };

    if (page && limit) {
        const totalMessages = await Message.countDocuments(matchStage);
        const totalPages = Math.ceil(totalMessages / limit) || 1;
        const skip = (page - 1) * limit;

        // Fetch newest-first for pagination, then sort chronologically
        const pagedMessages = await Message.aggregate([
            {
                $match: matchStage
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: "users",
                    foreignField: "_id",
                    localField: "sender",
                    pipeline: [
                        {
                            $project: {
                                username: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ],
                    as: "sender"
                }
            },
            {
                $addFields: {
                    sender: {
                        $first: "$sender"
                    }
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            }
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    docs: pagedMessages,
                    totalDocs: totalMessages,
                    limit,
                    page,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                "Messages fetched successfully!"
            )
        );
    }

    const messages = await Message.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "sender",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ],
                as: "sender"
            }
        },
        {
            $addFields: {
                sender: {
                    $first: "$sender"
                }
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "All messages fetched successfully!"
        )
    );
});

const editMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { newContent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new ApiError(400, "Invalid message ID!");
    }

    if (!newContent || !newContent.trim()) {
        throw new ApiError(400, "Message content cannot be empty!");
    }

    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found!");
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized: You can only edit your own messages.");
    }

    message.message = newContent.trim();
    message.isEdited = true;
    await message.save();

    await message.populate("sender", "username fullName avatar");

    return res.status(200).json(
        new ApiResponse(200, message, "Message edited successfully!")
    );
});

const markMessagesAsSeen = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new ApiError(400, "Invalid chat ID!");
    }

    const chat = await Chat.findOne({
        _id: chatId,
        participants: req.user._id
    });

    if (!chat) {
        throw new ApiError(403, "Access denied: You are not a participant in this conversation.");
    }

    await Message.updateMany(
        {
            chat: chatId,
            sender: { $ne: req.user._id },
            isRead: false
        },
        {
            $set: { isRead: true }
        }
    );

    return res.status(200).json(
        new ApiResponse(200, { chatId, isRead: true }, "Messages marked as seen!")
    );
});

const deleteMessage = asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        throw new ApiError(400, "Invalid message ID!");
    }

    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found!");
    }

    const chat = await Chat.findById(message.chat);
    if (!chat) {
        throw new ApiError(404, "Associated chat not found!");
    }

    const isSender = message.sender.toString() === req.user._id.toString();
    const isGroupAdmin = chat.admin && chat.admin.toString() === req.user._id.toString();

    if (!isSender && !isGroupAdmin) {
        throw new ApiError(403, "Unauthorized: You can only delete your own messages or messages in a group you manage.");
    }

    // Find all cascading replies to this message
    const chatId = message.chat;
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

    // Update chat last message if it was deleted
    if (chat.lastMessage && messagesToDeleteIds.includes(chat.lastMessage.toString())) {
        const newestRemaining = await Message.findOne({ chat: chatId }).sort({ createdAt: -1 });
        chat.lastMessage = newestRemaining ? newestRemaining._id : null;
        await chat.save();
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { messageId, chatId, deletedIds: messagesToDeleteIds },
            "Message and all its replies deleted successfully!"
        )
    );
});

export { getAllMessages, editMessage, markMessagesAsSeen, deleteMessage };