import OpenAI from "openai";
import {
  buildMockCareerSuggestion,
  buildMockExplanation,
  buildMockQuestions
} from "../utils/mockData.js";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const tryParseJSON = (content, fallback) => {
  try {
    return JSON.parse(content);
  } catch (error) {
    return fallback;
  }
};

export const generateQuestions = async ({ topic, difficulty }) => {
  if (!client) {
    return buildMockQuestions(topic, difficulty);
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You generate student-friendly technical tests. Return strict JSON with key questions containing 2 mcq and 1 coding item."
        },
        {
          role: "user",
          content: `Create a ${difficulty} test about ${topic}. Each question must include prompt, type, options if mcq, correctAnswer, explanation, starterCode if coding, and tags.`
        }
      ]
    });

    const parsed = tryParseJSON(response.choices[0].message.content, null);
    return parsed?.questions?.length ? parsed.questions : buildMockQuestions(topic, difficulty);
  } catch (error) {
    return buildMockQuestions(topic, difficulty);
  }
};

export const explainAnswer = async (payload) => {
  if (!client) {
    return buildMockExplanation(payload);
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You explain technical assessment answers clearly. Return JSON with summary, steps array, and example."
        },
        {
          role: "user",
          content: `Question: ${payload.question}\nUser answer: ${payload.userAnswer}\nCorrect answer: ${payload.correctAnswer}\nExplain simply.`
        }
      ]
    });

    return tryParseJSON(
      response.choices[0].message.content,
      buildMockExplanation(payload)
    );
  } catch (error) {
    return buildMockExplanation(payload);
  }
};

export const suggestCareer = async (scoresByTopic) => {
  if (!client) {
    return buildMockCareerSuggestion(scoresByTopic);
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a career mentor for CS students. Return JSON with recommendedRole, confidence, why, roadmap array, and alternativeRoles array."
        },
        {
          role: "user",
          content: `Recommend a tech role based on these topic scores: ${JSON.stringify(scoresByTopic)}`
        }
      ]
    });

    return tryParseJSON(
      response.choices[0].message.content,
      buildMockCareerSuggestion(scoresByTopic)
    );
  } catch (error) {
    return buildMockCareerSuggestion(scoresByTopic);
  }
};

const buildFallbackProblem = (topic, difficulty) => ({
  title: `${topic} Fundamentals Challenge`,
  difficulty,
  tags: [topic, "Algorithms"],
  description: `Given an input for ${topic}, compute and return the correct output according to the rules described in the problem statement.`,
  constraints: "1 <= n <= 10^5",
  examples: [
    {
      input: "5",
      output: "5",
      explanation: "Sample placeholder example."
    },
    {
      input: "10",
      output: "10",
      explanation: "Another sample example."
    },
    {
      input: "0",
      output: "0",
      explanation: "Handles edge cases."
    }
  ],
  testCases: [
    { input: "1", output: "1", hidden: false },
    { input: "2", output: "2", hidden: false },
    { input: "3", output: "3", hidden: false },
    { input: "4", output: "4", hidden: true },
    { input: "5", output: "5", hidden: true },
    { input: "6", output: "6", hidden: true },
    { input: "7", output: "7", hidden: true },
    { input: "8", output: "8", hidden: true },
    { input: "9", output: "9", hidden: true },
    { input: "10", output: "10", hidden: true }
  ],
  starterCode: {
    javascript: "function solve(input) {\n  return input;\n}",
    python: "def solve(input):\n    return input",
    cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nstring solve(string input) {\n    return input;\n}"
  },
  optimalSolution: "Use direct transformation in O(1) per operation.",
  timeComplexity: "O(n)",
  spaceComplexity: "O(1)"
});

