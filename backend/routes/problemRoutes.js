import express from "express";
import {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemsByDifficulty,
  getProblemsByTag,
  getAllTags,
  bulkUploadProblems,
  generateProblem
} from "../controllers/problemController.js";
import authMiddleware, { adminMiddleware } from "../middleware/authMiddleware.js";
import aiRateLimitMiddleware from "../middleware/aiRateLimitMiddleware.js";

const router = express.Router();

router.get("/", getAllProblems);
router.get("/tags", getAllTags);
router.get("/difficulty/:difficulty", getProblemsByDifficulty);
router.get("/tag/:tag", getProblemsByTag);
router.post("/bulk", authMiddleware, adminMiddleware, bulkUploadProblems);
router.post(
  "/generate",
  authMiddleware,
  adminMiddleware,
  aiRateLimitMiddleware,
  generateProblem
);
router.get("/:id", getProblemById);
router.post("/", authMiddleware, adminMiddleware, createProblem);
router.put("/:id", authMiddleware, adminMiddleware, updateProblem);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProblem);

export default router;
