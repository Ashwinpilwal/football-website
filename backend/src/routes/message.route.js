import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllMessages, editMessage, markMessagesAsSeen, deleteMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/all-messages/:chatId").get(verifyJWT, getAllMessages);
router.route("/edit-message/:messageId").put(verifyJWT, editMessage);
router.route("/mark-seen/:chatId").patch(verifyJWT, markMessagesAsSeen);
router.route("/delete-message/:messageId").delete(verifyJWT, deleteMessage);

export default router;
