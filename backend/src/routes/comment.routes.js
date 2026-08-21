import { Router } from "express";
import { addComment, deleteComment, editComment, showAllComments } from "../controllers/comment.controller.js";
import { verifyJWT, verifyJWTOptional } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-comment/:postId").post(verifyJWT, addComment);

router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment);

router.route("/show-all-comments/:postId").get(verifyJWTOptional, showAllComments);

router.route("/edit-comment/:commentId").post(verifyJWT, editComment);


export default router;