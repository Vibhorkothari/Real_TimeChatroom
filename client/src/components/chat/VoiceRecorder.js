import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiStopCircle, FiPlay, FiPause, FiTrash2, FiSend } from 'react-icons/fi';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try different MIME types for better browser compatibility
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      }
      
      console.log('Using MIME type:', mimeType);
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        // Create audio element to get duration
        const audio = new Audio(url);
        audio.onloadedmetadata = () => {
          setDuration(audio.duration);
        };
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = () => {
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

  const handlePlayEnd = () => {
    setIsPlaying(false);
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setDuration(0);
  };

  const sendRecording = () => {
    if (audioBlob) {
      onSend(audioBlob);
      deleteRecording();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-recorder">
      <div className="voice-recorder-header">
        <h4>Voice Message</h4>
        <button className="close-btn" onClick={onCancel}>
          <FiTrash2 />
        </button>
      </div>

      <div className="voice-recorder-content">
        {!audioBlob ? (
          <div className="recording-section">
            <div className="recording-controls">
              <button
                className={`record-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <FiStopCircle /> : <FiMic />}
              </button>
              <div className="recording-info">
                <span className="recording-status">
                  {isRecording ? 'Recording...' : 'Tap to record'}
                </span>
                <span className="recording-time">
                  {formatTime(recordingTime)}
                </span>
              </div>
            </div>
            
            {isRecording && (
              <div className="recording-visualizer">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="playback-section">
            <div className="playback-controls">
              <button
                className="play-btn"
                onClick={playRecording}
              >
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <div className="playback-info">
                <span className="playback-status">
                  {isPlaying ? 'Playing...' : 'Ready to play'}
                </span>
                <span className="playback-duration">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
            
            <div className="playback-actions">
              <button
                className="action-btn delete-btn"
                onClick={deleteRecording}
              >
                <FiTrash2 />
                Delete
              </button>
              <button
                className="action-btn send-btn"
                onClick={sendRecording}
              >
                <FiSend />
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handlePlayEnd}
          preload="metadata"
        />
      )}
    </div>
  );
};

export default VoiceRecorder;
