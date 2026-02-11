const mongoose = require('mongoose');
const Attempt = require('./models/Attempt');
const User = require('./models/User');
require('dotenv').config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    users.forEach(u => console.log(`- User: ${u.username} (${u._id})`));

    const attempts = await Attempt.find({});
    console.log(`Found ${attempts.length} attempts`);
    attempts.forEach(a => {
        console.log(`- Attempt: ${a._id}`);
        console.log(`  User: ${a.studentName} (${a.username})`);
        console.log(`  User ID: ${a.userId}`);
        console.log(`  Violations: ${a.violationCount}`);
        console.log(`  Status: ${a.status}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.log('Error:', error.message);
  }
};

checkData();
