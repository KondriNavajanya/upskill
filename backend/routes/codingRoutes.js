import express from "express";
import { leetcodeProblems } from "../utils/leetcodeProblems.js";
import { applyExecutionMeta } from "../utils/codingTestMetadata.js";
import { runCodingLabTests, normalizeCodingLanguage } from "../utils/codingExecution.js";
import { explainCodingProblem } from "../services/aiService.js";
import CodingLabResult from "../models/CodingLabResult.js";

const router = express.Router();

function findProblemById(rawId) {
  const problemId = parseInt(rawId, 10);
  for (const difficulties of Object.values(leetcodeProblems)) {
    for (const problems of Object.values(difficulties)) {
      const problem = problems.find((p) => p.id === problemId);
      if (problem) {
        return { problem, problemId };
      }
    }
  }
  return { problem: null, problemId };
}

function prepareProblem(raw) {
  return applyExecutionMeta(raw);
}

// Get all coding problems by topic and difficulty
router.get("/problems/:topic/:difficulty", (req, res) => {
  try {
    const { topic, difficulty } = req.params;

    if (!leetcodeProblems[topic] || !leetcodeProblems[topic][difficulty]) {
      return res.status(404).json({
        success: false,
        message: `No problems found for ${topic} - ${difficulty}`
      });
    }

    const problems = leetcodeProblems[topic][difficulty];
    const problemsForClient = problems.map(({ testCases, ...rest }) => rest);

    res.json({
      success: true,
      topic,
      difficulty,
      count: problemsForClient.length,
      problems: problemsForClient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching problems",
      error: error.message
    });
  }
});

