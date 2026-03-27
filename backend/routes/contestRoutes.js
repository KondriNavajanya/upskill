import express from "express";
import {
  getAllContests,
  getContestById,
  createContest,
  joinContest,
  getContestLeaderboard,
  updateContestStatus
} from "../controllers/contestController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllContests);
router.get("/:id", getContestById);
router.post("/", authMiddleware, createContest);
router.post("/:contestId/join", authMiddleware, joinContest);
router.get("/:contestId/leaderboard", getContestLeaderboard);
router.patch("/:contestId/status", updateContestStatus);

export default router;
