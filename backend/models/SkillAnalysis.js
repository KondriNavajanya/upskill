import mongoose from "mongoose";

const skillGapSchema = new mongoose.Schema(
  {
    topic: String,
    proficiency: Number, // 0-100
    needsImprovement: Boolean,
    recommendedResources: [String],
    estimatedWeeks: Number
  },
  { _id: false }
);

const roadmapWeekSchema = new mongoose.Schema(
  {
    week: Number,
    topic: String,
    concepts: [String],
    problems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
      }
    ],
    status: { type: String, enum: ["Pending", "InProgress", "Completed"], default: "Pending" }
  },
  { _id: false }
);

const skillAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    weakTopics: [skillGapSchema],
    strongTopics: [String],
    conceptGaps: [String],
    recommendedFocus: String,
    upskillRoadmap: [roadmapWeekSchema],
    careerPath: {
      role: String,
      reasoning: String,
      requiredSkills: [String],
      progressPercentage: Number
    },
    lastAnalyzedAt: { type: Date, default: Date.now },
    nextAnalysisDate: Date,
    analysisHistory: [
      {
        date: Date,
        topTopics: [String],
        bottomTopics: [String],
        overallProgress: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("SkillAnalysis", skillAnalysisSchema);
