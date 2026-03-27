import express from "express";
import {
  getCareerSuggestion,
  getExplanation,
  codeReview,
  generateSkillGapAnalysis,
  generateUpskillRoadmap,
  generateCareerPath,
  getSkillAnalysis
} from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/explain", getExplanation);
router.post("/career", getCareerSuggestion);
router.post("/code-review", codeReview);
router.post("/skill-gap", generateSkillGapAnalysis);
router.post("/roadmap", generateUpskillRoadmap);
router.post("/career-path", generateCareerPath);
router.get("/analysis", getSkillAnalysis);

export default router;
