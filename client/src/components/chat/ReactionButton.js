import React, { useState } from 'react';
import { FiSmile, FiHeart, FiThumbsUp, FiFrown, FiMeh } from 'react-icons/fi';
import useChatStore from '../../store/chatStore';
import './ReactionButton.css';

const ReactionButton = ({ messageId, reactions = [] }) => {
  const { addReaction, user } = useChatStore();
  const [showPicker, setShowPicker] = useState(false);

  const reactionEmojis = [
    { emoji: '👍', icon: FiThumbsUp, label: 'Like' },
    { emoji: '❤️', icon: FiHeart, label: 'Love' },
    { emoji: '😂', icon: FiSmile, label: 'Laugh' },
    { emoji: '😮', icon: FiSmile, label: 'Wow' },
    { emoji: '😢', icon: FiFrown, label: 'Sad' },
    { emoji: '😡', icon: FiMeh, label: 'Angry' }
  ];

  const handleReaction = (emoji) => {
    addReaction(messageId, emoji);
    setShowPicker(false);
  };

  const getReactionCount = (emoji) => {
    return reactions.filter(r => r.emoji === emoji).length;
  };

  const getUserReaction = (emoji) => {
    return reactions.find(r => r.emoji === emoji && r.user._id === user?._id);
  };

  const groupedReactions = reactionEmojis.reduce((acc, reaction) => {
    const count = getReactionCount(reaction.emoji);
    if (count > 0) {
      acc.push({ ...reaction, count, userReacted: !!getUserReaction(reaction.emoji) });
    }
    return acc;
  }, []);

  return (
    <div className="reaction-container">
      <div className="reaction-picker">
        <button
          className="reaction-trigger"
          onClick={() => setShowPicker(!showPicker)}
          title="Add reaction"
        >
          <FiSmile />
        </button>
        
        {showPicker && (
          <div className="reaction-options">
            {reactionEmojis.map(({ emoji, icon: Icon, label }) => (
              <button
                key={emoji}
                className={`reaction-option ${getUserReaction(emoji) ? 'user-reacted' : ''}`}
                onClick={() => handleReaction(emoji)}
                title={label}
              >
                <span className="emoji">{emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {groupedReactions.length > 0 && (
        <div className="reaction-list">
          {groupedReactions.map(({ emoji, count, userReacted }) => (
            <button
              key={emoji}
              className={`reaction-item ${userReacted ? 'user-reacted' : ''}`}
              onClick={() => handleReaction(emoji)}
            >
              <span className="emoji">{emoji}</span>
              <span className="count">{count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReactionButton;
