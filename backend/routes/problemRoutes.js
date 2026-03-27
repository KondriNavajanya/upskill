import express from "express";
import {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemsByDifficulty,
  getProblemsByTag,
  getAllTags
} from "../controllers/problemController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProblems);
router.get("/tags", getAllTags);
router.get("/difficulty/:difficulty", getProblemsByDifficulty);
router.get("/tag/:tag", getProblemsByTag);
router.get("/:id", getProblemById);
router.post("/", authMiddleware, createProblem);
router.put("/:id", authMiddleware, updateProblem);
router.delete("/:id", authMiddleware, deleteProblem);

export default router;
