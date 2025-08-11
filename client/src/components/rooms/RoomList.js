import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiUsers, FiLock, FiMessageSquare, FiPlus } from 'react-icons/fi';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import './RoomList.css';

const RoomList = () => {
  const navigate = useNavigate();
  const { rooms, loading, fetchPublicRooms, joinRoom } = useChatStore();
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState('public');

  useEffect(() => {
    fetchPublicRooms();
  }, [fetchPublicRooms]);

  const handleJoinRoom = async (room) => {
    if (room.isPrivate) {
      toast.error('This is a private room');
      return;
    }

    const result = await joinRoom(room._id);
    if (result.success) {
      toast.success(`Joined ${room.name}`);
      navigate(`/dashboard/room/${room._id}`);
    } else {
      toast.error(result.message);
    }
  };

  const handleCreateRoom = () => {
    navigate('/dashboard/create-room');
  };

  const isUserInRoom = (room) => {
    if (!user || !user._id) return false;
    return room.members.some(member => member.user && member.user._id === user._id);
  };

  if (loading) {
    return (
      <div className="room-list-container">
        <div className="loading-message">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h1>Chat Rooms</h1>
        <button className="create-room-btn" onClick={handleCreateRoom}>
          <FiPlus />
          Create Room
        </button>
      </div>

      <div className="room-tabs">
        <button
          className={`tab-button ${selectedTab === 'public' ? 'active' : ''}`}
          onClick={() => setSelectedTab('public')}
        >
          <FiUsers />
          Public Rooms
        </button>
        <button
          className={`tab-button ${selectedTab === 'my' ? 'active' : ''}`}
          onClick={() => setSelectedTab('my')}
        >
          <FiMessageSquare />
          My Rooms
        </button>
      </div>

      <div className="rooms-grid">
        {!rooms || rooms.length === 0 ? (
          <div className="empty-state">
            <FiMessageSquare className="empty-icon" />
            <h3>No rooms available</h3>
            <p>Create a new room to get started!</p>
            <button className="btn btn-primary" onClick={handleCreateRoom}>
              Create Your First Room
            </button>
          </div>
        ) : (
          rooms.filter(room => room && room._id).map((room) => (
            <div key={room._id} className="room-card">
              <div className="room-header">
                <div className="room-info">
                  <h3 className="room-name">
                    {room.name}
                    {room.isPrivate && <FiLock className="private-icon" />}
                  </h3>
                  <p className="room-description">{room.description}</p>
                </div>
                <div className="room-stats">
                  <span className="member-count">
                    <FiUsers />
                    {room.members.length}
                  </span>
                </div>
              </div>

              <div className="room-footer">
                <div className="room-creator">
                  Created by {room.creator?.username || 'Unknown'}
                </div>
                <div className="room-actions">
                  {isUserInRoom(room) ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/dashboard/room/${room._id}`)}
                    >
                      Enter Room
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleJoinRoom(room)}
                      disabled={room.isPrivate}
                    >
                      Join Room
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList;
