class NotificationService {
  constructor() {
    this.permission = null;
    this.isSupported = 'Notification' in window;
    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.log('This browser does not support notifications');
      return;
    }

    this.permission = Notification.permission;
    
    if (this.permission === 'default') {
      this.permission = await this.requestPermission();
    }
  }

  async requestPermission() {
    if (!this.isSupported) return 'denied';
    
    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  canNotify() {
    return this.isSupported && this.permission === 'granted';
  }

  showNotification(title, options = {}) {
    if (!this.canNotify()) {
      console.log('Cannot show notification: permission not granted');
      return null;
    }

    // Check if the page is visible
    if (document.visibilityState === 'visible') {
      console.log('Page is visible, not showing notification');
      return null;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      requireInteraction: false,
      silent: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  showMessageNotification(message, roomName) {
    const title = `New message in ${roomName}`;
    const body = message.content || 'New message';
    
    return this.showNotification(title, {
      body,
      icon: '/favicon.ico',
      tag: `message-${message._id}`,
      data: {
        messageId: message._id,
        roomId: message.room,
        type: 'message'
      }
    });
  }

  showMentionNotification(message, roomName) {
    const title = `You were mentioned in ${roomName}`;
    const body = message.content || 'New mention';
    
    return this.showNotification(title, {
      body,
      icon: '/favicon.ico',
      tag: `mention-${message._id}`,
      data: {
        messageId: message._id,
        roomId: message.room,
        type: 'mention'
      }
    });
  }

  showReactionNotification(message, reaction, roomName) {
    const title = `New reaction in ${roomName}`;
    const body = `${reaction.user.username} reacted with ${reaction.emoji}`;
    
    return this.showNotification(title, {
      body,
      icon: '/favicon.ico',
      tag: `reaction-${message._id}-${reaction._id}`,
      data: {
        messageId: message._id,
        roomId: message.room,
        type: 'reaction'
      }
    });
  }

  showFileNotification(message, roomName) {
    const title = `New file in ${roomName}`;
    const body = message.attachment ? 
      `${message.sender.username} shared ${message.attachment.originalName}` : 
      'New file shared';
    
    return this.showNotification(title, {
      body,
      icon: '/favicon.ico',
      tag: `file-${message._id}`,
      data: {
        messageId: message._id,
        roomId: message.room,
        type: 'file'
      }
    });
  }

  // Play notification sound
  playNotificationSound() {
    try {
      // First try Web Audio API for a generated sound
      this.playGeneratedSound();
    } catch (error) {
      console.log('Generated notification sound not available:', error);
      // Fallback to a simple beep using data URL
      this.playFallbackSound();
    }
  }

  // Generate notification sound using Web Audio API
  playGeneratedSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create oscillator for notification sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency and type for a pleasant notification sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    // Set volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    // Play the sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }

  // Fallback sound using a simple data URL
  playFallbackSound() {
    try {
      // Create a simple beep sound using data URL
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBS13yO/eizEIHWq+8+OWT');
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.log('Fallback notification sound failed:', error);
        // Final fallback - just log that notification sound is not available
        console.log('Notification sound not available on this device');
      });
    } catch (error) {
      console.log('All notification sound methods failed:', error);
    }
  }

  // Vibrate if supported
  vibrate(pattern = [200, 100, 200]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  // Clear all notifications
  clearAll() {
    if ('serviceWorker' in navigator && 'getRegistrations' in navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          registration.showNotification('', { tag: '' });
        });
      });
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
