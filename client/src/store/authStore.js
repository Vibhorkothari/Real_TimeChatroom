import { create } from 'zustand';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setAuthHeaders: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      get().setAuthHeaders(token);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false
      });
      return { success: false, error: errorMessage };
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      
      get().setAuthHeaders(token);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false
      });
      return { success: false, error: errorMessage };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    get().setAuthHeaders(null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      get().setAuthHeaders(token);
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
      set({
        user: response.data,
        token,
        isAuthenticated: true,
        error: null
      });
    } catch (error) {
      if (error.response?.status === 401 && get().isAuthenticated) {
        get().logout();
      }
      set({ isAuthenticated: false });
    }
  },

  initialize: () => {
    const token = localStorage.getItem('token');
    if (token) {
      get().setAuthHeaders(token);
      set({ token, isAuthenticated: true });
      setTimeout(() => {
        get().getCurrentUser();
      }, 1000);
    } else {
      get().setAuthHeaders(null);
    }
  }
}));

export default useAuthStore;
