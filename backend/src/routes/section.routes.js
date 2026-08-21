import { Router } from "express";

import {
    createSection,
    deleteSection,
    getMySections,
    getSectionById,
    getUserSections,
    updateSection
} from "../controllers/section.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


// Create section

router.route("/create-section").post(
    verifyJWT,
    upload.single("coverImage"),
    createSection
);


// Get all sections of a user
// Used on every profile

router.route("/user/:username").get(
    getUserSections
);


// Get logged-in user's sections
// Used for management/editing workflows

router.route("/my-sections").get(
    verifyJWT,
    getMySections
);


// Get a particular section

router.route("/:sectionId").get(
    getSectionById
);


// Update section

router.route("/:sectionId").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateSection
);


// Delete section

router.route("/:sectionId").delete(
    verifyJWT,
    deleteSection
);


export default router;