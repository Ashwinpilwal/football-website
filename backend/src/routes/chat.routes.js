import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllGroupChats,
  getChatId,
  createGroupChat,
  getGroupChatDetails,
  getAllUserChats,
  updateGroupChat,
  addMembersToGroupChat,
} from "../controllers/chat.controller.js";

const router = Router();

router.route("/get-chatId").post(verifyJWT, getChatId);
router.route("/my-chats").get(verifyJWT, getAllUserChats);

router.route("/get-all-group-chats").get(verifyJWT, getAllGroupChats);
router.route("/create-group-chat").post(verifyJWT, createGroupChat);
router.route("/get-group-chat-details/:chatId").get(verifyJWT, getGroupChatDetails);
router.route("/update-group-chat/:chatId").put(verifyJWT, upload.single("groupIcon"), updateGroupChat);
router.route("/add-members/:chatId").post(verifyJWT, addMembersToGroupChat);

export default router;
