const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  seNumber: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  codeVersion: {
    type: String,
    trim: true
  },
  reviewerName: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  clientId: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for faster queries
movementSchema.index({ seNumber: 1 });
movementSchema.index({ timestamp: -1 });

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;