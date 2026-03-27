import Bookmark from "../models/Bookmark.js";
import Leaderboard from "../models/Leaderboard.js";
import Result from "../models/Result.js";
import Test from "../models/Test.js";
import User from "../models/User.js";
import { TOPIC_LIBRARY } from "../utils/constants.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const profile = await User.findById(req.user._id).select("-password");
  const leaderboard = await Leaderboard.findOne({ user: req.user._id });
  res.json({ ...profile.toObject(), leaderboard });
});

export const getProgress = asyncHandler(async (req, res) => {
  const [results, testsCount, bookmarksCount, leaderboard] = await Promise.all([
    Result.find({ user: req.user._id }).sort({ createdAt: 1 }),
    Test.countDocuments({ user: req.user._id }),
    Bookmark.countDocuments({ user: req.user._id }),
    Leaderboard.findOne({ user: req.user._id })
  ]);

  const averageScore = results.length
    ? Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length)
    : 0;

  const topicMap = TOPIC_LIBRARY.reduce((acc, topic) => {
    const topicResults = results.filter((result) => result.topic === topic);
    acc[topic] = topicResults.length
      ? Math.round(topicResults.reduce((sum, item) => sum + item.score, 0) / topicResults.length)
      : 0;
    return acc;
  }, {});

  const recentActivity = results.slice(-5).reverse().map((item) => ({
    id: item._id,
    topic: item.topic,
    score: item.score,
    difficulty: item.difficulty,
    date: item.createdAt
  }));

  const performanceTimeline = results.map((item) => ({
    name: new Date(item.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric"
    }),
    score: item.score,
    topic: item.topic
  }));

  res.json({
    stats: {
      totalTestsTaken: testsCount,
      averageScore,
      bookmarksCount,
      streak: leaderboard?.streak || 0,
      points: leaderboard?.points || 0
    },
    topicScores: topicMap,
    recentActivity,
    performanceTimeline
  });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const { darkMode } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { darkMode: Boolean(darkMode) },
    { new: true }
  ).select("-password");

  const leaderboard = await Leaderboard.findOne({ user: req.user._id });
  res.json({ ...user.toObject(), leaderboard });
});

export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await Leaderboard.find()
    .sort({ points: -1, averageScore: -1 })
    .limit(10)
    .populate("user", "name avatar institution");

  res.json(leaderboard);
});
