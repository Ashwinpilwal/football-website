import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Rating } from "../models/rating.model.js";
import { Booking } from "../models/booking.model.js";
import { Turf } from "../models/turf.model.js";
import mongoose from "mongoose";

// Add or Update Turf Rating (Strictly for Verified Bookers)
const addOrUpdateRating = asyncHandler(async (req, res) => {
  const { turfId } = req.params;
  const { rating, review } = req.body;

  if (!mongoose.Types.ObjectId.isValid(turfId)) {
    throw new ApiError(400, "Invalid turf ID");
  }

  const turf = await Turf.findById(turfId);
  if (!turf) {
    throw new ApiError(404, "Turf not found");
  }

  // 1. Strict Verification: Check if user has booked this turf
  const hasBooked = await Booking.exists({
    user: req.user._id,
    turf: turfId,
  });

  if (!hasBooked) {
    throw new ApiError(
      403,
      "Access Denied: Only players who have booked this turf can leave a rating and review."
    );
  }

  // 2. Validate rating score (1 to 5)
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    throw new ApiError(400, "Rating must be a valid number between 1 and 5 stars.");
  }

  // 3. Upsert Rating Document (1 review per player per turf)
  const savedRating = await Rating.findOneAndUpdate(
    { turf: turfId, user: req.user._id },
    {
      $set: {
        rating: numRating,
        review: typeof review === "string" ? review.trim() : "",
      },
    },
    { new: true, upsert: true, runValidators: true }
  ).populate("user", "fullName username avatar");

  return res.status(200).json(
    new ApiResponse(
      200,
      savedRating,
      "Thank you! Your turf review has been recorded."
    )
  );
});

// Get Turf Ratings, Breakdown & Eligibility Status
const getTurfRatings = asyncHandler(async (req, res) => {
  const { turfId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(turfId)) {
    throw new ApiError(400, "Invalid turf ID");
  }

  const ratings = await Rating.find({ turf: turfId })
    .populate("user", "fullName username avatar")
    .sort({ createdAt: -1 });

  const totalCount = ratings.length;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sumRatings = 0;

  ratings.forEach((r) => {
    sumRatings += r.rating;
    const rounded = Math.round(r.rating);
    if (distribution[rounded] !== undefined) {
      distribution[rounded] += 1;
    }
  });

  const averageRating = totalCount > 0 ? parseFloat((sumRatings / totalCount).toFixed(1)) : 0;

  // Check current user's eligibility & existing review if authenticated
  let canRate = false;
  let userRating = null;

  if (req.user?._id) {
    canRate = !!(await Booking.exists({ user: req.user._id, turf: turfId }));
    userRating = ratings.find((r) => r.user?._id?.toString() === req.user._id.toString()) || null;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ratings,
        averageRating,
        totalCount,
        distribution,
        canRate,
        userRating,
      },
      "Turf ratings fetched successfully"
    )
  );
});

// Delete Rating
const deleteRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ratingId)) {
    throw new ApiError(400, "Invalid rating ID");
  }

  const ratingDoc = await Rating.findById(ratingId);
  if (!ratingDoc) {
    throw new ApiError(404, "Rating not found");
  }

  // Only the review author can delete their rating
  if (ratingDoc.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own review.");
  }

  await Rating.findByIdAndDelete(ratingId);

  return res.status(200).json(
    new ApiResponse(200, {}, "Review deleted successfully")
  );
});

export { addOrUpdateRating, getTurfRatings, deleteRating };
