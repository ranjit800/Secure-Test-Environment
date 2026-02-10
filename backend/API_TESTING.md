# Backend API Testing Guide

## Prerequisites
- MongoDB installed and running on `mongodb://localhost:27017`
- Or use MongoDB Atlas (update MONGODB_URI in .env)

## Start the Server

```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB Connected: localhost
```

## API Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Start Attempt
```bash
curl -X POST http://localhost:5000/api/attempts/start \
  -H "Content-Type: application/json" \
  -D "{\"userId\": \"test-user-123\", \"assessmentId\": \"assessment-1\", \"metadata\": {\"browserInfo\": \"Chrome 120\"}}"
```

Response:
```json
{
  "success": true,
  "attemptId": "507f1f77bcf86cd799439011",
  "startTime": "2026-02-10T18:00:00.000Z"
}
```

### 3. Log Single Event
```bash
curl -X POST http://localhost:5000/api/events/single \
  -H "Content-Type: application/json" \
  -d "{\"eventType\": \"TAB_SWITCH\", \"attemptId\": \"<attemptId>\", \"metadata\": {\"browserInfo\": \"Chrome\", \"focusState\": false}}"
```

### 4. Log Batch Events
```bash
curl -X POST http://localhost:5000/api/events/batch \
  -H "Content-Type: application/json" \
  -d "{\"events\": [{\"eventType\": \"WINDOW_BLUR\", \"attemptId\": \"<attemptId>\"}, {\"eventType\": \"FOCUS_RESTORED\", \"attemptId\": \"<attemptId>\"}]}"
```

### 5. Get Events for Attempt
```bash
curl http://localhost:5000/api/events/attempt/<attemptId>
```

### 6. Submit Attempt
```bash
curl -X PUT http://localhost:5000/api/attempts/<attemptId>/submit
```

## Testing Workflow

1. Start MongoDB
2. Start backend server: `npm run dev`
3. Start a new attempt (note the attemptId)
4. Log some events (tab switch, window blur, etc.)
5. Get all events for the attempt
6. Submit the attempt (locks it)
7. Try to log more events (should fail - attempt is locked)

## Event Types Available

- `TAB_SWITCH` - User switched tabs (violation)
- `WINDOW_BLUR` - Window lost focus (violation)
- `FOCUS_RESTORED` - Focus returned
- `FULLSCREEN_EXIT` - Exited fullscreen (violation)
- `FULLSCREEN_ENTERED` - Entered fullscreen
- `COPY_ATTEMPT` - Copy blocked (violation)
- `PASTE_ATTEMPT` - Paste blocked (violation)
- `CONTEXT_MENU` - Right-click (violation)
- `DEVTOOLS_DETECTED` - DevTools opened (violation)
- `QUESTION_VIEWED` - Question navigation
- `ANSWER_SELECTED` - Answer chosen
- `ATTEMPT_STARTED` - Test began
- `ATTEMPT_SUBMITTED` - Test completed
- `TIMER_WARNING` - Time milestone

## Violation Tracking

Events marked with "(violation)" automatically increment the `violationCount` in the Attempt model.

## Immutability

- After calling `/api/attempts/:id/submit`, all events become immutable
- Attempting to log new events will return 403 error
- Events cannot be modified or deleted after submission
