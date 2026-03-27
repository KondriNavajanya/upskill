import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";
import Submission from "../models/Submission.js";
import UserStats from "../models/UserStats.js";
import Problem from "../models/Problem.js";

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "demo-key";

const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  cpp: 54
};

export const runCode = asyncHandler(async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({ message: "Code and language are required" });
  }

  try {
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: code,
        language_id: LANGUAGE_MAP[language],
        stdin: input || ""
      },
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      }
    );

    const submissionToken = response.data.token;

    // Poll for results
    setTimeout(async () => {
      const resultResponse = await axios.get(
        `${JUDGE0_API_URL}/submissions/${submissionToken}?base64_encoded=true`,
        {
          headers: {
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      const result = resultResponse.data;

      res.json({
        status: result.status?.description || "Pending",
        output: Buffer.from(result.stdout || "", "base64").toString(),
        error: Buffer.from(result.stderr || "", "base64").toString(),
        runtime: result.time,
        memory: result.memory
      });
    }, 1000);
  } catch (error) {
    res.status(500).json({ message: "Code execution failed", error: error.message });
  }
});

export const submitCode = asyncHandler(async (req, res) => {
  const { problemId, code, language } = req.body;
  const userId = req.user._id;

  if (!problemId || !code || !language) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }

  let passedTests = 0;
  let totalTests = problem.testCases.length;
  let status = "Pending";
  let runtime = 0;
  let memory = 0;

  try {
    for (let testCase of problem.testCases) {
      const response = await axios.post(
        `${JUDGE0_API_URL}/submissions`,
        {
          source_code: code,
          language_id: LANGUAGE_MAP[language],
          stdin: testCase.input
        },
        {
          headers: {
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      const submissionToken = response.data.token;

      // Poll for result
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const resultResponse = await axios.get(
        `${JUDGE0_API_URL}/submissions/${submissionToken}?base64_encoded=true`,
        {
          headers: {
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      const result = resultResponse.data;
      const output = Buffer.from(result.stdout || "", "base64").toString().trim();

      if (output === testCase.output.trim()) {
        passedTests++;
      }

      runtime = Math.max(runtime, result.time || 0);
      memory = Math.max(memory, result.memory || 0);
    }

    status = passedTests === totalTests ? "Accepted" : "WrongAnswer";
  } catch (error) {
    status = "RuntimeError";
  }

  const submission = await Submission.create({
    userId,
    problemId,
    code,
    language,
    status,
    runtime,
    memory,
    passedTestCases: passedTests,
    totalTestCases: totalTests
  });

  // Update user stats
  if (status === "Accepted") {
    const userStats = await UserStats.findOne({ userId });
    if (userStats) {
      userStats.solvedProblems += 1;
      userStats.acceptedSubmissions += 1;
      if (problem.difficulty === "Easy") userStats.easySolved += 1;
      else if (problem.difficulty === "Medium") userStats.mediumSolved += 1;
      else if (problem.difficulty === "Hard") userStats.hardSolved += 1;
      await userStats.save();
    }
  }

  res.status(201).json({
    submission,
    verdict: {
      status,
      passedTestCases,
      totalTestCases,
      runtime,
      memory
    }
  });
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const { problemId, limit = 20, page = 1 } = req.query;
  const userId = req.user._id;

  let query = { userId };
  if (problemId) {
    query.problemId = problemId;
  }

  const skip = (page - 1) * limit;
  const submissions = await Submission.find(query)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 })
    .populate("problemId", "title slug");

  const total = await Submission.countDocuments(query);

  res.json({
    submissions,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

export const getSubmissionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const submission = await Submission.findById(id).populate("problemId");

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  res.json(submission);
});
