import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiSmile } from 'react-icons/fi';
import useChatStore from '../../store/chatStore';

import './MessageInput.css';

const MessageInput = ({ roomId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { sendMessage, startTyping, stopTyping } = useChatStore();
  const emojiPickerRef = useRef(null);

  // Popular emojis array
  const popularEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
    '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '👍', '👎', '👌',
    '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇',
    '☝️', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️'
  ];

  useEffect(() => {
    let typingTimer;
    
    if (isTyping) {
      startTyping();
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        stopTyping();
      }, 3000);
    }

    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [isTyping, startTyping, stopTyping]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value && !isTyping) {
      setIsTyping(true);
    } else if (!value && isTyping) {
      setIsTyping(false);
      stopTyping();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    sendMessage(message.trim());
    setMessage('');
    setIsTyping(false);
    stopTyping();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiClick = (emoji, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use a ref to prevent double clicks
    if (emojiPickerRef.current?.isProcessing) return;
    
    emojiPickerRef.current.isProcessing = true;
    
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    
    // Reset after a short delay
    setTimeout(() => {
      if (emojiPickerRef.current) {
        emojiPickerRef.current.isProcessing = false;
      }
    }, 200);
  };

  const toggleEmojiPicker = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-wrapper">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="message-input"
            rows="1"
            maxLength="1000"
          />
          <div className="input-actions">
            <div className="emoji-picker-container" ref={emojiPickerRef}>
              <button type="button" className="emoji-button" onClick={toggleEmojiPicker}>
                <FiSmile />
              </button>
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {popularEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      type="button"
                      className="emoji-item"
                      onClick={(e) => handleEmojiClick(emoji, e)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="send-button" disabled={!message.trim()}>
              <FiSend />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
