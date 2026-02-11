require('dotenv').config();
const mongoose = require('mongoose');
const Attempt = require('./models/Attempt');
const Event = require('./models/Event');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to DB');

    // Fetch all attempts
    const attempts = await Attempt.find().sort({ startTime: -1 }).limit(5);
    console.log(`\n📄 Found ${attempts.length} Attempts:`);
    
    for (const a of attempts) {
      const timeDiffv = (Date.now() - new Date(a.startTime).getTime()) / 1000 / 60; // minutes
      console.log(`- ID: ${a._id}`);
      console.log(`  User: ${a.userId}`);
      console.log(`  Status: ${a.status}`);
      console.log(`  Time: ${a.startTime} (${timeDiffv.toFixed(1)} mins ago)`);
      
      const events = await Event.find({ attemptId: a._id }).sort({ timestamp: 1 });
      console.log(`  Events (${events.length} found):`);
      events.forEach(e => {
        const eTime = (Date.now() - new Date(e.timestamp).getTime()) / 1000 / 60;
        console.log(`    [${e.eventType}] ${eTime.toFixed(1)} mins ago - ${JSON.stringify(e.metadata || {})}`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkDB();
