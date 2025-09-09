import React from 'react';
import { FiSmile } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import MessageItem from './MessageItem';
import ThreadedMessage from './ThreadedMessage';
import './MessageList.css';

const MessageList = ({ messages, onReply }) => {
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

  // Organize messages into threads
  const organizeMessages = (messages) => {
    const threads = new Map();
    const topLevelMessages = [];

    messages.forEach(message => {
      if (message.replyTo) {
        // This is a reply
        if (!threads.has(message.replyTo)) {
          threads.set(message.replyTo, []);
        }
        threads.get(message.replyTo).push(message);
      } else {
        // This is a top-level message
        topLevelMessages.push(message);
      }
    });

    return { threads, topLevelMessages };
  };

  const { threads, topLevelMessages } = organizeMessages(messages);

  return (
    <div className="message-list">
      {topLevelMessages.map((message) => {
        const replies = threads.get(message._id) || [];
        
        if (replies.length > 0) {
          return (
            <ThreadedMessage
              key={message._id}
              message={message}
              replies={replies}
              onReply={onReply}
            />
          );
        } else {
          return (
            <MessageItem
              key={message._id}
              message={message}
              isOwnMessage={message.sender._id === user._id}
              onReply={onReply}
            />
          );
        }
      })}
    </div>
  );
};

export default MessageList;
