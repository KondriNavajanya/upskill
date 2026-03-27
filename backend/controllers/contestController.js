import Contest from "../models/Contest.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllContests = asyncHandler(async (req, res) => {
  const { status, limit = 10, page = 1 } = req.query;
  let query = {};

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;
  const contests = await Contest.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ startTime: -1 })
    .populate("createdBy", "name email")
    .select("-participants");

  const total = await Contest.countDocuments(query);

  res.json({
    contests,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

export const getContestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const contest = await Contest.findById(id)
    .populate("problems", "title slug difficulty")
    .populate("createdBy", "name email");

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  res.json(contest);
});

export const createContest = asyncHandler(async (req, res) => {
  const { title, description, problems, startTime, endTime, duration, visibility } = req.body;

  if (!title || !startTime || !endTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const contest = await Contest.create({
    title,
    description,
    problems,
    startTime,
    endTime,
    duration,
    visibility: visibility || "Public",
    createdBy: req.user._id,
    status: "Scheduled"
  });

  res.status(201).json(contest);
});

export const joinContest = asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  const userId = req.user._id;

  const contest = await Contest.findById(contestId);
  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  const alreadyJoined = contest.participants.some((p) => p.userId.toString() === userId.toString());
  if (alreadyJoined) {
    return res.status(400).json({ message: "Already joined contest" });
  }

  contest.participants.push({
    userId,
    joinedAt: new Date()
  });

  await contest.save();
  res.json({ message: "Joined contest successfully", contest });
});

export const getContestLeaderboard = asyncHandler(async (req, res) => {
  const { contestId } = req.params;

  const contest = await Contest.findById(contestId)
    .populate("leaderboard.userId", "name email avatar")
    .select("leaderboard status");

  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  res.json({
    status: contest.status,
    leaderboard: contest.leaderboard
  });
});

export const updateContestStatus = asyncHandler(async (req, res) => {
  const { contestId } = req.params;
  const now = new Date();

  const contest = await Contest.findById(contestId);
  if (!contest) {
    return res.status(404).json({ message: "Contest not found" });
  }

  if (now > contest.endTime) {
    contest.status = "Finished";
  } else if (now >= contest.startTime) {
    contest.status = "OnGoing";
  }

  await contest.save();
  res.json(contest);
});
