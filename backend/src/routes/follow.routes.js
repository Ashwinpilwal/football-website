import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { followToggle, getUserFollowers, getUserFollowing, getMyFollowers, getMyFollowing } from "../controllers/follow.controller.js";

const router = Router();


// Follow / unfollow

router.route("/toggle-follow/:username").post(verifyJWT, followToggle);


// Public user's followers/following

router.route("/followers/:username").get(getUserFollowers);

router.route("/following/:username").get(getUserFollowing);


// Logged-in user's followers/following

router.route("/my-followers").get(verifyJWT, getMyFollowers);

router.route("/my-following").get(verifyJWT, getMyFollowing);


export default router;