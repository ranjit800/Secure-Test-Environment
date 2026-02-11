const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  studentName: String, // Denormalized for easy access
  username: String,    // Denormalized for easy access
  assessmentId: {
    type: String,
    required: true
  },
  answers: {
    type: Map,
    of: String,
    default: {}
  },
  score: {
    type: Number,
    default: null
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 10
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'flagged', 'abandoned'],
    default: 'active'
  },
  violationCount: {
    type: Number,
    default: 0
  },
  submitted: {
    type: Boolean,
    default: false
  },
  metadata: {
    browserInfo: String,
    ipAddress: String,
    userAgent: String,
    screenResolution: String
  }
}, {
  timestamps: true
});

// Index for faster queries
AttemptSchema.index({ userId: 1, assessmentId: 1 });
AttemptSchema.index({ status: 1 });

// Prevent modification after submission
// Commented out temporarily for debugging
/*
AttemptSchema.pre('save', function(next) {
  // Allow new documents
  if (this.isNew) {
    return next();
  }
  
  // If attempt is submitted, only allow status and endTime changes
  if (this.submitted) {
    const modifiedFields = this.modifiedPaths();
    const allowedFields = ['status', 'endTime'];
    const hasUnallowedChanges = modifiedFields.some(field => !allowedFields.includes(field));
    
    if (hasUnallowedChanges) {
      return next(new Error('Cannot modify submitted attempt'));
    }
  }
  next();
});
*/

module.exports = mongoose.model('Attempt', AttemptSchema);
