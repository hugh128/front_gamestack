import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Games
export const gamesAPI = {
};

// Players
export const playersAPI = {
};

// Sessions
export const sessionsAPI = {
};

export default api;
