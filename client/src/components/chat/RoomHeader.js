import React from 'react';
import { FiUsers, FiLock, FiMessageCircle } from 'react-icons/fi';
import './RoomHeader.css';

const RoomHeader = ({ room }) => {
  if (!room) {
    return (
      <div className="room-header">
        <div className="room-info">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="room-header">
      <div className="room-info">
        <div className="room-icon">
          {room.isDirectMessage ? (
            <FiMessageCircle />
          ) : room.isPrivate ? (
            <FiLock />
          ) : (
            <FiUsers />
          )}
        </div>
        <div className="room-details">
          <h2 className="room-name">{room.name}</h2>
          {room.description && (
            <p className="room-description">{room.description}</p>
          )}
        </div>
      </div>
      
      <div className="room-stats">
        <div className="member-count">
          <FiUsers />
          <span>{room.members?.length || 0} members</span>
        </div>
      </div>
    </div>
  );
};

export default RoomHeader;
