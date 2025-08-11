const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  isDirectMessage: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // For direct messages, store the two users
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxMembers: {
    type: Number,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
roomSchema.index({ isPrivate: 1, isActive: 1 });
roomSchema.index({ participants: 1 });
roomSchema.index({ 'members.user': 1 });

// Virtual for member count
roomSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Ensure virtuals are serialized
roomSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Room', roomSchema);
