import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiMessageCircle, FiX } from 'react-icons/fi';
import MessageItem from './MessageItem';
import './ThreadedMessage.css';

const ThreadedMessage = ({ message, replies = [], onReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    setIsReplying(true);
    onReply(message);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
  };

  return (
    <div className="threaded-message">
      {/* Main message */}
      <div className="main-message">
        <MessageItem message={message} />
        {replies.length > 0 && (
          <button
            className="toggle-replies-btn"
            onClick={() => setShowReplies(!showReplies)}
          >
            <FiMessageCircle />
            <span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
            {showReplies ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="replies-container">
          <div className="replies-list">
            {replies.map((reply) => (
              <div key={reply._id} className="reply-message">
                <div className="reply-indicator"></div>
                <MessageItem message={reply} />
              </div>
            ))}
          </div>
          
          {!isReplying && (
            <button className="reply-to-thread-btn" onClick={handleReply}>
              <FiMessageCircle />
              Reply to thread
            </button>
          )}
        </div>
      )}

      {/* Reply form */}
      {isReplying && (
        <div className="reply-form">
          <div className="reply-preview">
            <div className="reply-info">
              <span className="reply-label">Replying to:</span>
              <span className="reply-username">{message.sender.username}</span>
              <span className="reply-content">{message.content.substring(0, 50)}...</span>
            </div>
            <button className="cancel-reply-btn" onClick={handleCancelReply}>
              <FiX />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadedMessage;
