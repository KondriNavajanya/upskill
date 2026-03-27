import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Bookmark from "../models/Bookmark.js";
import Leaderboard from "../models/Leaderboard.js";
import Result from "../models/Result.js";
import Test from "../models/Test.js";
import User from "../models/User.js";

dotenv.config();

const runSeed = async () => {
  await connectDB();

  await Promise.all([
    Bookmark.deleteMany(),
    Result.deleteMany(),
    Test.deleteMany(),
    Leaderboard.deleteMany(),
    User.deleteMany()
  ]);

  const password = await bcrypt.hash("password123", 10);
  const user = await User.create({
    name: "Aarav Sharma",
    email: "demo@student.ai",
    password,
    institution: "Hackathon Institute",
    isAdmin: true,
    badges: [{ name: "Fast Starter", reason: "Completed onboarding" }]
  });

  await Leaderboard.create({
    user: user._id,
    points: 255,
    testsTaken: 3,
    averageScore: 85,
    streak: 3
  });

  console.log("Seed complete");
  process.exit();
};

runSeed().catch((error) => {
  console.error(error);
  process.exit(1);
});
