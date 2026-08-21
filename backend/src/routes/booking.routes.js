import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getBookedSlots,
    createBooking,
    getMyBookings,
    getAdminBookingRequests,
    getTurfBookings,
    updateBookingStatus,
    cancelBooking
} from "../controllers/booking.controller.js";

const router = Router();

// -------------------------
// Public / Availability Routes
// -------------------------
// Get booked/unavailable slots for a turf on a specific date
router.route("/turf/:turfId/booked-slots").get(getBookedSlots);

// -------------------------
// User Routes
// -------------------------
// Create a new booking
router.route("/create-booking").post(verifyJWT, createBooking);

// Get all bookings for the logged-in user (optional ?status= filter)
router.route("/my-bookings").get(verifyJWT, getMyBookings);

// Cancel own booking
router.route("/:bookingId/cancel").patch(verifyJWT, cancelBooking);

// -------------------------
// Admin / Turf Owner Management Routes
// -------------------------
// Get incoming booking requests for Admin / Turf Owner
router.route("/admin/requests").get(verifyJWT, getAdminBookingRequests);

// Get all bookings for a specific turf (optional ?status= filter)
router.route("/turf/:turfId").get(verifyJWT, getTurfBookings);

// Confirm or reject a booking (Admin or Turf Owner)
router.route("/:bookingId/status").patch(verifyJWT, updateBookingStatus);

export default router;
