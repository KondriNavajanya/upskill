import api from "./api";

export const fetchProfile = async () => {
  const { data } = await api.get("/user/profile");
  return data;
};

export const fetchProgress = async () => {
  const { data } = await api.get("/user/progress");
  return data;
};

export const fetchLeaderboard = async () => {
  const { data } = await api.get("/user/leaderboard");
  return data;
};

export const updatePreferences = async (payload) => {
  const { data } = await api.put("/user/preferences", payload);
  return data;
};
