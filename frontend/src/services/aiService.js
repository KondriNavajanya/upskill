import api from "./api";

export const fetchCareerSuggestion = async () => {
  const { data } = await api.post("/ai/career");
  return data;
};

export const fetchExplanation = async (payload) => {
  const { data } = await api.post("/ai/explain", payload);
  return data;
};
