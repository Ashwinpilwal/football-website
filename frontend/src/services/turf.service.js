import api from "../utils/axios.utils";

export const turfService = {
  getNearbyTurfs: async (params = {}) => {
    const response = await api.get("/turfs/nearby", { params });
    return response.data;
  },

  getTurfById: async (turfId) => {
    const response = await api.get(`/turfs/${turfId}`);
    return response.data;
  },

  createTurf: async (formData) => {
    const response = await api.post("/turfs/create-turf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateTurf: async (turfId, data) => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const response = await api.patch(`/turfs/${turfId}`, data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return response.data;
  },

  deleteTurf: async (turfId) => {
    const response = await api.delete(`/turfs/${turfId}`);
    return response.data;
  },
};

export const bookingService = {
  getBookedSlots: async (turfId, date) => {
    const response = await api.get(`/bookings/turf/${turfId}/booked-slots`, {
      params: { date },
    });
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post("/bookings/create-booking", bookingData);
    return response.data;
  },

  getMyBookings: async (status = "") => {
    const url = status && status !== "all" ? `/bookings/my-bookings?status=${status}` : "/bookings/my-bookings";
    const response = await api.get(url);
    return response.data;
  },

  getAdminBookingRequests: async (status = "") => {
    const url = status && status !== "all" ? `/bookings/admin/requests?status=${status}` : "/bookings/admin/requests";
    const response = await api.get(url);
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  getTurfBookings: async (turfId, status = "") => {
    const url = status && status !== "all" ? `/bookings/turf/${turfId}?status=${status}` : `/bookings/turf/${turfId}`;
    const response = await api.get(url);
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data;
  },
};

export const pitchService = {
  getNearbyPitches: async (lat, lng) => {
    const response = await api.get("/pitches/nearby", { params: { lat, lng } });
    return response.data;
  },
};

export const ratingService = {
  getTurfRatings: async (turfId) => {
    const response = await api.get(`/ratings/turf/${turfId}`);
    return response.data;
  },

  addOrUpdateRating: async (turfId, { rating, review }) => {
    const response = await api.post(`/ratings/turf/${turfId}`, { rating, review });
    return response.data;
  },

  deleteRating: async (ratingId) => {
    const response = await api.delete(`/ratings/${ratingId}`);
    return response.data;
  },
};

