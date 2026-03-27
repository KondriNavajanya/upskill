import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    explanation: String
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true
    },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [answerSchema],
    feedback: [String],
    timeSpent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
