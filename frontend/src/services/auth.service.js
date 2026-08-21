import api from "../utils/axios.utils";

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  register: async (formData) => {
    const response = await api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/users/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/current-user");
    return response.data;
  },

  updateAccountDetails: async (data) => {
    const response = await api.patch("/users/update-account-details", data);
    return response.data;
  },

  updateAvatar: async (formData) => {
    const response = await api.patch("/users/update-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateCoverImage: async (formData) => {
    const response = await api.patch("/users/update-coverimage", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post("/users/change-password", data);
    return response.data;
  },

  changeCurrentPassword: async (data) => {
    const response = await api.post("/users/change-password", data);
    return response.data;
  },

  getChannelProfile: async (username) => {
    const response = await api.get(`/users/channel/${username}`);
    return response.data;
  },

  getWatchHistory: async () => {
    const response = await api.get("/users/history");
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get("/users/all-users", { params });
    return response.data;
  },

  getSuggestedUsers: async (params = {}) => {
    const response = await api.get("/users/suggested-users", { params });
    return response.data;
  },

  updateLocation: async (coords) => {
    const response = await api.patch("/users/update-location", coords);
    return response.data;
  },

  getNearbyUsers: async (params = {}) => {
    const response = await api.get("/users/nearby-users", { params });
    return response.data;
  },

  getDiscoverUsers: async () => {
    const response = await api.get("/users/discover-users");
    return response.data;
  },
};
