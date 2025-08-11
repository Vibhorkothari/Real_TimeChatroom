import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      // Set auth headers for API calls
      setAuthHeaders: (token) => {
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Set auth header with token:', token.substring(0, 20) + '...');
        } else {
          delete axios.defaults.headers.common['Authorization'];
          console.log('Cleared auth header');
        }
      },

      // Login
      login: async (email, password) => {
        set({ loading: true });
        try {
          const response = await axios.post('/api/auth/login', {
            email,
            password
          });

          const { token, user } = response.data;
          
          get().setAuthHeaders(token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false
          });

          return { success: true };
        } catch (error) {
          set({ loading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Login failed'
          };
        }
      },

      // Register
      register: async (username, email, password) => {
        set({ loading: true });
        try {
          const response = await axios.post('/api/auth/register', {
            username,
            email,
            password
          });

          const { token, user } = response.data;
          
          get().setAuthHeaders(token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            loading: false
          });

          return { success: true };
        } catch (error) {
          set({ loading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Registration failed'
          };
        }
      },

      // Logout
      logout: async () => {
        try {
          if (get().token) {
            await axios.post('/api/auth/logout');
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          get().setAuthHeaders(null);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false
          });
        }
      },

      // Get current user
      getCurrentUser: async () => {
        if (!get().token) return;

        try {
          const response = await axios.get('/api/auth/me');
          set({ user: response.data.user });
        } catch (error) {
          console.error('Get current user error:', error);
          // Only logout on 401 if we're not in the middle of initialization
          if (error.response?.status === 401 && get().isAuthenticated) {
            console.log('401 error - clearing auth state');
            get().logout();
          }
        }
      },

      // Update profile
      updateProfile: async (updates) => {
        try {
          const response = await axios.put('/api/auth/profile', updates);
          set({ user: response.data.user });
          return { success: true };
        } catch (error) {
          return {
            success: false,
            message: error.response?.data?.message || 'Update failed'
          };
        }
      },

      // Initialize auth state
      initialize: () => {
        const { token } = get();
        console.log('Initializing auth with token:', token ? 'exists' : 'none');
        if (token) {
          get().setAuthHeaders(token);
          // Validate token after a short delay to let the app load
          setTimeout(() => {
            get().getCurrentUser();
          }, 1000);
        } else {
          // Clear any existing auth headers if no token
          get().setAuthHeaders(null);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useAuthStore;
