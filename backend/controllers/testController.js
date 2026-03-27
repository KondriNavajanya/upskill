import Bookmark from "../models/Bookmark.js";
import Leaderboard from "../models/Leaderboard.js";
import Result from "../models/Result.js";
import Test from "../models/Test.js";
import User from "../models/User.js";
import { explainAnswer, generateQuestions } from "../services/aiService.js";
import asyncHandler from "../utils/asyncHandler.js";

const calculateBadges = (score, topic) => {
  const badges = [];

  if (score >= 90) {
    badges.push({ name: "Ace Performer", reason: `Scored ${score}% in ${topic}` });
  }

  if (topic === "Graphs" || topic === "Trees") {
    badges.push({ name: "Problem Solver", reason: `Completed a ${topic} challenge` });
  }

  return badges;
};

export const generateTest = asyncHandler(async (req, res) => {
  const { topic, difficulty } = req.body;

  if (!topic || !difficulty) {
    return res.status(400).json({ message: "Topic and difficulty are required" });
  }

  const questions = await generateQuestions({ topic, difficulty });
  const test = await Test.create({
    user: req.user._id,
    topic,
    difficulty,
    questions
  });

  res.status(201).json(test);
});

export const submitTest = asyncHandler(async (req, res) => {
  const { testId, answers, timeSpent = 0, bookmarks = [] } = req.body;
  const test = await Test.findOne({ _id: testId, user: req.user._id });

  if (!test) {
    return res.status(404).json({ message: "Test not found" });
  }

  const normalizedAnswers = Array.isArray(answers)
    ? answers
    : Object.keys(answers || {}).reduce((acc, key) => {
        acc[Number(key)] = answers[key];
        return acc;
      }, []);

  const evaluatedAnswers = await Promise.all(
    test.questions.map(async (question, index) => {
      const selectedAnswer = normalizedAnswers[index] ?? "";
      const isCorrect =
        selectedAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();

      const explanationPayload = await explainAnswer({
        question: question.prompt,
        userAnswer: selectedAnswer,
        correctAnswer: question.correctAnswer
      });

      return {
        question: question.prompt,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: explanationPayload.summary
      };
    })
  );

  const correct = evaluatedAnswers.filter((answer) => answer.isCorrect).length;
  const score = Math.round((correct / test.questions.length) * 100);

  const result = await Result.create({
    user: req.user._id,
    test: test._id,
    topic: test.topic,
    difficulty: test.difficulty,
    score,
    totalQuestions: test.questions.length,
    answers: evaluatedAnswers,
    feedback: evaluatedAnswers
      .filter((item) => !item.isCorrect)
      .map((item) => item.explanation),
    timeSpent
  });

  test.status = "submitted";
  await test.save();

  if (bookmarks.length) {
    await Bookmark.insertMany(
      bookmarks.map((bookmark) => ({
        user: req.user._id,
        questionText: bookmark.questionText,
        topic: test.topic,
        difficulty: test.difficulty,
        notes: bookmark.notes || ""
      }))
    );
  }

  const leaderboard = await Leaderboard.findOne({ user: req.user._id });
  if (leaderboard) {
    const totalPoints = leaderboard.points + score;
    const nextTestsTaken = leaderboard.testsTaken + 1;
    leaderboard.points = totalPoints;
    leaderboard.testsTaken = nextTestsTaken;
    leaderboard.averageScore = Math.round(totalPoints / nextTestsTaken);
    leaderboard.streak += score >= 70 ? 1 : 0;
    await leaderboard.save();
  }

  const newBadges = calculateBadges(score, test.topic);
  if (newBadges.length) {
    await User.findByIdAndUpdate(req.user._id, {
      $push: { badges: { $each: newBadges } }
    });
  }

  res.status(201).json(result);
});

export const getTestHistory = asyncHandler(async (req, res) => {
  const history = await Result.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
});

export const getBookmarks = asyncHandler(async (req, res) => {
  const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookmarks);
});
