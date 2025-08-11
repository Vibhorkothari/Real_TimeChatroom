import { create } from 'zustand';
import io from 'socket.io-client';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5001';

const useChatStore = create((set, get) => ({
  // State
  rooms: [],
  currentRoom: null,
  messages: [],
  users: [],
  socket: null,
  isConnected: false,
  isLoading: false,
  error: null,

  // Socket connection
  initializeSocket: () => {
    if (get().socket) return;
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      set({ socket, isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      set({ isConnected: false });
    });

    socket.on('new_message', (message) => {
      const { messages } = get();
      const messageExists = messages.some(m => m._id === message._id);
      if (!messageExists) {
        set({ messages: [...messages, message] });
      }
    });

    socket.on('user_joined', (data) => {
      console.log('User joined:', data);
    });

    socket.on('user_left', (data) => {
      console.log('User left:', data);
    });

    socket.on('typing_start', (data) => {
      // Handle typing indicator
    });

    socket.on('typing_stop', (data) => {
      // Handle typing indicator stop
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  // Room management
  fetchRooms: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/rooms/my-rooms`);
      set({ rooms: response.data });
    } catch (error) {
      console.error('Fetch rooms error:', error);
      if (error.response?.status === 401) {
        set({ rooms: [] });
      }
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/rooms`, roomData);
      const newRoom = response.data;
      set({ rooms: [...get().rooms, newRoom] });
      return { success: true, room: newRoom };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create room'
      };
    }
  },

  joinRoom: async (roomId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/rooms/${roomId}/join`);
      await get().fetchRooms();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to join room'
      };
    }
  },

  setCurrentRoom: (room) => {
    if (room && room._id) {
      set({ currentRoom: room });
      get().fetchMessages(room._id);
    }
  },

  fetchRoom: async (roomId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error('Fetch room error:', error);
      return null;
    }
  },

  // Message management
  fetchMessages: async (roomId, page = 1) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/messages/room/${roomId}?page=${page}`);
      set({ messages: response.data.messages || [] });
    } catch (error) {
      console.error('Fetch messages error:', error);
      if (error.response?.status === 401) {
        set({ messages: [] });
      }
    }
  },

  sendMessage: async (content, roomId) => {
    const { socket } = get();
    if (!socket || socket.isSending) return { success: false, error: 'Socket not ready' };

    try {
      socket.isSending = true;
      const response = await axios.post(`${API_BASE_URL}/api/messages`, {
        content,
        roomId
      });

      const message = response.data;
      set({ messages: [...get().messages, message] });

      // Reset sending flag after 1 second
      setTimeout(() => {
        if (socket) socket.isSending = false;
      }, 1000);

      return { success: true, message };
    } catch (error) {
      if (socket) socket.isSending = false;
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send message'
      };
    }
  },

  addReaction: async (messageId, reaction) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/messages/${messageId}/reactions`, {
        reaction
      });
      
      const { messages } = get();
      const updatedMessages = messages.map(msg => 
        msg._id === messageId ? { ...msg, reactions: response.data.reactions } : msg
      );
      
      set({ messages: updatedMessages });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add reaction'
      };
    }
  },

  // User management
  fetchUsers: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/users`);
      set({ users: response.data });
    } catch (error) {
      console.error('Fetch users error:', error);
      if (error.response?.status === 401) {
        set({ users: [] });
      }
    }
  },

  // Clear state
  clearMessages: () => {
    set({ messages: [] });
  },

  clearCurrentRoom: () => {
    set({ currentRoom: null, messages: [] });
  }
}));

export default useChatStore;
