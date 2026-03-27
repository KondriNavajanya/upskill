import express from "express";
import {
  generateTest,
  getBookmarks,
  getTestHistory,
  submitTest
} from "../controllers/testController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/generate", generateTest);
router.post("/submit", submitTest);
router.get("/history", getTestHistory);
router.get("/bookmarks", getBookmarks);

export default router;
