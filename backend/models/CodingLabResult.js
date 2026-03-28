import mongoose from "mongoose";

const codingLabResultSchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    problemId: { type: Number, required: true },
    title: String,
    language: String,
    code: String,
    topic: String,
    difficulty: String,
    passed: Boolean,
    score: Number,
    testsPassed: Number,
    totalTests: Number,
    output: String,
    errorMessage: String,
    runDetails: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

export default mongoose.model("CodingLabResult", codingLabResultSchema);
