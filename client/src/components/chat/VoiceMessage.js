import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiDownload } from 'react-icons/fi';
import './VoiceMessage.css';

const VoiceMessage = ({ attachment, isOwnMessage = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const updateTime = () => {
        setCurrentTime(audio.currentTime);
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDownload = () => {
    if (attachment.url) {
      const link = document.createElement('a');
      const downloadUrl = attachment.url.startsWith('http') 
        ? attachment.url 
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${attachment.url}`;
      link.href = downloadUrl;
      link.download = attachment.originalName || attachment.filename || 'voice-message.webm';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  };

  if (!attachment) return null;

  // Construct the full URL for the audio file
  const audioUrl = attachment.url.startsWith('http') 
    ? attachment.url 
    : `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}${attachment.url}`;

  const handleAudioError = (e) => {
    console.error('Audio error:', e);
    console.error('Audio src:', audioUrl);
    console.error('Audio error details:', {
      networkState: e.target.networkState,
      readyState: e.target.readyState,
      error: e.target.error,
      canPlayType: e.target.canPlayType('audio/webm'),
      canPlayTypeOpus: e.target.canPlayType('audio/webm;codecs=opus')
    });
  };

  const handleAudioLoadStart = () => {
    console.log('Audio load started for:', audioUrl);
  };

  const handleAudioCanPlay = () => {
    console.log('Audio can play:', audioUrl);
  };

  return (
    <div className={`voice-message ${isOwnMessage ? 'own-voice' : ''}`}>
      <div className="voice-message-content">
        <button
          className="play-button"
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <FiPause /> : <FiPlay />}
        </button>
        
        <div className="voice-info">
          <div className="voice-title">
            <span className="voice-icon">🎤</span>
            <span>Voice Message</span>
          </div>
          
          <div className="voice-controls">
            <div className="voice-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
            
            <div className="voice-time">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="duration">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        
        <button
          className="download-button"
          onClick={handleDownload}
          title="Download"
        >
          <FiDownload />
        </button>
      </div>
      
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onError={handleAudioError}
        onLoadStart={handleAudioLoadStart}
        onCanPlay={handleAudioCanPlay}
      />
    </div>
  );
};

export default VoiceMessage;
