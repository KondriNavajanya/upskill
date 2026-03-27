import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const discussionSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    code: String,
    language: String,
    category: {
      type: String,
      enum: ["Solution", "Question", "Tip"],
      default: "Question"
    },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: [commentSchema],
    tags: [String],
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Discussion", discussionSchema);
