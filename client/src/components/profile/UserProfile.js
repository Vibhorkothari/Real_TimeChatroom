import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    setLoading(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      avatar: user?.avatar || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account information</p>
        </div>

        <div className="profile-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <div className="avatar-placeholder">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="avatar-info">
              <h3>{user?.username}</h3>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">
                <FiUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
                maxLength="20"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FiMail className="input-icon" />
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                className="form-input"
                disabled
              />
              <small className="form-help">Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="avatar">Avatar URL</label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="form-input"
                disabled={!isEditing}
                placeholder="https://example.com/avatar.jpg"
              />
              <small className="form-help">Enter a URL for your profile picture</small>
            </div>

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <FiX />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <FiSave />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <FiEdit2 />
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
