import Discussion from "../models/Discussion.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllDiscussions = asyncHandler(async (req, res) => {
  const { problemId, category, limit = 20, page = 1, sort = "-createdAt" } = req.query;
  let query = {};

  if (problemId) {
    query.problemId = problemId;
  }

  if (category) {
    query.category = category;
  }

  const skip = (page - 1) * limit;
  const discussions = await Discussion.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort(sort)
    .populate("userId", "name avatar")
    .populate("problemId", "title slug");

  const total = await Discussion.countDocuments(query);

  res.json({
    discussions,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

export const getDiscussionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("userId", "name avatar")
    .populate("comments.userId", "name avatar");

  if (!discussion) {
    return res.status(404).json({ message: "Discussion not found" });
  }

  res.json(discussion);
});

export const createDiscussion = asyncHandler(async (req, res) => {
  const { problemId, title, content, code, language, category } = req.body;
  const userId = req.user._id;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const discussion = await Discussion.create({
    problemId,
    userId,
    title,
    content,
    code,
    language,
    category: category || "Question"
  });

  await discussion.populate("userId", "name avatar");

  res.status(201).json(discussion);
});

export const updateDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, code, category } = req.body;

  const discussion = await Discussion.findById(id);
  if (!discussion) {
    return res.status(404).json({ message: "Discussion not found" });
  }

  if (discussion.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  discussion.title = title || discussion.title;
  discussion.content = content || discussion.content;
  discussion.code = code;
  discussion.category = category || discussion.category;

  await discussion.save();
  res.json(discussion);
});

export const deleteDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findById(id);
  if (!discussion) {
    return res.status(404).json({ message: "Discussion not found" });
  }

  if (discussion.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  await Discussion.findByIdAndDelete(id);
  res.json({ message: "Discussion deleted successfully" });
});

export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  const discussion = await Discussion.findByIdAndUpdate(
    id,
    {
      $push: {
        comments: {
          userId,
          content,
          createdAt: new Date()
        }
      }
    },
    { new: true }
  ).populate("comments.userId", "name avatar");

  if (!discussion) {
    return res.status(404).json({ message: "Discussion not found" });
  }

  res.json(discussion);
});

export const upvoteDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findByIdAndUpdate(
    id,
    { $inc: { upvotes: 1 } },
    { new: true }
  );

  if (!discussion) {
    return res.status(404).json({ message: "Discussion not found" });
  }

  res.json(discussion);
});

export const downvoteDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findByIdAndUpdate(
    id,
    { $inc: { downvotes: 1 } },
    { new: true }
  );

  if (!discussion) {
    return res.status(404).json({ message: "Discussion not found" });
  }

  res.json(discussion);
});

export const pinDiscussion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const discussion = await Discussion.findByIdAndUpdate(
    id,
    { isPinned: true },
    { new: true }
  );

  if (!discussion) {
    return res.status(404).json({ message: "Discussion not found" });
  }

  res.json(discussion);
});
