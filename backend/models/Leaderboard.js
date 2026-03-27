import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    points: { type: Number, default: 0 },
    testsTaken: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    streak: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
