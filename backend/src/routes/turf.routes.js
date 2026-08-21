import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js";

import {
    createTurf,
    getAllTurfs,
    getTurfById,
    updateTurf,
    deleteTurf

} from "../controllers/turf.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";


const router = Router(); 


// -------------------------
// Public/User Routes
// -------------------------

// Get nearby turfs/playgrounds
router.get(
    "/nearby",
    verifyJWT,
    getAllTurfs
);


// Get a specific turf/ground
router.get(
    "/:turfId",
    verifyJWT,
    getTurfById
);


// -------------------------
// Admin Routes
// -------------------------

// Create turf/ground
router.post(
    "/create-turf",
    verifyJWT,
    isAdmin,
    upload.array("images", 10), // Allow up to 10 images
    createTurf
);


// Update turf/ground
router.patch(
    "/:turfId",
    verifyJWT,
    isAdmin,
    upload.array("images", 10),
    updateTurf
);


// Delete turf/ground
router.delete(
    "/:turfId",
    verifyJWT,
    isAdmin,
    deleteTurf
);


export default router;