import mongoose from "mongoose";

const embeddedQuestionSchema = new mongoose.Schema(
  {
    prompt: String,
    type: String,
    options: [String],
    correctAnswer: String,
    explanation: String,
    starterCode: String,
    tags: [String]
  },
  { _id: false }
);

const testSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    questions: [embeddedQuestionSchema],
    duration: { type: Number, default: 900 },
    status: {
      type: String,
      enum: ["generated", "submitted"],
      default: "generated"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
