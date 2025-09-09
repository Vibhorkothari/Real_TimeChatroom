import React, { useState } from 'react';
import { format } from 'date-fns';
import { FiMoreVertical } from 'react-icons/fi';
import ReactionButton from './ReactionButton';
import FileMessage from './FileMessage';
import VoiceMessage from './VoiceMessage';
import ReplyButton from './ReplyButton';
import { parseMessageContent } from '../../utils/messageUtils';
import useAuthStore from '../../store/authStore';
import './MessageItem.css';

const MessageItem = ({ message, isOwnMessage, onReply }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useAuthStore();

  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
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
        
        {message.content && (
          <div className="message-text">
            {parseMessageContent(message.content, message.mentions || [], user?._id)}
          </div>
        )}
        
        {message.attachment && message.messageType === 'audio' && (
          <VoiceMessage 
            attachment={message.attachment} 
            isOwnMessage={isOwnMessage}
          />
        )}
        
        {message.attachment && message.messageType !== 'audio' && (
          <FileMessage 
            attachment={message.attachment} 
            messageType={message.messageType} 
          />
        )}
        
        <ReactionButton 
          messageId={message._id} 
          reactions={message.reactions || []} 
        />
      </div>
      
      <div className="message-actions">
        {onReply && (
          <ReplyButton 
            message={message} 
            onReply={onReply}
            onCancel={() => {}} 
          />
        )}
        
        <button
          className="action-button"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FiMoreVertical />
        </button>
        
        {showMenu && (
          <div className="message-menu">
            <button className="menu-item">
              Copy
            </button>
            {isOwnMessage && (
              <button className="menu-item">
                Edit
              </button>
            )}
            {isOwnMessage && (
              <button className="menu-item">
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
