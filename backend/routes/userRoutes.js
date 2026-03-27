import express from "express";
import {
  getLeaderboard,
  getProfile,
  getProgress,
  updatePreferences
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/profile", getProfile);
router.get("/progress", getProgress);
router.get("/leaderboard", getLeaderboard);
router.put("/preferences", updatePreferences);

export default router;
