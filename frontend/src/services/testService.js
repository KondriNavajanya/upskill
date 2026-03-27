import api from "./api";

export const generateTest = async (payload) => {
  const { data } = await api.post("/test/generate", payload);
  return data;
};

export const submitTest = async (payload) => {
  const { data } = await api.post("/test/submit", payload);
  return data;
};

export const fetchHistory = async () => {
  const { data } = await api.get("/test/history");
  return data;
};

export const fetchBookmarks = async () => {
  const { data } = await api.get("/test/bookmarks");
  return data;
};
