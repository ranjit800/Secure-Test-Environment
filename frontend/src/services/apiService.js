import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  // Start a new attempt
  startAttempt: async (userId, assessmentId, metadata) => {
    const response = await axios.post(`${API_URL}/attempts/start`, {
      userId,
      assessmentId,
      metadata
    });
    return response.data;
  },

  // Submit attempt
  submitAttempt: async (attemptId) => {
    const response = await axios.put(`${API_URL}/attempts/${attemptId}/submit`);
    return response.data;
  },

  // Get attempt details
  getAttempt: async (attemptId) => {
    const response = await axios.get(`${API_URL}/attempts/${attemptId}`);
    return response.data;
  },

  // Health check
  checkHealth: async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data.success;
    } catch (error) {
      return false;
    }
  }
};
