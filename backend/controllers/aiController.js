import Result from "../models/Result.js";
import { explainAnswer, suggestCareer } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";
import SkillAnalysis from "../models/SkillAnalysis.js";
import UserStats from "../models/UserStats.js";
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";

export const getExplanation = asyncHandler(async (req, res) => {
  const { question, userAnswer, correctAnswer } = req.body;

  if (!question || !correctAnswer) {
    return res.status(400).json({ message: "Question and correct answer are required" });
  }

  const explanation = await explainAnswer({ question, userAnswer, correctAnswer });
  res.json(explanation);
});

export const getCareerSuggestion = asyncHandler(async (req, res) => {
  const results = await Result.find({ user: req.user._id });
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.topic]) {
      acc[result.topic] = [];
    }

    acc[result.topic].push(result.score);
    return acc;
  }, {});

  const scoresByTopic = Object.fromEntries(
    Object.entries(grouped).map(([topic, values]) => [
      topic,
      Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    ])
  );

  const suggestion = await suggestCareer(scoresByTopic);
  res.json({ scoresByTopic, ...suggestion });
});

export const codeReview = asyncHandler(async (req, res) => {
  const { code, language, problemId } = req.body;

  try {
    // Mock AI code review - replace with OpenAI API call in production
    const codeQualityFeedback = {
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      improvements: [
        "Consider using a more efficient data structure",
        "Add input validation",
        "Improve variable naming for clarity"
      ],
      bestPractices: [
        "Use const instead of let where possible",
        "Add error handling",
        "Consider edge cases"
      ],
      optimalApproach: "A more efficient approach would be to use a hash map for O(1) lookups"
    };

    res.json(codeQualityFeedback);
  } catch (error) {
    res.status(500).json({ message: "Code review failed", error: error.message });
  }
});

export const generateSkillGapAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let userStats = await UserStats.findOne({ userId });
  if (!userStats) {
    userStats = await UserStats.create({ userId });
  }

  // Calculate weak and strong topics based on submission data
  const submissions = await Submission.find({ userId }).populate("problemId");

  const topicPerformance = {};
  submissions.forEach((submission) => {
    const problem = submission.problemId;
    problem.tags?.forEach((tag) => {
      if (!topicPerformance[tag]) {
        topicPerformance[tag] = { solved: 0, attempted: 0 };
      }
      topicPerformance[tag].attempted += 1;
      if (submission.status === "Accepted") {
        topicPerformance[tag].solved += 1;
      }
    });
  });

  const weakTopics = Object.entries(topicPerformance)
    .filter(([, stats]) => stats.solved / stats.attempted < 0.5)
    .map(([topic, stats]) => ({
      topic,
      proficiency: Math.round((stats.solved / stats.attempted) * 100),
      needsImprovement: true,
      recommendedResources: [`Learn ${topic} fundamentals`, `Practice ${topic} problems`],
      estimatedWeeks: 2
    }));

  const strongTopics = Object.entries(topicPerformance)
    .filter(([, stats]) => stats.solved / stats.attempted >= 0.7)
    .map(([topic]) => topic);

  let skillAnalysis = await SkillAnalysis.findOne({ userId });
  if (!skillAnalysis) {
    skillAnalysis = await SkillAnalysis.create({ userId });
  }

  skillAnalysis.weakTopics = weakTopics;
  skillAnalysis.strongTopics = strongTopics;
  skillAnalysis.lastAnalyzedAt = new Date();
  await skillAnalysis.save();

  res.json(skillAnalysis);
});

export const generateUpskillRoadmap = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let skillAnalysis = await SkillAnalysis.findOne({ userId });
  if (!skillAnalysis) {
    skillAnalysis = await SkillAnalysis.create({ userId });
  }

  const roadmap = [];
  const weakTopics = skillAnalysis.weakTopics || [];

  // Generate 12-week roadmap
  for (let week = 1; week <= 12; week++) {
    const topicIndex = (week - 1) % Math.max(weakTopics.length, 1);
    const topic = weakTopics[topicIndex]?.topic || "General Problem Solving";

    // Find problems related to this topic
    const problems = await Problem.find({ tags: topic }).limit(5).select("_id title");

    roadmap.push({
      week,
      topic,
      concepts: [`${topic} fundamentals`, `${topic} patterns`, `${topic} optimization`],
      problems: problems.map((p) => p._id),
      status: "Pending"
    });
  }

  skillAnalysis.upskillRoadmap = roadmap;
  skillAnalysis.nextAnalysisDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await skillAnalysis.save();

  res.json({
    roadmap,
    startDate: new Date(),
    estimatedCompletionDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000)
  });
});

export const generateCareerPath = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userStats = await UserStats.findOne({ userId });
  if (!userStats) {
    return res.status(400).json({ message: "No stats found" });
  }

  const totalSolved = userStats.solvedProblems || 1;
  const easyPercentage = (userStats.easySolved / totalSolved) * 100 || 0;
  const mediumPercentage = (userStats.mediumSolved / totalSolved) * 100 || 0;
  const hardPercentage = (userStats.hardSolved / totalSolved) * 100 || 0;

  let role = "Student";
  let reasoning = "Keep practicing to improve your skills";

  if (hardPercentage > 40) {
    role = "Senior Developer / System Designer";
    reasoning = "You have demonstrated strong problem-solving skills across all difficulty levels.";
  } else if (hardPercentage > 20 && mediumPercentage > 40) {
    role = "Mid-Level Developer / Backend Engineer";
    reasoning = "You excel at medium to hard problems. Consider specializing in system design.";
  } else if (mediumPercentage > 40) {
    role = "Junior Developer / Full Stack Engineer";
    reasoning = "You have solid fundamentals. Keep practicing harder problems.";
  } else if (easyPercentage > 60) {
    role = "Frontend Developer / Entry-Level";
    reasoning = "Continue building your problem-solving skills with more challenging problems.";
  }

  let skillAnalysis = await SkillAnalysis.findOne({ userId });
  if (!skillAnalysis) {
    skillAnalysis = await SkillAnalysis.create({ userId });
  }

  skillAnalysis.careerPath = {
    role,
    reasoning,
    requiredSkills: ["Data Structures", "Algorithms", "System Design", "Problem Solving"],
    progressPercentage: (totalSolved / 300) * 100
  };

  await skillAnalysis.save();

  res.json(skillAnalysis.careerPath);
});

export const getSkillAnalysis = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let skillAnalysis = await SkillAnalysis.findOne({ userId }).populate(
    "upskillRoadmap.problems"
  );

  if (!skillAnalysis) {
    skillAnalysis = await SkillAnalysis.create({ userId });
  }

  res.json(skillAnalysis);
});
