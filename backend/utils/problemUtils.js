import Problem from "../models/Problem.js";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const isValidDifficulty = (difficulty) => DIFFICULTIES.includes(difficulty);

const toStringArray = (value = []) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const slugify = (text = "") =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const buildUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title);
  if (!baseSlug) {
    return null;
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Problem.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {})
    }).select("_id");

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

const normalizeExamples = (examples = []) => {
  if (!Array.isArray(examples)) {
    return [];
  }

  return examples
    .map((example) => ({
      input: String(example?.input || "").trim(),
      output: String(example?.output || "").trim(),
      explanation: String(example?.explanation || "").trim()
    }))
    .filter((example) => example.input || example.output || example.explanation);
};

const normalizeTestCases = (testCases = []) => {
  if (!Array.isArray(testCases)) {
    return [];
  }

  return testCases
    .map((testCase) => ({
      input: String(testCase?.input || "").trim(),
      output: String(testCase?.output || "").trim(),
      hidden: Boolean(testCase?.hidden ?? testCase?.isHidden ?? false)
    }))
    .filter((testCase) => testCase.input || testCase.output);
};

const normalizeConstraints = (constraints = "") => {
  if (Array.isArray(constraints)) {
    return constraints
      .map((constraint) => String(constraint || "").trim())
      .filter(Boolean)
      .join("\n");
  }

  return String(constraints || "").trim();
};

export const normalizeProblemPayload = ({ payload, source = "admin", createdBy = null }) => {
  const title = String(payload?.title || "").trim();

  return {
    title,
    difficulty: String(payload?.difficulty || "").trim(),
    tags: toStringArray(payload?.tags),
    description: String(payload?.description || "").trim(),
    constraints: normalizeConstraints(payload?.constraints),
    examples: normalizeExamples(payload?.examples),
    testCases: normalizeTestCases(payload?.testCases),
    starterCode: {
      javascript: String(payload?.starterCode?.javascript || "").trim(),
      python: String(payload?.starterCode?.python || "").trim(),
      cpp: String(payload?.starterCode?.cpp || "").trim()
    },
    source,
    createdBy
  };
};

export const validateProblemPayload = (payload) => {
  const errors = [];

  if (!payload.title) {
    errors.push("Title is required");
  }

  if (!isValidDifficulty(payload.difficulty)) {
    errors.push("Difficulty must be one of Easy, Medium, Hard");
  }

  if (!payload.description) {
    errors.push("Description is required");
  }

  if (!payload.constraints) {
    errors.push("Constraints are required");
  }

  if (!Array.isArray(payload.testCases) || payload.testCases.length === 0) {
    errors.push("At least one test case is required");
  }

  if (!Array.isArray(payload.examples) || payload.examples.length === 0) {
    errors.push("At least one example is required");
  }

  return errors;
};

export const DIFFICULTY_VALUES = DIFFICULTIES;
