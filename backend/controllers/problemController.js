import Problem from "../models/Problem.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAllProblems = asyncHandler(async (req, res) => {
  const { difficulty, tag, status, search, limit = 20, page = 1 } = req.query;
  let query = {};

  if (difficulty) {
    query.difficulty = difficulty;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  const skip = (page - 1) * limit;
  const problems = await Problem.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .select("title slug difficulty tags acceptanceRate submissions solved");

  const total = await Problem.countDocuments(query);

  res.json({
    problems,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const problem = await Problem.findById(id);

  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  res.json(problem);
});

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    slug,
    difficulty,
    tags,
    description,
    constraints,
    examples,
    testCases,
    starterCode
  } = req.body;

  if (!title || !slug || !difficulty) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const problem = await Problem.create({
    title,
    slug,
    difficulty,
    tags,
    description,
    constraints,
    examples,
    testCases,
    starterCode,
    createdBy: req.user?._id
  });

  res.status(201).json(problem);
});

export const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const problem = await Problem.findByIdAndUpdate(id, req.body, {
    new: true
  });

  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  res.json(problem);
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const problem = await Problem.findByIdAndDelete(id);

  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  res.json({ message: "Problem deleted successfully" });
});

export const getProblemsByDifficulty = asyncHandler(async (req, res) => {
  const { difficulty } = req.params;

  const problems = await Problem.find({ difficulty }).select(
    "title slug difficulty acceptanceRate solved"
  );

  res.json(problems);
});

export const getProblemsByTag = asyncHandler(async (req, res) => {
  const { tag } = req.params;

  const problems = await Problem.find({ tags: tag }).select(
    "title slug difficulty tags acceptanceRate solved"
  );

  res.json(problems);
});

export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await Problem.distinct("tags");
  res.json(tags);
});
