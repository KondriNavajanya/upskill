import express from "express";
import {
  runCode,
  submitCode,
  getSubmissions,
  getSubmissionById
} from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/run", authMiddleware, runCode);
router.post("/submit", authMiddleware, submitCode);
router.get("/", authMiddleware, getSubmissions);
router.get("/:id", authMiddleware, getSubmissionById);

export default router;
