const express = require('express');
const router = express.Router();
const {
  startAttempt,
  submitAttempt,
  getAttempt,
  getUserAttempts,
  getAllAttempts
} = require('../controllers/attemptController');

const { protect, requireAdmin } = require('../middleware/auth');

// @route   POST /api/attempts/start
// @desc    Start a new test attempt
// @access  Public (should be protected in production)
router.post('/start', startAttempt);

// @route   PUT /api/attempts/:attemptId/submit
// @desc    Submit and lock an attempt
// @access  Public (should be protected in production)
router.put('/:attemptId/submit', submitAttempt);

// @route   GET /api/attempts/:attemptId
// @desc    Get attempt details
// @access  Public (should be protected in production)
router.get('/:attemptId', getAttempt);

// @route   GET /api/attempts/all/admin
// @desc    Get all attempts (admin only)
// @access  Admin
router.get('/all/admin', protect, requireAdmin, getAllAttempts);

// @route   GET /api/attempts/user/:userId
// @desc    Get all attempts for a user
// @access  Public (should be protected in production)
router.get('/user/:userId', getUserAttempts);

module.exports = router;
