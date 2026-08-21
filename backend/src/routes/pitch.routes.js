import { Router } from "express";
import { getNearbyPitches } from "../controllers/pitch.controller.js";

const router = Router();

router.get("/nearby", getNearbyPitches);

export default router;
