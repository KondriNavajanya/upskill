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
