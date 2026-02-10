const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      'TAB_SWITCH',
      'WINDOW_BLUR',
      'FOCUS_RESTORED',
      'FULLSCREEN_EXIT',
      'FULLSCREEN_ENTERED',
      'COPY_ATTEMPT',
      'PASTE_ATTEMPT',
      'CONTEXT_MENU',
      'DEVTOOLS_DETECTED',
      'QUESTION_VIEWED',
      'ANSWER_SELECTED',
      'ATTEMPT_STARTED',
      'ATTEMPT_SUBMITTED',
      'TIMER_WARNING'
    ]
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  attemptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attempt',
    required: true
  },
  questionId: {
    type: String,
    default: null
  },
  metadata: {
    browserInfo: String,
    focusState: Boolean,
    additionalData: mongoose.Schema.Types.Mixed
  },
  immutable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
EventSchema.index({ attemptId: 1, timestamp: 1 });
EventSchema.index({ eventType: 1 });

// Prevent modification of immutable events
// Commented out temporarily for debugging
/*
EventSchema.pre('save', function(next) {
  // Allow new documents
  if (this.isNew) {
    return next();
  }
  
  // Check if attempting to modify immutable event
  if (this.immutable) {
    return next(new Error('Cannot modify immutable event'));
  }
  
  next();
});
*/

module.exports = mongoose.model('Event', EventSchema);
