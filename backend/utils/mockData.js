import { CAREER_TRACKS } from "./constants.js";

export const buildMockQuestions = (topic, difficulty) => [
  {
    prompt: `Which concept is most important when solving ${topic} problems at ${difficulty} level?`,
    type: "mcq",
    options: [
      "Blind memorization",
      "Pattern recognition and tradeoff analysis",
      "Ignoring constraints",
      "Skipping dry runs"
    ],
    correctAnswer: "Pattern recognition and tradeoff analysis",
    explanation:
      "Strong technical problem solving comes from understanding patterns, constraints, and choosing the right approach for the tradeoff.",
    tags: [topic, difficulty]
  },
  {
    prompt: `When approaching ${topic}, what should you do before coding?`,
    type: "mcq",
    options: [
      "Write code immediately",
      "Estimate time and space complexity after shipping",
      "Clarify the input, output, and edge cases",
      "Only test the happy path"
    ],
    correctAnswer: "Clarify the input, output, and edge cases",
    explanation:
      "Clear problem framing prevents avoidable mistakes and leads to cleaner, more reliable solutions.",
    tags: [topic, difficulty]
  },
  {
    prompt: `Write a short strategy to solve a representative ${topic} challenge at ${difficulty} difficulty.`,
    type: "coding",
    starterCode: "// Describe your approach or write pseudocode here",
    correctAnswer:
      "A strong answer explains the data structure or architecture choice, complexity, and edge-case handling.",
    explanation:
      "Coding questions are evaluated using heuristic matching in mock mode, or richer AI assessment when the OpenAI key is configured.",
    tags: [topic, difficulty]
  }
];

export const buildMockExplanation = ({ question, correctAnswer }) => ({
  summary:
    "Focus on understanding why the correct answer satisfies constraints and why the alternatives fail.",
  steps: [
    "Restate what the question is asking in simple language",
    "Identify the concept or pattern being tested",
    "Eliminate incorrect options by checking assumptions",
    "Validate the final answer against edge cases or constraints"
  ],
  example: `For "${question}", the safest reasoning path is to compare each option with the core requirement and keep the one that best matches ${correctAnswer}.`
});

export const buildMockCareerSuggestion = (scoresByTopic) => {
  const entries = Object.entries(scoresByTopic);
  const normalized = entries.length ? entries : [["Frontend", 70], ["Backend", 75], ["Databases", 80]];

  const rankedTracks = Object.values(CAREER_TRACKS).map((track) => {
    const score =
      track.strengths.reduce((sum, topic) => {
        const value = normalized.find(([name]) => name === topic)?.[1] ?? 60;
        return sum + value;
      }, 0) / track.strengths.length;

    return { ...track, score: Math.round(score) };
  });

  rankedTracks.sort((a, b) => b.score - a.score);
  const winner = rankedTracks[0];

  return {
    recommendedRole: winner.title,
    confidence: `${winner.score}% match`,
    why:
      `Your strongest outcomes align with ${winner.strengths.join(", ")}, which are core skills for a ${winner.title}.`,
    roadmap: winner.roadmap,
    alternativeRoles: rankedTracks.slice(1, 3).map((track) => ({
      role: track.title,
      match: `${track.score}% match`
    }))
  };
};