const buildMockCodingExplanation = (problem) => {
  const approaches = (problem.approaches || []).map((a) => ({
    name: a.name,
    intuition: a.description,
    steps: [
      `Restate the problem: what are you given, and what must you return?`,
      `See why "${a.name}" applies: ${a.description}`,
      `Walk through the first example slowly, tracking variables.`,
      `State runtime: ${a.timeComplexity} time and ${a.spaceComplexity} extra space.`
    ],
    timeBest: a.timeComplexity,
    timeWorst: a.timeComplexity,
    timeAverage: a.timeComplexity,
    space: a.spaceComplexity,
    whenToUse: `Use this when ${a.description.charAt(0).toLowerCase()}${a.description.slice(1)}`,
    pros: ["Concrete pattern you can reuse on similar problems"],
    cons: ["May not be the only valid approach—compare tradeoffs below."]
  }));

  return {
    title: problem.title,
    coreIdeaBeginner: `${problem.coreIdea} If you are new, first ignore fancy jargon: write in your own words what pattern connects the examples.`,
    approaches,
    complexityNarrative: {
      bestCase:
        "Best case is when the input allows you to stop early—for example, already sorted data might let a two-pointer technique skip work. It is problem-specific.",
      worstCase:
        "Worst case is the tightest guarantee your algorithm needs: often when you must examine most of the input (e.g., every element once, or every pair). Match it to the slowest step in your loops.",
      averageCase:
        "Average case sits between the two when inputs are random or typical. For interviews, worst case is what usually matters unless the problem says otherwise."
    },
    realWorldExamples: [
      {
        title: "Where this shows up",
        analogy:
          "Search and counting problems appear in logs, recommendations, billing, and games—same loop/map ideas, different domain."
      },
      {
        title: "Tiny mental picture",
        analogy:
          "Think of organizing a deck of cards or matching socks: you either scan everything (brute force) or keep a handy pile/hash so future checks are fast."
      }
    ],
    beginnerTips: [
      "Rewrite the rules as bullet points before coding.",
      "Name variables after what they mean, not after algorithms you memorized.",
      ...(problem.hints || []).slice(0, 3)
    ],
    commonMistakes: [
      "Skipping constraints (empty input, negatives, duplicates).",
      "Off-by-one errors in indices or loop bounds.",
      "Returning the wrong shape (e.g., value vs index vs substring)."
    ]
  };
};

export const explainCodingProblem = async (problem, { userCode, language } = {}) => {
  const fallback = buildMockCodingExplanation(problem);
  if (!client) {
    return { ...fallback, source: "static" };
  }

  const snippet = (userCode || "").trim().slice(0, 4000);
  const sys = `You are a patient CS tutor for beginners. Respond ONLY with valid JSON (no markdown) using this shape:
{
  "title": string,
  "coreIdeaBeginner": string (plain English, no prerequisites beyond arrays/loops/maps),
  "approaches": [ { "name", "intuition", "steps": string[], "timeBest", "timeWorst", "timeAverage", "space", "whenToUse", "pros": string[], "cons": string[] } ],
  "complexityNarrative": { "bestCase", "worstCase", "averageCase" } (each explains Big-O style thinking for THIS problem in simple words),
  "realWorldExamples": [ { "title", "analogy" } ] (2-4 items tied to everyday or software scenarios),
  "beginnerTips": string[],
  "commonMistakes": string[]
}
Cover multiple approaches when relevant. Explain best vs worst time clearly for the main algorithm.`;

  const user = `Problem title: ${problem.title}
Difficulty: ${problem.difficulty}
Topic: ${problem.topic}
Description:
${problem.description}
Constraints: ${problem.constraints || "Not specified"}
Known approaches from platform: ${JSON.stringify(problem.approaches || [])}
Examples: ${JSON.stringify(problem.examples || [])}
Student language: ${language || "not specified"}
Student code (optional, may be incomplete):
${snippet || "(none)"}

Teach deeply; assume the reader has never seen this pattern before.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ]
    });
    const parsed = tryParseJSON(response.choices[0].message.content, null);
    if (parsed && typeof parsed.coreIdeaBeginner === "string") {
      return { ...parsed, source: "ai" };
    }
  } catch {
    /* fall through */
  }
  return { ...fallback, source: "static" };
};

export const generateProblemWithAI = async ({ topic, difficulty }) => {
  if (!client) {
    return buildFallbackProblem(topic, difficulty);
  }

  const prompt = `Generate a coding problem in JSON format.\n\nTopic: ${topic}\nDifficulty: ${difficulty}\n\nInclude:\n- title\n- description\n- constraints\n- 3 examples\n- 10 test cases (mark some hidden)\n- starter code (JavaScript, Python, C++)\n- optimal solution\n- time & space complexity`; 

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You generate high-quality coding interview problems. Return strict JSON only with keys: title, difficulty, tags, description, constraints, examples, testCases, starterCode, optimalSolution, timeComplexity, spaceComplexity."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    return tryParseJSON(
      response.choices[0].message.content,
      buildFallbackProblem(topic, difficulty)
    );
  } catch (error) {
    return buildFallbackProblem(topic, difficulty);
  }
};
