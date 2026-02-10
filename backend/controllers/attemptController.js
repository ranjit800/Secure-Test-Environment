const Attempt = require('../models/Attempt');
const Event = require('../models/Event');

// Start new attempt
exports.startAttempt = async (req, res) => {
  try {
    const { userId, assessmentId, metadata } = req.body;

    if (!userId || !assessmentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId and assessmentId are required' 
      });
    }

    // Create new attempt
    const attempt = await Attempt.create({
      userId,
      assessmentId,
      startTime: new Date(),
      status: 'active',
      metadata: metadata || {}
    });

    // Log ATTEMPT_STARTED event
    await Event.create({
      eventType: 'ATTEMPT_STARTED',
      attemptId: attempt._id,
      timestamp: new Date(),
      metadata: metadata || {}
    });

    res.status(201).json({
      success: true,
      attemptId: attempt._id,
      startTime: attempt.startTime
    });

  } catch (error) {
    console.error('Error starting attempt:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Submit attempt
exports.submitAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId);
    
    if (!attempt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attempt not found' 
      });
    }

    if (attempt.submitted) {
      return res.status(400).json({ 
        success: false, 
        message: 'Attempt already submitted' 
      });
    }

    // Update attempt
    attempt.endTime = new Date();
    attempt.status = 'completed';
    attempt.submitted = true;
    await attempt.save();

    // Make all events for this attempt immutable
    await Event.updateMany(
      { attemptId: attempt._id },
      { $set: { immutable: true } }
    );

    // Log ATTEMPT_SUBMITTED event
    await Event.create({
      eventType: 'ATTEMPT_SUBMITTED',
      attemptId: attempt._id,
      timestamp: new Date(),
      immutable: true,
      metadata: {
        violationCount: attempt.violationCount
      }
    });

    res.status(200).json({
      success: true,
      message: 'Attempt submitted and locked',
      attempt
    });

  } catch (error) {
    console.error('Error submitting attempt:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get attempt details
exports.getAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findById(attemptId).lean();
    
    if (!attempt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attempt not found' 
      });
    }

    res.status(200).json({
      success: true,
      attempt
    });

  } catch (error) {
    console.error('Error fetching attempt:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get user attempts
exports.getUserAttempts = async (req, res) => {
  try {
    const { userId } = req.params;

    const attempts = await Attempt.find({ userId })
      .sort({ startTime: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: attempts.length,
      attempts
    });

  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};