// Get single problem details
router.get("/problem/:id", (req, res) => {
  try {
    const { problem, problemId } = findProblemById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with id ${problemId} not found`
      });
    }

    let foundTopic = null;
    for (const [topic, difficulties] of Object.entries(leetcodeProblems)) {
      for (const [difficulty, problems] of Object.entries(difficulties)) {
        if (problems.some((p) => p.id === problem.id)) {
          foundTopic = topic;
          break;
        }
      }
      if (foundTopic) break;
    }

    res.json({
      success: true,
      problem,
      topic: foundTopic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching problem",
      error: error.message
    });
  }
});

// Static explanation (no AI)
router.get("/explanation/:id", (req, res) => {
  try {
    const { problem } = findProblemById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: `Problem with id ${req.params.id} not found`
      });
    }

    const explanation = {
      title: problem.title,
      coreIdea: problem.coreIdea,
      approaches: problem.approaches,
      hints: problem.hints || [],
      constraints: problem.constraints,
      examples: problem.examples
    };

    res.json({
      success: true,
      explanation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching explanation",
      error: error.message
    });
  }
});

// Beginner-friendly AI explanation (full teaching)
router.post("/explanation/learn", async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const { problem } = findProblemById(problemId);

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const explanation = await explainCodingProblem(problem, { userCode: code, language });
    res.json({
      success: true,
      explanation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error generating explanation",
      error: error.message
    });
  }
});

// Run code against sample / first test (LeetCode-style "Run")
router.post("/run", async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || code === undefined) {
      return res.status(400).json({
        success: false,
        message: "problemId, language, and code are required"
      });
    }

    const { problem } = findProblemById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const merged = prepareProblem(problem);
    const lang = normalizeCodingLanguage(language);

    const evalResult = await runCodingLabTests(merged, code, lang, { onlyFirst: true });

    const firstDetail = evalResult.details?.[0];
    let summaryText = evalResult.message || "";
    if (firstDetail?.error) {
      summaryText = `Error: ${firstDetail.error}`;
    } else if (firstDetail?.passed) {
      summaryText = "Sample test passed.";
    } else if (firstDetail) {
      summaryText = firstDetail.error
        ? `Error: ${firstDetail.error}`
        : firstDetail.expected != null
          ? `Sample test failed. Expected ${firstDetail.expected}, got ${JSON.stringify(firstDetail.actual)}.`
          : "Sample test failed.";
    } else if (!summaryText) {
      summaryText = "Could not run sample test.";
    }

    res.json({
      success: true,
      ...evalResult,
      output: summaryText
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error running code",
      error: error.message
    });
  }
});

// Submit code against all tests
router.post("/submit", async (req, res) => {
  try {
    const { userId, problemId, language, code, topic, difficulty } = req.body;

    if (!problemId || !language || code === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const { problem } = findProblemById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found"
      });
    }

    const merged = prepareProblem(problem);
    const lang = normalizeCodingLanguage(language);

    let evaluationResult = await runCodingLabTests(merged, code, lang, { onlyFirst: false });
    if (
      evaluationResult.runnable === false &&
      (!evaluationResult.details || evaluationResult.details.length === 0) &&
      evaluationResult.message
    ) {
      evaluationResult = evaluateCodeFallback(code, merged, language, evaluationResult.message);
    }

    const total = evaluationResult.totalTests ?? 0;
    const passed = evaluationResult.testsPassed ?? 0;
    const score =
      total > 0 ? Math.round((passed / total) * 100) : evaluationResult.passed ? 100 : 0;

    const outputSummary =
      evaluationResult.details && evaluationResult.details.length
        ? evaluationResult.details
            .map(
              (d, i) =>
                `Test ${i + 1}: ${d.passed ? "PASS" : "FAIL"}${d.error ? ` (${d.error})` : ""}`
            )
            .join("\n")
        : evaluationResult.message || "";

    const errorMessage = evaluationResult.passed
      ? null
      : evaluationResult.details?.find((d) => d.error)?.error ||
        evaluationResult.message ||
        "One or more tests failed.";

    try {
      const row = new CodingLabResult({
        userId: userId != null ? String(userId) : "anonymous",
        problemId: parseInt(problemId, 10),
        title: problem.title,
        language,
        code,
        topic: topic || problem.topic,
        difficulty: difficulty || problem.difficulty,
        passed: Boolean(evaluationResult.passed),
        score,
        testsPassed: passed,
        totalTests: total || evaluationResult.totalTests || 0,
        output: outputSummary,
        errorMessage,
        runDetails: evaluationResult.details || null
      });
      await row.save();
    } catch (e) {
      console.error("CodingLabResult save failed:", e.message);
    }

    res.json({
      success: true,
      message: evaluationResult.passed ? "All tests passed!" : "Some tests failed",
      result: {
        passed: Boolean(evaluationResult.passed),
        score,
        testsPassed: passed,
        totalTests: total || evaluationResult.totalTests || 0,
        output: outputSummary,
        runnable: evaluationResult.runnable,
        message: evaluationResult.message,
        details: evaluationResult.details,
        timeComplexity: merged.approaches?.[0]?.timeComplexity,
        spaceComplexity: merged.approaches?.[0]?.spaceComplexity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting code",
      error: error.message
    });
  }
});

// Get submission history for user
router.get("/submissions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit || 10;

    const submissions = await CodingLabResult.find({ userId: String(userId) })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching submissions",
      error: error.message
    });
  }
});

// Get coding stats for user
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await CodingLabResult.find({ userId: String(userId) });

    const stats = {
      totalSubmissions: submissions.length,
      solvedProblems: submissions.filter((s) => s.passed).length,
      attemptedProblems: new Set(submissions.map((s) => s.problemId)).size,
      byDifficulty: {
        Easy: submissions.filter((s) => s.difficulty === "Easy" && s.passed).length,
        Medium: submissions.filter((s) => s.difficulty === "Medium" && s.passed).length,
        Hard: submissions.filter((s) => s.difficulty === "Hard" && s.passed).length
      },
      byTopic: {},
      averageScore: 0
    };

    const topics = new Set(submissions.map((s) => s.topic));
    topics.forEach((t) => {
      const topicSubmissions = submissions.filter((s) => s.topic === t && s.passed);
      stats.byTopic[t] = topicSubmissions.length;
    });

    const totalScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0);
    stats.averageScore =
      submissions.length > 0 ? (totalScore / submissions.length).toFixed(2) : 0;

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message
    });
  }
});

function evaluateCodeFallback(code, problem, language, priorMessage) {
  const hasStructure =
    code.includes("function") ||
    code.includes("class ") ||
    code.includes("def ") ||
    code.includes("=>") ||
    code.includes("func ") ||
    code.includes("fn ") ||
    code.includes("void ") ||
    code.includes("int ") ||
    code.includes("public static");
  const lines = code.trim().split("\n").length;
  const totalTests = problem.testCases?.length || 1;
  const base = priorMessage ? `${priorMessage} ` : "";
  if (!hasStructure || lines < 3) {
    return {
      runnable: false,
      passed: false,
      testsPassed: 0,
      totalTests,
      details: [],
      message: `${base}Draft in the editor and use Get explanation, or switch to JavaScript (free local tests) / configure Judge0 for other languages.`
    };
  }
  return {
    runnable: false,
    passed: false,
    testsPassed: 0,
    totalTests,
    details: [],
    message: `${base}Try JavaScript (local grader) or set JUDGE0_API_KEY for cloud languages.`
  };
}

export default router;
