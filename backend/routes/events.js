const express = require('express');
const router = express.Router();
const {
  logSingleEvent,
  logBatchEvents,
  getAttemptEvents
} = require('../controllers/eventController');

// @route   POST /api/events/single
// @desc    Log a single event
// @access  Public (should be protected in production)
router.post('/single', logSingleEvent);

// @route   POST /api/events/batch
// @desc    Log multiple events in batch
// @access  Public (should be protected in production)
router.post('/batch', logBatchEvents);

// @route   GET /api/events/attempt/:attemptId
// @desc    Get all events for a specific attempt
// @access  Public (should be protected in production)
router.get('/attempt/:attemptId', getAttemptEvents);

module.exports = router;
