import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// Removed unused imports: FiUsers, FiLock, FiPlus
import useChatStore from '../../store/chatStore';
import './CreateRoom.css';

const CreateRoom = () => {
  const navigate = useNavigate();
  const { createRoom } = useChatStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    maxMembers: 100
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Room name is required');
      return;
    }

    setLoading(true);
    
    try {
      const result = await createRoom(formData);
      
      if (result.success) {
        toast.success('Room created successfully!');
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Failed to create room');
      }
    } catch (error) {
      console.error('Create room error:', error);
      toast.error('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-room-container">
      <div className="create-room-card">
        <div className="create-room-header">
          <h1>Create New Room</h1>
          <p>Set up a new chat room for your community</p>
        </div>

        <form onSubmit={handleSubmit} className="create-room-form">
          <div className="form-group">
            <label htmlFor="name">Room Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter room name"
              className="form-input"
              maxLength="50"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this room is about"
              className="form-textarea"
              maxLength="200"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="maxMembers">Maximum Members</label>
            <input
              type="number"
              id="maxMembers"
              name="maxMembers"
              value={formData.maxMembers}
              onChange={handleChange}
              min="2"
              max="1000"
              className="form-input"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <div className="checkbox-text">
                <span className="checkbox-title">Private Room</span>
                <span className="checkbox-description">
                  Only invited users can join this room
                </span>
              </div>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
