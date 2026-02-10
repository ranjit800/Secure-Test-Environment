// Test API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🧪 Testing Backend API Endpoints...\n');

  try {
    // 1. Test health endpoint
    console.log('1️⃣  Testing Health Endpoint...');
    const healthRes = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthRes.data);
    console.log('');

    // 2. Start a new attempt
    console.log('2️⃣  Testing Start Attempt...');
    const attemptRes = await axios.post(`${BASE_URL}/attempts/start`, {
      userId: 'test-user-123',
      assessmentId: 'assessment-1',
      metadata: {
        browserInfo: 'Chrome 120',
        ipAddress: '127.0.0.1'
      }
    });
    console.log('✅ Attempt Created:', attemptRes.data);
    const attemptId = attemptRes.data.attemptId;
    console.log('');

    // 3. Log single event
    console.log('3️⃣  Testing Single Event Log...');
    const eventRes = await axios.post(`${BASE_URL}/events/single`, {
      eventType: 'TAB_SWITCH',
      attemptId: attemptId,
      questionId: 'q1',
      metadata: {
        browserInfo: 'Chrome 120',
        focusState: false
      }
    });
    console.log('✅ Event Logged:', eventRes.data);
    console.log('');

    // 4. Log batch events
    console.log('4️⃣  Testing Batch Event Log...');
    const batchRes = await axios.post(`${BASE_URL}/events/batch`, {
      events: [
        {
          eventType: 'WINDOW_BLUR',
          attemptId: attemptId,
          metadata: { focusState: false }
        },
        {
          eventType: 'FOCUS_RESTORED',
          attemptId: attemptId,
          metadata: { focusState: true }
        },
        {
          eventType: 'COPY_ATTEMPT',
          attemptId: attemptId,
          metadata: { blocked: true }
        }
      ]
    });
    console.log('✅ Batch Events Logged:', batchRes.data);
    console.log('');

    // 5. Get attempt events
    console.log('5️⃣  Testing Get Attempt Events...');
    const eventsRes = await axios.get(`${BASE_URL}/events/attempt/${attemptId}`);
    console.log('✅ Retrieved Events:', eventsRes.data);
    console.log('');

    // 6. Get attempt details
    console.log('6️⃣  Testing Get Attempt Details...');
    const attemptDetailsRes = await axios.get(`${BASE_URL}/attempts/${attemptId}`);
    console.log('✅ Attempt Details:', attemptDetailsRes.data);
    console.log('');

    // 7. Submit attempt
    console.log('7️⃣  Testing Submit Attempt...');
    const submitRes = await axios.put(`${BASE_URL}/attempts/${attemptId}/submit`);
    console.log('✅ Attempt Submitted:', submitRes.data);
    console.log('');

    // 8. Try logging event after submission (should fail)
    console.log('8️⃣  Testing Immutability (should fail)...');
    try {
      await axios.post(`${BASE_URL}/events/single`, {
        eventType: 'TAB_SWITCH',
        attemptId: attemptId,
        metadata: {}
      });
      console.log('❌ FAILED: Should have blocked logging after submission');
    } catch (error) {
      console.log('✅ Immutability Check Passed:', error.response.data.message);
    }
    console.log('');

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testBackend();
