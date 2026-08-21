import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Booking } from "../models/booking.model.js";
import { Turf } from "../models/turf.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { getIO } from "../socket/index.js";
import mongoose from "mongoose";

// Helper to compute exact expiry datetime from match date and slot end times
const calculateExpiresAt = (dateStr, slots) => {
    const baseDate = new Date(dateStr);
    let latestHour = 23;
    let latestMinute = 59;

    if (Array.isArray(slots) && slots.length > 0) {
        let maxMinutes = -1;
        slots.forEach((s) => {
            const timeStr = s.endTime || s.startTime;
            if (timeStr) {
                const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
                if (match) {
                    let h = parseInt(match[1], 10);
                    const m = parseInt(match[2], 10);
                    const p = match[3]?.toUpperCase();
                    if (p === "PM" && h < 12) h += 12;
                    if (p === "AM" && h === 12) h = 0;
                    const totalM = h * 60 + m;
                    if (totalM > maxMinutes) {
                        maxMinutes = totalM;
                        latestHour = h;
                        latestMinute = m;
                    }
                }
            }
        });
    }

    const expiry = new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        latestHour,
        latestMinute,
        0,
        0
    );

    return expiry;
};

// Auto-purge expired bookings from DB
const purgeExpiredBookings = async () => {
    try {
        await Booking.deleteMany({ expiresAt: { $lt: new Date() } });
    } catch (err) {
        console.error("Purge expired bookings error:", err);
    }
};

// Get booked / unavailable slots for a turf on a specific date
const getBookedSlots = asyncHandler(async (req, res) => {
    const { turfId } = req.params;
    const { date } = req.query;

    if (!mongoose.Types.ObjectId.isValid(turfId)) {
        throw new ApiError(400, "Invalid turf ID!");
    }

    if (!date) {
        throw new ApiError(400, "Date query parameter is required!");
    }

    // Clean up expired tickets from DB
    await purgeExpiredBookings();

    const queryDate = new Date(date);
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate(), 23, 59, 59, 999);

    const activeBookings = await Booking.find({
        turf: turfId,
        date: { $gte: startOfDay, $lte: endOfDay },
        expiresAt: { $gte: new Date() },
        status: { $in: ["pending", "confirmed"] }
    }).select("slots status user expiresAt");

    const bookedSlots = [];
    activeBookings.forEach((b) => {
        if (Array.isArray(b.slots)) {
            b.slots.forEach((s) => {
                bookedSlots.push({
                    startTime: s.startTime,
                    endTime: s.endTime,
                    status: b.status,
                    expiresAt: b.expiresAt,
                    isOwnBooking: req.user ? b.user.toString() === req.user._id.toString() : false
                });
            });
        }
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            { bookedSlots, bookingsCount: activeBookings.length },
            "Booked slots retrieved successfully"
        )
    );
});

