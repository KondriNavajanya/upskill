import Problem from "../models/Problem.js";
import { generateProblemWithAI } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  buildUniqueSlug,
  normalizeProblemPayload,
  validateProblemPayload,
  isValidDifficulty
} from "../utils/problemUtils.js";
import {
  clearProblemCache,
  readCache,
  writeCache
} from "../utils/problemCache.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findByTitleCaseInsensitive = async (title, excludeId = null) => {
  const safeTitle = escapeRegex(title);

  return Problem.findOne({
    title: { $regex: `^${safeTitle}$`, $options: "i" },
    ...(excludeId ? { _id: { $ne: excludeId } } : {})
  }).select("_id title");
};

const parsePagination = (query) => {
  const page = Number.parseInt(query.page, 10) || 1;
  const limit = Number.parseInt(query.limit, 10) || 20;

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit))
  };
};

export const getAllProblems = asyncHandler(async (req, res) => {
  const { difficulty, tag, search } = req.query;
  const { page, limit } = parsePagination(req.query);
  const cacheKey = `problem:list:${JSON.stringify({ difficulty, tag, search, page, limit })}`;
  const cached = readCache(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  const query = {};

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
    .limit(limit)
    .sort({ createdAt: -1 })
    .select("title slug difficulty tags acceptanceRate submissions solved source");

  const total = await Problem.countDocuments(query);

  const response = {
    problems,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };

  writeCache(cacheKey, response);

  res.json(response);
});

export const getProblemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cacheKey = `problem:detail:${id}`;
  const cached = readCache(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  const problem = await Problem.findById(id);

  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  writeCache(cacheKey, problem);

  res.json(problem);
});

export const createProblem = asyncHandler(async (req, res) => {
  const normalized = normalizeProblemPayload({
    payload: req.body,
    source: "admin",
    createdBy: req.user?._id || null
  });

  const validationErrors = validateProblemPayload(normalized);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors: validationErrors });
  }

  const existingTitle = await findByTitleCaseInsensitive(normalized.title);
  if (existingTitle) {
    return res.status(409).json({ message: "A problem with this title already exists" });
  }

  normalized.slug = await buildUniqueSlug(normalized.title);

  const problem = await Problem.create(normalized);
  clearProblemCache();

  res.status(201).json(problem);
});

export const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existingProblem = await Problem.findById(id);

  if (!existingProblem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  const mergedPayload = {
    ...existingProblem.toObject(),
    ...req.body,
    starterCode: {
      ...(existingProblem.starterCode?.toObject?.() || existingProblem.starterCode || {}),
      ...(req.body.starterCode || {})
    },
    examples: req.body.examples ?? existingProblem.examples,
    testCases: req.body.testCases ?? existingProblem.testCases,
    tags: req.body.tags ?? existingProblem.tags,
    constraints: req.body.constraints ?? existingProblem.constraints
  };

  const normalized = normalizeProblemPayload({
    payload: mergedPayload,
    source: "admin",
    createdBy: existingProblem.createdBy || req.user?._id || null
  });

  const validationErrors = validateProblemPayload(normalized);
  if (validationErrors.length > 0) {
    return res.status(400).json({ message: "Validation failed", errors: validationErrors });
  }

  const existingTitle = await findByTitleCaseInsensitive(normalized.title, id);
  if (existingTitle) {
    return res.status(409).json({ message: "A problem with this title already exists" });
  }

  normalized.slug = await buildUniqueSlug(normalized.title, id);

  existingProblem.set(normalized);
  await existingProblem.save();
  clearProblemCache();

  res.json(existingProblem);
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const problem = await Problem.findByIdAndDelete(id);

  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  clearProblemCache();

  res.json({ message: "Problem deleted successfully" });
});

export const bulkUploadProblems = asyncHandler(async (req, res) => {
  const incomingProblems = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body.problems)
      ? req.body.problems
      : [];

  if (incomingProblems.length === 0) {
    return res.status(400).json({ message: "Provide a non-empty array of problems" });
  }

  const created = [];
  const skipped = [];

  for (const [index, rawProblem] of incomingProblems.entries()) {
    const normalized = normalizeProblemPayload({
      payload: rawProblem,
      source: "admin",
      createdBy: req.user?._id || null
    });

    const errors = validateProblemPayload(normalized);
    if (errors.length > 0) {
      skipped.push({ index, title: normalized.title, reason: errors.join(", ") });
      continue;
    }

    const duplicate = await findByTitleCaseInsensitive(normalized.title);
    if (duplicate) {
      skipped.push({ index, title: normalized.title, reason: "Duplicate title" });
      continue;
    }

    normalized.slug = await buildUniqueSlug(normalized.title);
    const saved = await Problem.create(normalized);
    created.push(saved);
  }

  clearProblemCache();

  res.status(201).json({
    message: "Bulk upload completed",
    createdCount: created.length,
    skippedCount: skipped.length,
    skipped,
    created
  });
});

export const generateProblem = asyncHandler(async (req, res) => {
  const { topic, difficulty } = req.body;

  if (!topic || !difficulty) {
    return res.status(400).json({ message: "Topic and difficulty are required" });
  }

  if (!isValidDifficulty(difficulty)) {
    return res.status(400).json({ message: "Difficulty must be one of Easy, Medium, Hard" });
  }

  const aiResult = await generateProblemWithAI({ topic, difficulty });

  const normalized = normalizeProblemPayload({
    payload: {
      ...aiResult,
      tags: Array.isArray(aiResult?.tags) && aiResult.tags.length > 0 ? aiResult.tags : [topic]
    },
    source: "ai",
    createdBy: req.user?._id || null
  });

  const validationErrors = validateProblemPayload(normalized);
  if (validationErrors.length > 0) {
    return res.status(422).json({
      message: "Invalid AI response format",
      errors: validationErrors
    });
  }

  const duplicate = await findByTitleCaseInsensitive(normalized.title);
  if (duplicate) {
    return res.status(409).json({ message: "AI generated duplicate title. Try generating again." });
  }

  normalized.slug = await buildUniqueSlug(normalized.title);
  const problem = await Problem.create(normalized);
  clearProblemCache();

  res.status(201).json(problem);
});

export const getProblemsByDifficulty = asyncHandler(async (req, res) => {
  const { difficulty } = req.params;

  if (!isValidDifficulty(difficulty)) {
    return res.status(400).json({ message: "Invalid difficulty value" });
  }

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
  const cacheKey = "problem:tags";
  const cached = readCache(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  const tags = await Problem.distinct("tags");
  writeCache(cacheKey, tags);

  res.json(tags);
});
