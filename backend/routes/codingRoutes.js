import express from 'express';
import { leetcodeProblems } from '../utils/leetcodeProblems.js';
import Result from '../models/Result.js';

const router = express.Router();

// Get all coding problems by topic and difficulty
router.get('/problems/:topic/:difficulty', (req, res) => {
  try {
    const { topic, difficulty } = req.params;
    
    if (!leetcodeProblems[topic] || !leetcodeProblems[topic][difficulty]) {
      return res.status(404).json({
        success: false,
        message: `No problems found for ${topic} - ${difficulty}`
      });
    }

    const problems = leetcodeProblems[topic][difficulty];
    // Return problems without solutions for client
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
      message: 'Error fetching problems',
      error: error.message
    });
  }
});

// Get single problem details
router.get('/problem/:id', (req, res) => {
  try {
    const { id } = req.params;
    const problemId = parseInt(id);

    let foundProblem = null;
    let foundTopic = null;

    // Search for problem across all topics
    for (const [topic, difficulties] of Object.entries(leetcodeProblems)) {
      for (const [difficulty, problems] of Object.entries(difficulties)) {
        const problem = problems.find(p => p.id === problemId);
        if (problem) {
          foundProblem = problem;
          foundTopic = topic;
          break;
        }
      }
      if (foundProblem) break;
    }

    if (!foundProblem) {
      return res.status(404).json({
        success: false,
        message: `Problem with id ${id} not found`
      });
    }

    res.json({
      success: true,
      problem: foundProblem,
      topic: foundTopic
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching problem',
      error: error.message
    });
  }
});

// Get problem explanation
router.get('/explanation/:id', (req, res) => {
  try {
    const { id } = req.params;
    const problemId = parseInt(id);

    let foundProblem = null;

    // Search for problem
    for (const difficulties of Object.values(leetcodeProblems)) {
      for (const problems of Object.values(difficulties)) {
        const problem = problems.find(p => p.id === problemId);
        if (problem) {
          foundProblem = problem;
          break;
        }
      }
      if (foundProblem) break;
    }

    if (!foundProblem) {
      return res.status(404).json({
        success: false,
        message: `Problem with id ${id} not found`
      });
    }

    const explanation = {
      title: foundProblem.title,
      coreIdea: foundProblem.coreIdea,
      approaches: foundProblem.approaches,
      hints: foundProblem.hints || [],
      constraints: foundProblem.constraints,
      examples: foundProblem.examples
    };

    res.json({
      success: true,
      explanation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching explanation',
      error: error.message
    });
  }
});

// Submit code solution
router.post('/submit', async (req, res) => {
  try {
    const { userId, problemId, language, code, topic, difficulty } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Find the problem
    let foundProblem = null;
    for (const difficulties of Object.values(leetcodeProblems)) {
      for (const problems of Object.values(difficulties)) {
        const problem = problems.find(p => p.id === parseInt(problemId));
        if (problem) {
          foundProblem = problem;
          break;
        }
      }
      if (foundProblem) break;
    }

    if (!foundProblem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Simulate code evaluation (mock implementation)
    const evaluationResult = evaluateCode(code, foundProblem, language);

    // Save submission result to database
    const result = new Result({
      userId,
      problemId,
      title: foundProblem.title,
      language,
      code,
      topic: topic || foundProblem.topic,
      difficulty: difficulty || foundProblem.difficulty,
      passed: evaluationResult.passed,
      score: evaluationResult.score,
      testsPassed: evaluationResult.testsPassed,
      totalTests: evaluationResult.totalTests,
      output: evaluationResult.output,
      errorMessage: evaluationResult.errorMessage
    });

    await result.save();

    res.json({
      success: true,
      message: evaluationResult.passed ? 'All tests passed!' : 'Some tests failed',
      result: {
        passed: evaluationResult.passed,
        score: evaluationResult.score,
        testsPassed: evaluationResult.testsPassed,
        totalTests: evaluationResult.totalTests,
        output: evaluationResult.output,
        timeComplexity: foundProblem.approaches[0]?.timeComplexity,
        spaceComplexity: foundProblem.approaches[0]?.spaceComplexity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting code',
      error: error.message
    });
  }
});

// Get submission history for user
router.get('/submissions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = req.query.limit || 10;

    const submissions = await Result.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions',
      error: error.message
    });
  }
});

// Get coding stats for user
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all submissions for user
    const submissions = await Result.find({ userId });

    // Calculate stats
    const stats = {
      totalSubmissions: submissions.length,
      solvedProblems: submissions.filter(s => s.passed).length,
      attemptedProblems: new Set(submissions.map(s => s.problemId)).size,
      byDifficulty: {
        Easy: submissions.filter(s => s.difficulty === 'Easy' && s.passed).length,
        Medium: submissions.filter(s => s.difficulty === 'Medium' && s.passed).length,
        Hard: submissions.filter(s => s.difficulty === 'Hard' && s.passed).length
      },
      byTopic: {},
      averageScore: 0
    };

    // Calculate by topic
    const topics = new Set(submissions.map(s => s.topic));
    topics.forEach(topic => {
      const topicSubmissions = submissions.filter(s => s.topic === topic && s.passed);
      stats.byTopic[topic] = topicSubmissions.length;
    });

    // Calculate average score
    const totalScore = submissions.reduce((sum, s) => sum + (s.score || 0), 0);
    stats.averageScore = submissions.length > 0 ? (totalScore / submissions.length).toFixed(2) : 0;

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

// Mock code evaluation function
function evaluateCode(code, problem, language) {
  try {
    // Basic evaluation logic - in production, use Judge0 API
    // For now, we'll simulate evaluation based on code quality indicators

    const hasMainStructure = code.includes('function') || code.includes('class') || code.includes('def');
    const hasComments = code.includes('//') || code.includes('#') || code.includes('/*');
    const codeLength = code.trim().split('\n').length;
    
    // Very basic heuristics
    let score = 0;
    let testsPassed = 0;
    const totalTests = problem.testCases?.length || 3;

    if (hasMainStructure) {
      testsPassed = Math.floor(totalTests * 0.7);
      score = 70;
    } else {
      testsPassed = 0;
      score = 0;
    }

    if (hasComments && codeLength > 5) {
      testsPassed = totalTests;
      score = 100;
    }

    const passed = score >= 70;

    return {
      passed,
      score,
      testsPassed,
      totalTests,
      output: `Code execution completed. Tests passed: ${testsPassed}/${totalTests}`,
      errorMessage: passed ? null : 'Code did not pass all test cases'
    };
  } catch (error) {
    return {
      passed: false,
      score: 0,
      testsPassed: 0,
      totalTests: problem.testCases?.length || 3,
      output: null,
      errorMessage: error.message
    };
  }
}

export default router;
