import {Router} from "express"
import { addtoPlaylist, createPlaylist, deleteFromPlaylist, deletePlaylist, showAllPlaylist, updatePlaylist } from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { decrypt } from "dotenv"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

// Declaring all routes
router.route('/create-playlist').post(
    verifyJWT,
    upload.single("coverImage"),
    createPlaylist
)

router.route('/show-playlists').get(verifyJWT, showAllPlaylist)

router.route('/add-to-playlist/:videoId').patch(verifyJWT, addtoPlaylist)

router.route('/delete-from-playlist/:videoId').delete(verifyJWT, deleteFromPlaylist)

router.route('/update-playlist/:playlistId').post(
    verifyJWT,
    upload.single("coverImage"),
    updatePlaylist
)

router.route('/delete-playlist').delete(verifyJWT, deletePlaylist)


export default router