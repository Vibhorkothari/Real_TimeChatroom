import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiHeart, FiThumbsUp, FiSmile, FiMoreVertical } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useChatStore from '../../store/chatStore';
import './MessageItem.css';

const MessageItem = ({ message, isOwnMessage }) => {
  const { user } = useAuthStore();
  const { addReaction } = useChatStore();
  const [showMenu, setShowMenu] = useState(false);

  const handleReaction = async (emoji) => {
    try {
      if (!message._id) {
        console.error('Message ID is missing');
        return;
      }
      await addReaction(message._id, emoji);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };

  const getReactionCount = (emoji) => {
    return message.reactions?.filter(reaction => reaction.emoji === emoji).length || 0;
  };

  const hasUserReacted = (emoji) => {
    return message.reactions?.some(reaction => 
      reaction.user._id === user._id && reaction.emoji === emoji
    );
  };

  return (
    <div className={`message-item ${isOwnMessage ? 'own-message' : ''}`}>
      <div className="message-avatar">
        {message.sender.avatar ? (
          <img src={message.sender.avatar} alt={message.sender.username || 'User'} />
        ) : (
          <div className="avatar-placeholder">
            {(message.sender.username || 'U').charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-username">{message.sender.username || 'Unknown User'}</span>
          <span className="message-time">{formatTime(message.createdAt)}</span>
          {message.edited && <span className="edited-indicator">(edited)</span>}
        </div>
        
        <div className="message-text">
          {message.content}
        </div>
        
        {message.reactions && message.reactions.length > 0 && (
          <div className="message-reactions">
            {['👍', '❤️', '😊'].map((emoji) => {
              const count = getReactionCount(emoji);
              if (count > 0) {
                return (
                  <button
                    key={emoji}
                    className={`reaction-button ${hasUserReacted(emoji) ? 'reacted' : ''}`}
                    onClick={() => handleReaction(emoji)}
                  >
                    <span className="reaction-emoji">{emoji}</span>
                    <span className="reaction-count">{count}</span>
                  </button>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
      
      <div className="message-actions">
        <button
          className="action-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FiMoreVertical />
        </button>
        
        {showMenu && (
          <div className="message-menu">
            <button className="menu-item" onClick={() => handleReaction('👍')}>
              <FiThumbsUp />
              Like
            </button>
            <button className="menu-item" onClick={() => handleReaction('❤️')}>
              <FiHeart />
              Love
            </button>
            <button className="menu-item" onClick={() => handleReaction('😊')}>
              <FiSmile />
              Smile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
