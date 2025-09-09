import React, { useState } from 'react';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import './ReplyButton.css';

const ReplyButton = ({ message, onReply, onCancel }) => {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying(true);
    onReply(message);
  };

  const handleCancel = () => {
    setIsReplying(false);
    onCancel();
  };

  if (isReplying) {
    return (
      <div className="reply-preview">
        <div className="reply-info">
          <span className="reply-label">Replying to:</span>
          <span className="reply-username">{message.sender.username}</span>
          <span className="reply-content">{message.content.substring(0, 50)}...</span>
        </div>
        <button className="cancel-reply-btn" onClick={handleCancel}>
          <FiX />
        </button>
      </div>
    );
  }

  return (
    <button className="reply-button" onClick={handleReply} title="Reply to message">
      <FiMessageCircle />
    </button>
  );
};

export default ReplyButton;
