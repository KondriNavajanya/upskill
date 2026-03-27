import api from "./api";

export const getAllProblems = async (params) => {
  const { data } = await api.get("/problems", { params });
  return data;
};

export const getProblemById = async (id) => {
  const { data } = await api.get(`/problems/${id}`);
  return data;
};

export const getProblemsByDifficulty = async (difficulty) => {
  const { data } = await api.get(`/problems/difficulty/${difficulty}`);
  return data;
};

export const getAllTags = async () => {
  const { data } = await api.get("/problems/tags");
  return data;
};

export const runCode = async (code, language, input) => {
  const { data } = await api.post("/submissions/run", {
    code,
    language,
    input
  });
  return data;
};

export const submitCode = async (problemId, code, language) => {
  const { data } = await api.post("/submissions/submit", {
    problemId,
    code,
    language
  });
  return data;
};

export const getSubmissions = async (params) => {
  const { data } = await api.get("/submissions", { params });
  return data;
};

export const getSubmissionById = async (id) => {
  const { data } = await api.get(`/submissions/${id}`);
  return data;
};

export const getCodeReview = async (code, language, problemId) => {
  const { data } = await api.post("/ai/code-review", {
    code,
    language,
    problemId
  });
  return data;
};

export const getSkillAnalysis = async () => {
  const { data } = await api.get("/ai/analysis");
  return data;
};

export const generateRoadmap = async () => {
  const { data } = await api.post("/ai/roadmap");
  return data;
};

export const getCareerPath = async () => {
  const { data } = await api.post("/ai/career-path");
  return data;
};
