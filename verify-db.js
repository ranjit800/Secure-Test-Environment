require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');
const Attempt = require('./backend/models/Attempt');
const Event = require('./backend/models/Event');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to DB');

    const attempts = await Attempt.find().sort({ startTime: -1 }).limit(5);
    console.log(`\n📄 Found ${attempts.length} Attempts:`);
    attempts.forEach(a => {
      console.log(`- ID: ${a.attemptId}, User: ${a.userId}, Status: ${a.status}, Violations: ${a.violationCount}`);
    });

    if (attempts.length > 0) {
      const events = await Event.find({ attemptId: attempts[0]._id });
      console.log(`\n📄 Found ${events.length} Events for latest attempt:`);
      events.slice(0, 5).forEach(e => {
        console.log(`- [${e.eventType}] ${e.timestamp}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkDB();
