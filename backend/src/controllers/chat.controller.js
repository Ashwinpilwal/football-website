import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const getChatId = asyncHandler(async (req, res) => {
    const receiverId = req.body.receiverId;

    // Finding chat
    let chatId = await Chat.findOne({
        isGroupChat: false,
        participants: {
            $all: [receiverId, req.user._id]
        }
    })
    .populate("participants", "username fullName avatar showOnlineStatus privacy lastSeen")
    .populate("admin", "username fullName avatar");

    if (!chatId) {
        chatId = await Chat.create({
            isGroupChat: false,
            participants: [receiverId, req.user._id]
        });

        const populated = await Chat.findById(chatId._id)
            .populate("participants", "username fullName avatar showOnlineStatus privacy lastSeen")
            .populate("admin", "username fullName avatar");

        return res.status(201).json(
            new ApiResponse(
                200,
                populated,
                "Chat Id created!"
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            chatId,
            "Chat Id found"
        )
    );
});

// -------------------------Group Chat-------------------------

const getAllGroupChats = asyncHandler(async (req, res) => {
    const groups = await Chat.find({
        isGroupChat: true,
        participants: {
            $in: [req.user._id]
        }
    })
    .populate("participants", "username fullName avatar showOnlineStatus privacy lastSeen")
    .populate("admin", "username fullName avatar")
    .sort({ updatedAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            groups,
            "Group chats found"
        )
    );
});

const createGroupChat = asyncHandler(async (req, res) => {
    const { groupName, participants = [] } = req.body;

    if (!groupName || !groupName.trim()) {
        throw new ApiError(400, "Group name is required!");
    }

    const uniqueParticipants = [
        ...new Set((Array.isArray(participants) ? participants : []).map((id) => id.toString()))
    ];

    const newGroupChat = await Chat.create({
        participants: [req.user._id, ...uniqueParticipants],
        groupName: groupName.trim(),
        admin: req.user._id,
        isGroupChat: true
    });

    if (!newGroupChat) throw new ApiError(400, "Unable to create group-chat!");

    const populated = await Chat.findById(newGroupChat._id)
        .populate("participants", "username fullName avatar")
        .populate("admin", "username fullName avatar");

    return res.status(201).json(
        new ApiResponse(
            201,
            populated,
            "Group chat created!"
        )
    );
});

const getGroupChatDetails = asyncHandler(async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        throw new ApiError(400, "chatId is required!");
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new ApiError(400, "chatId not valid!");
    }

    const groupChatDetails = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
        participants: {
            $in: [req.user._id]
        }
    })
    .populate("participants", "username fullName avatar")
    .populate("admin", "username fullName avatar");

    if (!groupChatDetails) {
        throw new ApiError(404, "Group chat details not found!");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            groupChatDetails,
            "Group chat details fetched"
        )
    );
});

const getAllUserChats = asyncHandler(async (req, res) => {
    const chats = await Chat.find({
        participants: {
            $in: [req.user._id]
        }
    })
    .populate("participants", "username fullName avatar showOnlineStatus privacy lastSeen")
    .populate("admin", "username fullName avatar")
    .populate({
        path: "lastMessage",
        populate: {
            path: "sender",
            select: "username fullName avatar"
        }
    })
    .sort({ updatedAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            chats,
            "User chats retrieved successfully"
        )
    );
});

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getIO } from "../socket/index.js";

const updateGroupChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { groupName } = req.body;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
        throw new ApiError(400, "Valid chatId is required!");
    }

    const chat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
        participants: {
            $in: [req.user._id]
        }
    });

    if (!chat) {
        throw new ApiError(404, "Squad Group Chat not found or you are not a member of this chat!");
    }

    if (groupName && groupName.trim()) {
        chat.groupName = groupName.trim();
    }

    let groupIconLocalPath;
    if (req.file) {
        groupIconLocalPath = req.file.path;
    } else if (req.files?.groupIcon && req.files.groupIcon.length > 0) {
        groupIconLocalPath = req.files.groupIcon[0].path;
    }

    if (groupIconLocalPath) {
        const uploaded = await uploadOnCloudinary(groupIconLocalPath);
        if (uploaded?.url) {
            chat.groupIcon = uploaded.url;
        }
    } else if (req.body.groupIcon && typeof req.body.groupIcon === "string" && req.body.groupIcon.trim()) {
        chat.groupIcon = req.body.groupIcon.trim();
    }

    await chat.save();

    const populated = await Chat.findById(chat._id)
        .populate("participants", "username fullName avatar")
        .populate("admin", "username fullName avatar")
        .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "username fullName avatar"
            }
        });

    // Real-time broadcast to all group members
    try {
        const io = getIO();
        if (io) {
            for (const participant of populated.participants) {
                const pId = (participant._id || participant).toString();
                io.to(pId).emit("group-updated", populated);
            }
        }
    } catch (socketErr) {
        console.log("Socket broadcast group-updated error:", socketErr);
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            populated,
            "Squad Group updated successfully!"
        )
    );
});

const addMembersToGroupChat = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const { memberIds } = req.body;

    if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
        throw new ApiError(400, "Valid chatId is required!");
    }

    const chat = await Chat.findOne({
        _id: new mongoose.Types.ObjectId(chatId),
        isGroupChat: true,
        participants: {
            $in: [req.user._id]
        }
    });

    if (!chat) {
        throw new ApiError(404, "Squad Group Chat not found or you are not a member of this chat!");
    }

    const incomingIds = Array.isArray(memberIds) ? memberIds : [memberIds];
    const validIds = incomingIds
        .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

    if (validIds.length === 0) {
        throw new ApiError(400, "Please provide at least one valid member ID to add.");
    }

    const currentMemberSet = new Set(chat.participants.map((p) => p.toString()));
    let newMembersCount = 0;

    for (const memberId of validIds) {
        if (!currentMemberSet.has(memberId.toString())) {
            chat.participants.push(memberId);
            currentMemberSet.add(memberId.toString());
            newMembersCount++;
        }
    }

    if (newMembersCount > 0) {
        await chat.save();
    }

    const populated = await Chat.findById(chat._id)
        .populate("participants", "username fullName avatar showOnlineStatus privacy lastSeen")
        .populate("admin", "username fullName avatar")
        .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "username fullName avatar"
            }
        });

    // Real-time broadcast to all group members
    try {
        const io = getIO();
        if (io) {
            for (const participant of populated.participants) {
                const pId = (participant._id || participant).toString();
                io.to(pId).emit("group-updated", populated);
            }
        }
    } catch (socketErr) {
        console.log("Socket broadcast group-updated error:", socketErr);
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            populated,
            `Successfully added ${newMembersCount} member(s) to squad!`
        )
    );
});

export {
    getChatId,
    getAllGroupChats,
    createGroupChat,
    getGroupChatDetails,
    getAllUserChats,
    updateGroupChat,
    addMembersToGroupChat
};