import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: String,
    reason: String,
    awardedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      default: "Student Hub"
    },
    role: {
      type: String,
      default: "student"
    },
    isAdmin: {
      type: Boolean,
      default: false,
      index: true
    },
    avatar:
      {
        type: String,
        default:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
      },
    darkMode: {
      type: Boolean,
      default: false
    },
    badges: [badgeSchema]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
