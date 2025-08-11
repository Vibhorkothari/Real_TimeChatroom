import React, { useState } from 'react';
import { FiX, FiEdit, FiTrash2, FiUsers, FiLock, FiUnlock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import './RoomSettings.css';

const RoomSettings = ({ room, onClose, onUpdate }) => {
  const { user, token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [roomName, setRoomName] = useState(room?.name || '');
  const [roomDescription, setRoomDescription] = useState(room?.description || '');

  const isRoomCreator = room?.creator?._id === user?._id;

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/rooms/${room._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: roomName,
          description: roomDescription
        })
      });

      if (response.ok) {
        const updatedRoom = await response.json();
        toast.success('Room settings updated successfully!');
        setIsEditing(false);
        if (onUpdate) {
          onUpdate(updatedRoom);
        }
      } else {
        toast.error('Failed to update room settings');
      }
    } catch (error) {
      console.error('Update room error:', error);
      toast.error('Failed to update room settings');
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/rooms/${room._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('Room deleted successfully!');
          onClose();
          // Redirect to rooms list
          window.location.href = '/';
        } else {
          toast.error('Failed to delete room');
        }
      } catch (error) {
        console.error('Delete room error:', error);
        toast.error('Failed to delete room');
      }
    }
  };

  const leaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      try {
        const response = await fetch(`/api/rooms/${room._id}/leave`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          toast.success('Left room successfully!');
          onClose();
          // Redirect to rooms list
          window.location.href = '/';
        } else {
          toast.error('Failed to leave room');
        }
      } catch (error) {
        console.error('Leave room error:', error);
        toast.error('Failed to leave room');
      }
    }
  };

  return (
    <div className="room-settings-overlay">
      <div className="room-settings-modal">
        <div className="room-settings-header">
          <h2>Room Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="room-settings-content">
          <div className="room-info-section">
            <div className="room-avatar-large">
              {room?.name?.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2) || 'RM'}
            </div>
            
            <div className="room-details">
              {isEditing ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Room name"
                    className="edit-input"
                  />
                  <textarea
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    placeholder="Room description"
                    className="edit-textarea"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button className="save-btn" onClick={handleSave}>
                      Save
                    </button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="room-info">
                  <h3>{room?.name || 'Unnamed Room'}</h3>
                  <p>{room?.description || 'No description'}</p>
                  <div className="room-meta">
                    <span className="meta-item">
                      <FiUsers /> {room?.members?.length || 0} members
                    </span>
                    <span className="meta-item">
                      {room?.isPrivate ? <FiLock /> : <FiUnlock />}
                      {room?.isPrivate ? 'Private' : 'Public'}
                    </span>
                  </div>
                  {isRoomCreator && (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                      <FiEdit /> Edit Room
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="room-actions">
            {isRoomCreator ? (
              <button className="delete-btn" onClick={handleDeleteRoom}>
                <FiTrash2 /> Delete Room
              </button>
            ) : (
              <button className="leave-btn" onClick={leaveRoom}>
                Leave Room
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSettings;
