import { Router } from "express";
import {
  handleAIChat,
  handleAIChatStream,
  handleAnalyzeMatch,
  handlePredictMatch,
  handleExplainStrategy,
  handleGetFixtures,
} from "../controllers/footballAi.controller.js";

const router = Router();

// Public / Authenticated AI routes
router.post("/chat", handleAIChat);
router.post("/chat/stream", handleAIChatStream);
router.post("/analyze-match", handleAnalyzeMatch);
router.post("/predict-match", handlePredictMatch);
router.post("/explain-strategy", handleExplainStrategy);
router.get("/fixtures", handleGetFixtures);

export default router;
