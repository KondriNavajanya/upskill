import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Leaderboard from "../models/Leaderboard.js";
import asyncHandler from "../utils/asyncHandler.js";

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, institution, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const isAdmin = role === "admin" ? true : false;
  
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    institution,
    role: role || "student",
    isAdmin
  });

  const leaderboard = await Leaderboard.create({ user: user._id });

  return res.status(201).json({
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      institution: user.institution,
      role: user.role,
      isAdmin: user.isAdmin,
      darkMode: user.darkMode,
      leaderboard
    }
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const leaderboard = await Leaderboard.findOne({ user: user?._id });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: createToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      institution: user.institution,
      isAdmin: user.isAdmin,
      darkMode: user.darkMode,
      avatar: user.avatar,
      leaderboard
    }
  });
});
