import { Router } from "express";
const router = Router()

import { upload } from "../middlewares/multer.middleware.js";

// Importing controller
import {deleteVideoById, getAllVideos, getEveryUserVideos, getVideoById, togglePublishStatus, updateVideo, uploadVideo} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


// router.route("/postvideo").post()
router.route("/postvideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
)

router.route("/allvideos").get(getEveryUserVideos)

router.route("/allvideos/:username").get(getAllVideos);

router.route("/video/:videoId").get(getVideoById);

router.route("/delete-video/:videoId").delete(
    verifyJWT,
    deleteVideoById
);


router.route("/change-publish-status/:videoId").patch(
    verifyJWT,
    togglePublishStatus
);

router.route("/updatevideo/:videoId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updateVideo
);


export default router
