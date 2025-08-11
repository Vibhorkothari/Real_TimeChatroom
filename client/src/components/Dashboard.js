import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatRoom from './chat/ChatRoom';
import DirectMessages from './chat/DirectMessages';
import RoomList from './rooms/RoomList';
import CreateRoom from './rooms/CreateRoom';
import UserProfile from './profile/UserProfile';
import useAuthStore from '../store/authStore';
import useChatStore from '../store/chatStore';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { fetchRooms, fetchUsers, initializeSocket } = useChatStore();
  const [activeTab, setActiveTab] = useState('rooms');

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchRooms();
      fetchUsers();
    } else if (!isAuthenticated || !user) {
      // Redirect to login if not authenticated or no user
      navigate('/login');
    }
  }, [fetchRooms, fetchUsers, user, isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      
      <div className="main-content">
        <Routes>
          <Route path="/" element={<RoomList />} />
          <Route path="/room/:roomId" element={<ChatRoom />} />
          <Route path="/direct-messages" element={<DirectMessages />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
