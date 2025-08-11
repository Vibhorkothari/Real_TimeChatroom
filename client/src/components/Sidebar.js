import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiUser, 
  FiLogOut,
  FiHome,
  FiMessageCircle,
  FiMenu,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = ({ user, activeTab, setActiveTab, onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'rooms':
        navigate('/dashboard');
        break;
      case 'direct-messages':
        navigate('/dashboard/direct-messages');
        break;
      case 'create-room':
        navigate('/dashboard/create-room');
        break;
      case 'profile':
        navigate('/dashboard/profile');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div className="sidebar-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="user-info">
          <div className="user-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-details">
            <h3>{user?.username}</h3>
            <span className="user-status online">Online</span>
          </div>
        </div>
        <div className="mobile-menu-toggle mobile-only">
          <FiMenu className="hamburger-icon" />
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => handleTabClick('rooms')}
            >
              <FiHome className="nav-icon" />
              <span>Rooms</span>
            </button>
          </li>
          
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'direct-messages' ? 'active' : ''}`}
              onClick={() => handleTabClick('direct-messages')}
            >
              <FiMessageCircle className="nav-icon" />
              <span>Direct Messages</span>
            </button>
          </li>
          
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'create-room' ? 'active' : ''}`}
              onClick={() => handleTabClick('create-room')}
            >
              <FiPlus className="nav-icon" />
              <span>Create Room</span>
            </button>
          </li>
          
          <li className="nav-item">
            <button
              className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick('profile')}
            >
              <FiUser className="nav-icon" />
              <span>Profile</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle-button" onClick={handleThemeToggle}>
          {isDarkMode ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
