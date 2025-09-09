import React, { useState, useEffect } from 'react';
import { FiBell, FiBellOff, FiVolume2, FiVolumeX, FiSmartphone } from 'react-icons/fi';
import notificationService from '../../services/notificationService';
import './NotificationSettings.css';

const NotificationSettings = ({ isOpen, onClose }) => {
  const [permission, setPermission] = useState('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  useEffect(() => {
    // Load settings from localStorage
    const savedSound = localStorage.getItem('notificationSound');
    const savedVibration = localStorage.getItem('notificationVibration');
    
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
    if (savedVibration !== null) {
      setVibrationEnabled(savedVibration === 'true');
    }

    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    const newPermission = await notificationService.requestPermission();
    setPermission(newPermission);
  };

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notificationSound', newValue.toString());
  };

  const handleVibrationToggle = () => {
    const newValue = !vibrationEnabled;
    setVibrationEnabled(newValue);
    localStorage.setItem('notificationVibration', newValue.toString());
  };

  const testNotification = () => {
    if (permission === 'granted') {
      notificationService.showNotification('Test Notification', {
        body: 'This is a test notification from your chat app!',
        icon: '/favicon.ico'
      });
      
      if (soundEnabled) {
        notificationService.playNotificationSound();
      }
      
      if (vibrationEnabled) {
        notificationService.vibrate();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-settings-overlay">
      <div className="notification-settings-modal">
        <div className="notification-settings-header">
          <h3>Notification Settings</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="notification-settings-content">
          <div className="setting-group">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Browser Notifications</h4>
                <p>Show desktop notifications for new messages</p>
              </div>
              <div className="setting-control">
                {permission === 'granted' ? (
                  <div className="permission-status granted">
                    <FiBell />
                    <span>Enabled</span>
                  </div>
                ) : permission === 'denied' ? (
                  <div className="permission-status denied">
                    <FiBellOff />
                    <span>Blocked</span>
                  </div>
                ) : (
                  <button 
                    className="permission-btn"
                    onClick={handleRequestPermission}
                  >
                    <FiBell />
                    Enable Notifications
                  </button>
                )}
              </div>
            </div>

            {permission === 'granted' && (
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Notification Sound</h4>
                  <p>Play sound when receiving notifications</p>
                </div>
                <div className="setting-control">
                  <button
                    className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
                    onClick={handleSoundToggle}
                  >
                    {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
                  </button>
                </div>
              </div>
            )}

            {permission === 'granted' && (
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Vibration</h4>
                  <p>Vibrate device when receiving notifications</p>
                </div>
                <div className="setting-control">
                  <button
                    className={`toggle-btn ${vibrationEnabled ? 'active' : ''}`}
                    onClick={handleVibrationToggle}
                  >
                    <FiSmartphone />
                  </button>
                </div>
              </div>
            )}
          </div>

          {permission === 'granted' && (
            <div className="test-section">
              <button className="test-btn" onClick={testNotification}>
                Test Notification
              </button>
            </div>
          )}

          {permission === 'denied' && (
            <div className="help-section">
              <h4>Notifications are blocked</h4>
              <p>To enable notifications:</p>
              <ol>
                <li>Click the lock icon in your browser's address bar</li>
                <li>Select "Allow" for notifications</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
