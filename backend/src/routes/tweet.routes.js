import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTweet,
  deleteTweet,
  getAllUserTweets,
  updateTweet,
  getCommunityTweets,
} from "../controllers/tweet.controller.js";

const router = Router();

// Routes
router.route("/create-tweet").post(
  verifyJWT,
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createTweet
);
router.route("/community").get(getCommunityTweets);
router.route("/all-tweets/:username").get(getAllUserTweets);
router.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet);
router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet);

export default router;