// Create a new booking & notify selected Squad Group Chat
const createBooking = asyncHandler(async (req, res) => {
    const { turfId, date, slots, chatId } = req.body;

    if (!turfId || !date || !slots || !Array.isArray(slots) || slots.length === 0) {
        throw new ApiError(400, "turfId, date, and at least one slot are required!");
    }

    if (!mongoose.Types.ObjectId.isValid(turfId)) {
        throw new ApiError(400, "Invalid turf ID!");
    }

    const turf = await Turf.findById(turfId);
    if (!turf) {
        throw new ApiError(404, "Turf not found!");
    }

    // Validate slot structure
    for (const slot of slots) {
        if (!slot.startTime || !slot.endTime) {
            throw new ApiError(400, "Each slot must have a startTime and endTime!");
        }
    }

    // Clean up past expired bookings first
    await purgeExpiredBookings();

    // Calculate expiry datetime
    const expiresAt = calculateExpiresAt(date, slots);
    if (expiresAt < new Date()) {
        throw new ApiError(400, "Cannot book a time slot that has already passed in the current day!");
    }

    // Check for double booking
    const bookingDate = new Date(date);
    const startOfDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate(), 23, 59, 59, 999);

    const existingBookings = await Booking.find({
        turf: turfId,
        date: { $gte: startOfDay, $lte: endOfDay },
        expiresAt: { $gte: new Date() },
        status: { $in: ["pending", "confirmed"] }
    });

    const alreadyBookedTimes = new Set();
    existingBookings.forEach((b) => {
        if (Array.isArray(b.slots)) {
            b.slots.forEach((s) => alreadyBookedTimes.add(s.startTime));
        }
    });

    const conflicts = slots.filter((s) => alreadyBookedTimes.has(s.startTime));
    if (conflicts.length > 0) {
        throw new ApiError(
            400,
            `Slot ${conflicts.map((c) => c.startTime).join(", ")} has already been booked or is awaiting confirmation!`
        );
    }

    // Check for linked Squad Group Chat to announce to everyone in the squad
    let linkedChat = null;
    if (chatId && mongoose.Types.ObjectId.isValid(chatId)) {
        linkedChat = await Chat.findOne({
            _id: chatId,
            participants: { $in: [req.user._id] }
        });
    }

    const booking = await Booking.create({
        user: req.user._id,
        turf: turfId,
        chat: linkedChat ? linkedChat._id : null,
        date: new Date(date),
        slots,
        expiresAt,
        status: "pending"
    });

    // If squad chat was selected, create announcement message & broadcast live socket to everyone
    if (linkedChat) {
        try {
            const slotTimes = slots.map((s) => `${s.startTime} - ${s.endTime}`).join(", ");
            const formattedDate = new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric"
            });

            const announcementText = `⚽ MATCHDAY RESERVED!\n🏟️ Venue: ${turf.name}\n📍 Location: ${turf.address}\n📅 Date: ${formattedDate}\n⏰ Time Slots: ${slotTimes}\n👤 Booked by @${req.user.username}`;

            const matchMessage = await Message.create({
                chat: linkedChat._id,
                sender: req.user._id,
                message: announcementText
            });

            await matchMessage.populate("sender", "username fullName avatar");

            linkedChat.lastMessage = matchMessage._id;
            await linkedChat.save();

            const io = getIO();
            if (io && Array.isArray(linkedChat.participants)) {
                linkedChat.participants.forEach((pId) => {
                    io.to(pId.toString()).emit("receive-message", matchMessage);
                });
            }
        } catch (msgErr) {
            console.error("Squad chat announcement error:", msgErr);
        }
    }

    const populatedBooking = await Booking.findById(booking._id)
        .populate("turf", "name address type pricePerHour phone openingTime closingTime images owner")
        .populate("chat", "groupName groupIcon isGroupChat participants")
        .populate("user", "username fullName avatar email");

    return res.status(201).json(
        new ApiResponse(
            201,
            populatedBooking,
            "Booking request sent to admin and squad notified!"
        )
    );
});

// Get all bookings of the logged-in user
const getMyBookings = asyncHandler(async (req, res) => {
    // Purge expired bookings from DB
    await purgeExpiredBookings();

    const { status } = req.query;
    const filter = {
        user: req.user._id,
    };

    if (status === "active") {
        filter.expiresAt = { $gte: new Date() };
        filter.status = { $in: ["pending", "confirmed"] };
    } else if (status && status !== "all") {
        const validStatuses = ["pending", "confirmed", "rejected", "cancelled"];
        if (validStatuses.includes(status)) {
            filter.status = status;
        }
    }

    const bookings = await Booking.find(filter)
        .populate({
            path: "turf",
            select: "name address type pricePerHour phone openingTime closingTime images owner",
            populate: {
                path: "owner",
                select: "fullName username avatar phone email isOnline"
            }
        })
        .populate("chat", "groupName isGroupChat")
        .sort({ date: 1, createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "Your active bookings fetched successfully!"
        )
    );
});

// Get all incoming booking requests for Admin / Turf Owner
const getAdminBookingRequests = asyncHandler(async (req, res) => {
    // Purge expired bookings from DB
    await purgeExpiredBookings();

    let filter = {
        expiresAt: { $gte: new Date() }
    };

    // Only turfs owned/created by this admin/user
    const ownedTurfs = await Turf.find({ owner: req.user._id }).select("_id");
    const turfIds = ownedTurfs.map((t) => t._id);
    filter.turf = { $in: turfIds };

    const { status } = req.query;
    if (status && status !== "all") {
        filter.status = status;
    }

    const bookings = await Booking.find(filter)
        .populate("turf", "name address type pricePerHour phone openingTime closingTime images owner")
        .populate("user", "username fullName avatar email")
        .populate("chat", "groupName isGroupChat")
        .sort({ date: 1, createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "Admin booking requests fetched successfully!"
        )
    );
});

