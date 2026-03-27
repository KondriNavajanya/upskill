import mongoose from "mongoose";

const topicStatsSchema = new mongoose.Schema(
  {
    topic: String,
    solved: { type: Number, default: 0 },
    attempted: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    avgTime: { type: Number, default: 0 },
    lastAttempt: Date
  },
  { _id: false }
);

const userStatsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    totalProblems: { type: Number, default: 0 },
    solvedProblems: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    totalSubmissions: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    topicStats: [topicStatsSchema],
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    codingProfile: {
      language: String,
      codeQuality: Number,
      speed: Number
    },
    lastSolvedDate: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("UserStats", userStatsSchema);
