import express from "express";
import { mockQuestions, mockExplanations, codingQuestions } from "../utils/mockQuestions.js";
import asyncHandler from "../utils/asyncHandler.js";
import Result from "../models/Result.js";

const router = express.Router();

// Get MCQ questions based on category and difficulty
router.get("/mcq", (req, res) => {
  try {
    const { category, difficulty } = req.query;

    if (!category || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Category and difficulty are required"
      });
    }

    if (!mockQuestions[category]) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    if (!mockQuestions[category][difficulty]) {
      return res.status(404).json({
        success: false,
        message: "Difficulty level not found for this category"
      });
    }

    const questions = mockQuestions[category][difficulty];
    
    // Return up to 10 questions
    const selectedQuestions = questions.slice(0, Math.min(10, questions.length));

    res.json({
      success: true,
      category,
      difficulty,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        // Don't send correctAnswer to frontend during test
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get explanation for a topic
router.get("/explain", (req, res) => {
  try {
    const { topic } = req.query;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic is required"
      });
    }

    if (!mockExplanations[topic]) {
      return res.status(404).json({
        success: false,
        message: "Explanation not found for this topic"
      });
    }

    const explanation = mockExplanations[topic];

    res.json({
      success: true,
      topic,
      ...explanation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Check answers and calculate score
router.post("/check-answers", (req, res) => {
  try {
    const { category, difficulty, answers } = req.body;

    if (!category || !difficulty || !answers) {
      return res.status(400).json({
        success: false,
        message: "Category, difficulty, and answers are required"
      });
    }

    const questions = mockQuestions[category][difficulty];
    let correctCount = 0;
    const results = [];

    answers.forEach((answer, index) => {
      const question = questions[index];
      const isCorrect = question && answer.selectedOption === question.correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }

      results.push({
        questionId: question?.id,
        question: question?.question,
        userAnswer: answer.selectedOption,
        correctAnswer: question?.correctAnswer,
        isCorrect,
        explanation: question?.explanation
      });
    });

    const score = Math.round((correctCount / answers.length) * 100);

    res.json({
      success: true,
      score,
      correctCount,
      totalCount: answers.length,
      results,
      grade: score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "F"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get coding questions
router.get("/coding", (req, res) => {
  try {
    const { difficulty } = req.query;

    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: "Difficulty is required"
      });
    }

    if (!codingQuestions[difficulty]) {
      return res.status(404).json({
        success: false,
        message: "Difficulty level not found"
      });
    }

    const questions = codingQuestions[difficulty];

    res.json({
      success: true,
      difficulty,
      totalQuestions: questions.length,
      questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Submit coding solution
router.post("/submit-code", (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: "Problem ID, language, and code are required"
      });
    }

    // Mock validation - in production this would use Judge0 API
    const mockResult = {
      status: "completed",
      verdict: code.trim().length > 10 ? "Accepted" : "Wrong Answer",
      executionTime: Math.random() * 1000 + " ms",
      memoryUsed: Math.random() * 50 + " MB"
    };

    res.json({
      success: true,
      ...mockResult,
      message: mockResult.verdict === "Accepted" ? "Solution accepted!" : "Solution has errors"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get categories
router.get("/categories", (req, res) => {
  try {
    const categories = Object.keys(mockQuestions).map(cat => ({
      name: cat,
      difficulties: Object.keys(mockQuestions[cat])
    }));

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Save test result to database
router.post("/save-result", asyncHandler(async (req, res) => {
  const { topic, difficulty, score, totalQuestions, timeSpent } = req.body;

  if (!topic || !difficulty || score === undefined || !totalQuestions) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    });
  }

  // Create result (without user authentication for now - can be enhanced)
  const result = new Result({
    topic,
    difficulty,
    score,
    totalQuestions,
    timeSpent: timeSpent || 0,
    user: null, // Can be added when authentication is integrated
    test: null
  });

  await result.save();

  res.json({
    success: true,
    message: "Result saved successfully",
    result
  });
}));

// Get user performance stats
router.get("/performance-stats", asyncHandler(async (req, res) => {
  try {
    const stats = await Result.aggregate([
      {
        $group: {
          _id: "$topic",
          avgScore: { $avg: "$score" },
          totalAttempts: { $sum: 1 },
          highestScore: { $max: "$score" }
        }
      }
    ]);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.json({
      success: true,
      stats: [] // Return empty stats if no data
    });
  }
}));

export default router;
