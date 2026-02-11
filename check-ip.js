const https = require('https');

console.log('🔍 Checking your public IP address...');

https.get('https://api.ipify.org?format=json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const ip = JSON.parse(data).ip;
      console.log(`\n✅ Your Current Public IP: ${ip}`);
      console.log('\nPlease go to MongoDB Atlas > Network Access and ensure this IP is whitelisted (or allow 0.0.0.0/0 for testing).');
    } catch (e) {
      console.error('Failed to parse IP:', e);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching IP:', err.message);
});