// Get all bookings for a specific turf
const getTurfBookings = asyncHandler(async (req, res) => {
    const { turfId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(turfId)) {
        throw new ApiError(400, "Invalid turf ID!");
    }

    const turf = await Turf.findById(turfId);
    if (!turf) {
        throw new ApiError(404, "Turf not found!");
    }

    const isAuthorized = req.user.role === "admin" || (turf.owner && turf.owner.equals(req.user._id));
    if (!isAuthorized) {
        throw new ApiError(403, "You are not authorized to view bookings for this turf!");
    }

    // Purge expired bookings from DB
    await purgeExpiredBookings();

    const { status } = req.query;
    const filter = {
        turf: turfId,
        expiresAt: { $gte: new Date() }
    };

    if (status && status !== "all") {
        const validStatuses = ["pending", "confirmed", "rejected", "cancelled"];
        if (validStatuses.includes(status)) {
            filter.status = status;
        }
    }

    const bookings = await Booking.find(filter)
        .populate("user", "username fullName avatar email")
        .populate("chat", "groupName isGroupChat")
        .sort({ date: 1, createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            bookings,
            "Turf bookings fetched successfully!"
        )
    );
});

// Update booking status (Admin or Turf Owner confirms or rejects)
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID!");
    }

    const allowedStatuses = ["confirmed", "rejected"];
    if (!status || !allowedStatuses.includes(status)) {
        throw new ApiError(400, `Status must be one of: ${allowedStatuses.join(", ")}`);
    }

    const booking = await Booking.findById(bookingId).populate("turf");
    if (!booking) {
        throw new ApiError(404, "Booking not found or has already expired!");
    }

    // Check authorization: Admin or Turf Owner
    const isAuthorized =
        req.user.role === "admin" ||
        (booking.turf && booking.turf.owner && booking.turf.owner.equals(req.user._id));

    if (!isAuthorized) {
        throw new ApiError(403, "You are not authorized to confirm/reject this booking!");
    }

    if (booking.status === "cancelled") {
        throw new ApiError(400, "Cannot update a booking that was already cancelled by the user!");
    }

    booking.status = status;
    await booking.save();

    // If confirmed and linked to chat, post announcement message & broadcast live socket to all chat participants
    if (status === "confirmed" && booking.chat) {
        try {
            const slotTimes =
                booking.slots?.map((s) => `${s.startTime} - ${s.endTime}`).join(", ") ||
                "Standard";
            const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            });

            const approvalMessageText = `🎉 MATCHDAY PASS APPROVED & CONFIRMED!\n🏟️ Venue: ${booking.turf?.name || "Football Pitch"}\n📍 Location: ${booking.turf?.address || "Ground"}\n📅 Date: ${formattedDate}\n⏰ Time Slots: ${slotTimes}\n✅ Approved by Ground Admin: @${req.user.username}\n🎟️ Match Pass is now active. Everyone get your boots ready! ⚽🔥`;

            const matchPassPayload = {
                bookingId: booking._id,
                turfId: booking.turf?._id || booking.turf,
                turfName: booking.turf?.name || "Football Pitch",
                turfAddress: booking.turf?.address || "Ground Pitch",
                date: booking.date,
                slots: booking.slots,
                expiresAt: booking.expiresAt,
                approvedBy: req.user.username,
                status: "confirmed"
            };

            const matchMessage = await Message.create({
                chat: booking.chat,
                sender: req.user._id,
                message: approvalMessageText,
                attachment: "match_pass",
                matchPass: matchPassPayload
            });

            await matchMessage.populate("sender", "username fullName avatar");

            const linkedChat = await Chat.findById(booking.chat);
            if (linkedChat) {
                linkedChat.lastMessage = matchMessage._id;
                await linkedChat.save();

                const io = getIO();
                if (io && Array.isArray(linkedChat.participants)) {
                    linkedChat.participants.forEach((pId) => {
                        io.to(pId.toString()).emit("receive-message", matchMessage);
                    });
                }
            }
        } catch (chatErr) {
            console.error("Chat approval broadcast error:", chatErr);
        }
    }

    const updatedBooking = await Booking.findById(bookingId)
        .populate("turf", "name address type pricePerHour phone openingTime closingTime images")
        .populate("user", "username fullName avatar email")
        .populate("chat", "groupName isGroupChat");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedBooking,
            `Booking has been ${status} successfully and chat members notified!`
        )
    );
});

// Cancel a booking (User — owner only)
const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        throw new ApiError(400, "Invalid booking ID!");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Booking not found or has already expired!");
    }

    if (!booking.user.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to cancel this booking!");
    }

    if (booking.status === "cancelled") {
        throw new ApiError(400, "Booking is already cancelled!");
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            "Booking cancelled successfully!"
        )
    );
});

export {
    getBookedSlots,
    createBooking,
    getMyBookings,
    getAdminBookingRequests,
    getTurfBookings,
    updateBookingStatus,
    cancelBooking
};
