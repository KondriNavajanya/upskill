import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    explanation: String
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: String,
    output: String,
    hidden: { type: Boolean, default: false }
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    javascript: String,
    python: String,
    cpp: String
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    tags: [String],
    description: String,
    constraints: String,
    examples: [exampleSchema],
    testCases: [testCaseSchema],
    starterCode: starterCodeSchema,
    acceptanceRate: { type: Number, default: 0 },
    submissions: { type: Number, default: 0 },
    solved: { type: Number, default: 0 },
    editorial: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    source: {
      type: String,
      enum: ["manual", "admin", "ai"],
      default: "manual"
    }
  },
  { timestamps: true }
);

problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });

export default mongoose.model("Problem", problemSchema);
