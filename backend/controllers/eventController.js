const Event = require('../models/Event');
const Attempt = require('../models/Attempt');

// Log single event
exports.logSingleEvent = async (req, res) => {
  try {
    const { eventType, attemptId, questionId, metadata } = req.body;

    // Check if attempt is submitted (immutable)
    const attempt = await Attempt.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({ 
        success: false, 
        message: 'Attempt not found' 
      });
    }

    if (attempt.submitted) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot log events for submitted attempt' 
      });
    }

    // Create new event
    const event = await Event.create({
      eventType,
      attemptId,
      questionId,
      metadata,
      timestamp: new Date()
    });

    // Increment violation counter for certain event types
    const violationTypes = ['TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'CONTEXT_MENU', 'DEVTOOLS_DETECTED'];
    
    if (violationTypes.includes(eventType)) {
      attempt.violationCount += 1;
      await attempt.save();
    }

    res.status(201).json({
      success: true,
      event,
      violationCount: attempt.violationCount
    });

  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Batch log events
exports.logBatchEvents = async (req, res) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Events array is required' 
      });
    }

    // Get unique attemptIds
    const attemptIds = [...new Set(events.map(e => e.attemptId))];
    
    // Check if any attempt is submitted
    const attempts = await Attempt.find({ _id: { $in: attemptIds } });
    const submittedAttempts = attempts.filter(a => a.submitted);
    
    if (submittedAttempts.length > 0) {
      return res.status(403).json({ 
        success: false, 
        message: 'Cannot log events for submitted attempts' 
      });
    }

    // Add timestamps to events
    const eventsWithTimestamp = events.map(event => ({
      ...event,
      timestamp: event.timestamp || new Date()
    }));

    // Bulk insert events
    const insertedEvents = await Event.insertMany(eventsWithTimestamp);

    // Update violation counts
    const violationTypes = ['TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'CONTEXT_MENU', 'DEVTOOLS_DETECTED'];
    
    for (const attemptId of attemptIds) {
      const violationEvents = events.filter(e => 
        e.attemptId === attemptId && violationTypes.includes(e.eventType)
      );
      
      if (violationEvents.length > 0) {
        await Attempt.findByIdAndUpdate(attemptId, {
          $inc: { violationCount: violationEvents.length }
        });
      }
    }

    res.status(201).json({
      success: true,
      inserted: insertedEvents.length,
      events: insertedEvents
    });

  } catch (error) {
    console.error('Error batch logging events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get events for an attempt
exports.getAttemptEvents = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const events = await Event.find({ attemptId })
      .sort({ timestamp: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};
