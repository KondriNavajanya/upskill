import express from "express";
import {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addComment,
  upvoteDiscussion,
  downvoteDiscussion,
  pinDiscussion
} from "../controllers/discussionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllDiscussions);
router.get("/:id", getDiscussionById);
router.post("/", authMiddleware, createDiscussion);
router.put("/:id", authMiddleware, updateDiscussion);
router.delete("/:id", authMiddleware, deleteDiscussion);
router.post("/:id/comment", authMiddleware, addComment);
router.post("/:id/upvote", authMiddleware, upvoteDiscussion);
router.post("/:id/downvote", authMiddleware, downvoteDiscussion);
router.post("/:id/pin", authMiddleware, pinDiscussion);

export default router;
