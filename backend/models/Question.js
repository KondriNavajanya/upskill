import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    type: {
      type: String,
      enum: ["mcq", "coding"],
      required: true
    },
    options: [String],
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    starterCode: String,
    tags: [String],
    topic: String,
    difficulty: String
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
