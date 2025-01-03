import { create } from 'zustand';
import axios from 'axios';

export const useRequestCount = create((set) => ({
  unviewedRequestCount: 0,
  
  fetchCounts: async (userId) => {
    try {
      // Use your existing API endpoint to get incoming requests
      const response = await axios.get(`/api/view-incoming-requests?user_id=${userId}`);
      set({ 
        unviewedRequestCount: response.data.incoming.length || 0,
      });
    } catch (error) {
      console.error('Error fetching request counts:', error);
    }
  },

  setUnviewedRequestCount: (count) => {
    set({ unviewedRequestCount: count });
  },
}));