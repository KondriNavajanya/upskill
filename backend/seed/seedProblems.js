import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Problem from "../models/Problem.js";
import {
  buildUniqueSlug,
  normalizeProblemPayload,
  validateProblemPayload
} from "../utils/problemUtils.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetPath = path.join(__dirname, "problems.json");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findDuplicateTitle = async (title) => {
  const safeTitle = escapeRegex(title);
  return Problem.findOne({ title: { $regex: `^${safeTitle}$`, $options: "i" } }).select("_id");
};

const seedProblems = async () => {
  await connectDB();

  const fileContent = await fs.readFile(datasetPath, "utf-8");
  const dataset = JSON.parse(fileContent);

  if (!Array.isArray(dataset) || dataset.length === 0) {
    throw new Error("seed/problems.json must contain a non-empty array of problems");
  }

  let inserted = 0;
  let skipped = 0;

  for (const rawProblem of dataset) {
    const normalized = normalizeProblemPayload({
      payload: rawProblem,
      source: "manual",
      createdBy: null
    });

    const errors = validateProblemPayload(normalized);
    if (errors.length > 0) {
      skipped += 1;
      continue;
    }

    const duplicate = await findDuplicateTitle(normalized.title);
    if (duplicate) {
      skipped += 1;
      continue;
    }

    normalized.slug = await buildUniqueSlug(normalized.title);

    await Problem.create(normalized);
    inserted += 1;
  }

  console.log(`Problems seeding complete. Inserted: ${inserted}, Skipped: ${skipped}`);
  process.exit(0);
};

seedProblems().catch((error) => {
  console.error("Problem seeding failed:", error.message);
  process.exit(1);
});
