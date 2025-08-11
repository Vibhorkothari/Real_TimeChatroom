import React from 'react';
import { format } from 'date-fns';
import { FiHeart, FiThumbsUp, FiSmile } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import MessageItem from './MessageItem';
import './MessageList.css';

const MessageList = ({ messages }) => {
  const { user } = useAuthStore();

  if (!messages || messages.length === 0) {
    return (
      <div className="message-list">
        <div className="empty-messages">
          <FiSmile className="empty-icon" />
          <h3>No messages yet</h3>
          <p>Start the conversation by sending a message!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageItem 
          key={message._id} 
          message={message} 
          isOwnMessage={message.sender._id === user._id}
        />
      ))}
    </div>
  );
};

export default MessageList;
