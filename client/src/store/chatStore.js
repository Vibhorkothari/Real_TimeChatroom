import { create } from 'zustand';
import { io } from 'socket.io-client';
import axios from 'axios';
import useAuthStore from './authStore';

const useChatStore = create((set, get) => ({
  socket: null,
  rooms: [],
  currentRoom: null,
  messages: [],
  users: [],
  typingUsers: new Set(),
  loading: false,
  error: null,

  // Initialize socket connection
  initializeSocket: () => {
    const { token, socket } = useAuthStore.getState();
    if (!token) return;
    
    // Prevent multiple socket connections
    if (socket) {
      console.log('Socket already exists, skipping initialization');
      return;
    }

    const newSocket = io('http://localhost:5001', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      set({ error: null });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      if (error.message === 'Authentication error') {
        // Token is invalid, redirect to login
        useAuthStore.getState().logout();
      } else {
        set({ error: error.message });
      }
    });

    newSocket.on('new_message', ({ message }) => {
      const { currentRoom, messages } = get();
      if (currentRoom && message.room === currentRoom._id) {
        // Prevent duplicate messages by checking if message already exists
        const messageExists = messages.some(msg => msg._id === message._id);
        if (!messageExists) {
          set({
            messages: [...messages, message]
          });
        }
      }
    });

    newSocket.on('user_typing', ({ roomId, user }) => {
      const { currentRoom, typingUsers } = get();
      if (currentRoom && roomId === currentRoom._id) {
        const newTypingUsers = new Set(typingUsers);
        newTypingUsers.add(user.username);
        set({ typingUsers: newTypingUsers });
      }
    });

    newSocket.on('user_stopped_typing', ({ roomId, user }) => {
      const { currentRoom, typingUsers } = get();
      if (currentRoom && roomId === currentRoom._id) {
        const newTypingUsers = new Set(typingUsers);
        newTypingUsers.delete(user.username);
        set({ typingUsers: newTypingUsers });
      }
    });

    newSocket.on('user_joined_room', ({ roomId, user }) => {
      console.log(`${user.username} joined the room`);
    });

    newSocket.on('user_left_room', ({ roomId, user }) => {
      console.log(`${user.username} left the room`);
    });

    set({ socket: newSocket });
  },

  // Disconnect socket
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // Get user's rooms
  fetchRooms: async () => {
    const { token } = useAuthStore.getState();
    console.log('Fetching rooms with token:', token ? 'exists' : 'none');
    if (!token) {
      set({ rooms: [], loading: false });
      return;
    }
    
    set({ loading: true });
    try {
      const response = await axios.get('/api/rooms/my-rooms');
      set({ rooms: response.data.rooms, loading: false });
    } catch (error) {
      console.error('Fetch rooms error:', error);
      if (error.response?.status === 401) {
        console.log('401 error - clearing auth state');
        useAuthStore.getState().logout();
        set({ rooms: [], loading: false });
      } else {
        set({ error: error.response?.data?.message || 'Failed to fetch rooms', loading: false });
      }
    }
  },

  // Get a specific room
  fetchRoom: async (roomId) => {
    const { token } = useAuthStore.getState();
    if (!token) return null;
    
    try {
      const response = await axios.get(`/api/rooms/${roomId}`);
      return response.data.room;
    } catch (error) {
      console.error('Fetch room error:', error);
      return null;
    }
  },

  // Get public rooms
  fetchPublicRooms: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('/api/rooms/public');
      set({ rooms: response.data.rooms, loading: false });
    } catch (error) {
      console.error('Fetch public rooms error:', error);
      set({ error: error.response?.data?.message || 'Failed to fetch rooms', loading: false });
    }
  },

  // Create a new room
  createRoom: async (roomData) => {
    try {
      const response = await axios.post('/api/rooms', roomData);
      const newRoom = response.data.room;
      
      set(state => ({
        rooms: [...state.rooms, newRoom]
      }));

      return { success: true, room: newRoom };
    } catch (error) {
      console.error('Create room error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create room'
      };
    }
  },

  // Join a room
  joinRoom: async (roomId) => {
    try {
      const response = await axios.post(`/api/rooms/${roomId}/join`);
      const updatedRoom = response.data.room;
      
      set(state => ({
        rooms: state.rooms.map(room => 
          room._id === roomId ? updatedRoom : room
        )
      }));

      return { success: true, room: updatedRoom };
    } catch (error) {
      console.error('Join room error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to join room'
      };
    }
  },

  // Leave a room
  leaveRoom: async (roomId) => {
    try {
      await axios.post(`/api/rooms/${roomId}/leave`);
      
      set(state => ({
        rooms: state.rooms.filter(room => room._id !== roomId),
        currentRoom: state.currentRoom?._id === roomId ? null : state.currentRoom
      }));

      return { success: true };
    } catch (error) {
      console.error('Leave room error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to leave room'
      };
    }
  },

  // Set current room
  setCurrentRoom: (room) => {
    set({ currentRoom: room, messages: [], typingUsers: new Set() });
    if (room && room._id) {
      get().fetchMessages(room._id);
    }
  },

  // Fetch messages for a room
  fetchMessages: async (roomId, page = 1) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ messages: [] });
      return { totalPages: 0, currentPage: 1 };
    }
    
    try {
      const response = await axios.get(`/api/messages/room/${roomId}?page=${page}`);
      const { messages, totalPages, currentPage } = response.data;
      
      if (page === 1) {
        set({ messages });
      } else {
        set(state => ({
          messages: [...messages, ...state.messages]
        }));
      }

      return { totalPages, currentPage };
    } catch (error) {
      console.error('Fetch messages error:', error);
      if (error.response?.status === 401) {
        console.log('401 error - clearing auth state');
        useAuthStore.getState().logout();
        set({ messages: [] });
      } else {
        set({ error: error.response?.data?.message || 'Failed to fetch messages' });
      }
    }
  },

  // Send a message
  sendMessage: (content, messageType = 'text', replyTo = null) => {
    const { socket, currentRoom } = get();
    console.log('Sending message:', { content, currentRoom: currentRoom?._id, socket: !!socket });
    
    if (!socket) {
      console.error('No socket connection');
      return;
    }
    
    if (!currentRoom) {
      console.error('No current room set');
      return;
    }

    // Prevent duplicate sends
    if (socket.isSending) {
      console.log('Message already being sent, skipping');
      return;
    }

    socket.isSending = true;
    socket.emit('send_message', {
      roomId: currentRoom._id,
      content,
      messageType,
      replyTo
    });

    // Reset sending flag after a short delay
    setTimeout(() => {
      socket.isSending = false;
    }, 1000);
  },

  // Send direct message
  sendDirectMessage: (recipientId, content) => {
    const { socket } = get();
    if (!socket) return;

    socket.emit('send_direct_message', {
      recipientId,
      content
    });
  },

  // Start typing indicator
  startTyping: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit('typing_start', { roomId: currentRoom._id });
  },

  // Stop typing indicator
  stopTyping: () => {
    const { socket, currentRoom } = get();
    if (!socket || !currentRoom) return;

    socket.emit('typing_stop', { roomId: currentRoom._id });
  },

  // Add reaction to message
  addReaction: async (messageId, emoji) => {
    try {
      if (!messageId) {
        console.error('Message ID is required for reaction');
        return;
      }
      
      const response = await axios.post(`/api/messages/${messageId}/reactions`, { emoji });
      const updatedMessage = response.data.message;
      
      set(state => ({
        messages: state.messages.map(msg => 
          msg._id === messageId ? updatedMessage : msg
        )
      }));
      
      console.log('Reaction added successfully:', emoji);
    } catch (error) {
      console.error('Add reaction error:', error);
      // Show user-friendly error message
      if (error.response?.status === 401) {
        console.log('Unauthorized - user needs to login');
      } else if (error.response?.status === 404) {
        console.log('Message not found');
      } else {
        console.log('Failed to add reaction');
      }
    }
  },

  // Get all users
  fetchUsers: async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      set({ users: [] });
      return;
    }
    
    try {
      const response = await axios.get('/api/auth/users');
      set({ users: response.data.users });
    } catch (error) {
      console.error('Fetch users error:', error);
      if (error.response?.status === 401) {
        console.log('401 error - clearing auth state');
        useAuthStore.getState().logout();
        set({ users: [] });
      }
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useChatStore;
