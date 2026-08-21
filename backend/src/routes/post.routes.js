import { Router } from "express";

import {
    createPost,
    getUserPosts,
    getPostById,
    getAllPosts,
    updatePost,
    deletePost,
    updatePostSection,
    getSectionPosts
} from "../controllers/post.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


// Create post

router.route("/create-post").post(
    verifyJWT,
    upload.fields([
        {
            name: "media",
            maxCount: 10
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    createPost
);


// Get all posts of a user

router.route("/user/:userId").get(
    getUserPosts
);


// Get all posts belonging to a section
// IMPORTANT: must come before /:postId

router.route("/section/:sectionId").get(
    getSectionPosts
);


// Get all posts from every user
router.route("/all-posts").get(getAllPosts);



// Get a particular post

router.route("/:postId").get(
    getPostById
);


// Update post

router.route("/:postId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updatePost
);


// Delete post

router.route("/:postId").delete(
    verifyJWT,
    deletePost
);


// Move/add/remove post from section

router.route("/:postId/section").patch(
    verifyJWT,
    updatePostSection
);


export default router;