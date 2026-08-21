import { Router } from "express";
import {
  addOrUpdateRating,
  getTurfRatings,
  deleteRating,
} from "../controllers/rating.controller.js";
import { verifyJWT, verifyJWTOptional } from "../middlewares/auth.middleware.js";

const router = Router();

// Get ratings for a turf (checks current user eligibility if logged in)
router.route("/turf/:turfId").get(verifyJWTOptional, getTurfRatings);

// Add or update rating for a turf (strictly verified bookers only)
router.route("/turf/:turfId").post(verifyJWT, addOrUpdateRating);

// Delete rating
router.route("/:ratingId").delete(verifyJWT, deleteRating);

export default router;
