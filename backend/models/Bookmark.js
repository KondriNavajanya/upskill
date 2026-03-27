import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    questionText: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Bookmark", bookmarkSchema);
