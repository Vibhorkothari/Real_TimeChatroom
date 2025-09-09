import React from 'react';
import './Mention.css';

const Mention = ({ username, isOwnMention = false }) => {
  return (
    <span className={`mention ${isOwnMention ? 'own-mention' : ''}`}>
      @{username}
    </span>
  );
};

export default Mention;
