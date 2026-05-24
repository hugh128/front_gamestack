import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Games
export const gamesAPI = {
  getAll: (params) => api.get("/games", { params }),
  getById: (id) => api.get(`/games/${id}`),
  create: (data) => api.post("/games", data),
  update: (id, data) => api.put(`/games/${id}`, data),
  delete: (id) => api.delete(`/games/${id}`),
  addReview: (id, data) => api.post(`/games/${id}/reviews`, data),
  deleteReview: (id, reviewId) => api.delete(`/games/${id}/reviews/${reviewId}`),
};

// Players
export const playersAPI = {
  getAll: (params) => api.get("/players", { params }),
  getById: (id) => api.get(`/players/${id}`),
  create: (data) => api.post("/players", data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  addLogro: (id, data) => api.post(`/players/${id}/logros`, data),
  deleteLogro: (id, logroId) => api.delete(`/players/${id}/logros/${logroId}`),
};

// Sessions
export const sessionsAPI = {
  getAll: (params) => api.get("/sessions", { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (data) => api.post("/sessions", data),
  update: (id, data) => api.put(`/sessions/${id}`, data),
  delete: (id) => api.delete(`/sessions/${id}`),
  getStats: () => api.get("/sessions/stats/globales"),
};

export default api;
