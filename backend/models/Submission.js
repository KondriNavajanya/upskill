import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true
    },
    code: {
      type: String,
      required: true
    },
    language: {
      type: String,
      enum: ["javascript", "python", "cpp"],
      required: true
    },
    status: {
      type: String,
      enum: ["Accepted", "WrongAnswer", "TimeLimitExceeded", "RuntimeError", "Pending"],
      default: "Pending"
    },
    runtime: Number,
    memory: Number,
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    output: String,
    error: String,
    verdict: String,
    contestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
