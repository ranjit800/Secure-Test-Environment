# 🔒 Secure Test Environment Enforcement System

A comprehensive MERN stack application designed to enforce browser restrictions, prevent cheating, and capture complete audit trails during high-stakes online assessments.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Event Logging Schema](#event-logging-schema)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Testing Instructions](#testing-instructions)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

This system creates a **locked-down test environment** that:

✅ Detects and logs all violations (tab switches, focus loss, fullscreen exits)  
✅ Displays immediate warnings to candidates  
✅ Maintains an immutable audit trail for employer review  
✅ Prevents copy/paste and other cheating attempts  
✅ Works offline with automatic sync when reconnected  

**Use Case:** High-stakes employer-vetted assessments where integrity monitoring is critical.

---

## ✨ Key Features

### 1️⃣ Browser Enforcement

- **Tab Switch Detection** - Detects when user switches browser tabs
- **Window Blur/Focus Monitoring** - Tracks when browser window loses focus
- **New Tab/Window Prevention** - Logs attempts to open additional tabs
- **Fullscreen Enforcement** - Requires and maintains fullscreen mode
- **Violation Counter** - Real-time display of violation count
- **Instant Warnings** - Immediate visual alerts on violations

### 2️⃣ Unified Event Logging

- **Comprehensive Event Capture** - Every action is logged with metadata
- **Batch Processing** - Events sent to backend in efficient batches
- **Offline Support** - IndexedDB persistence during network interruptions
- **Immutable Records** - Logs cannot be modified after test submission
- **Timestamped Audit Trail** - Complete chronological event history

### 3️⃣ Additional Security

- **Copy/Paste Blocking** - Prevents content copying and pasting
- **Right-Click Disabled** - Context menu access blocked
- **DevTools Detection** - Heuristic-based detection of browser DevTools
- **Timer Activity Tracking** - Monitors test duration and milestones

---

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for event storage
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication and session management
- **Helmet** - Security headers middleware
- **Express Rate Limit** - API rate limiting

### Frontend
- **React 18+** - UI library
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **localforage** - IndexedDB wrapper for offline storage
- **React Hot Toast** - Toast notifications for warnings
- **Vite** - Build tool and dev server

### Development Tools
- **Nodemon** - Auto-restart for backend development
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Project Structure

```
Secure-Test-Environment/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Attempt.js            # Test attempt schema
│   │   ├── Event.js              # Event logging schema
│   │   └── User.js               # User/candidate schema
│   ├── controllers/
│   │   ├── attemptController.js  # Attempt management logic
│   │   └── eventController.js    # Event logging logic
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── attempts.js           # Attempt routes
│   │   └── events.js             # Event routes
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── validator.js          # Request validation
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BrowserEnforcer.jsx      # Main enforcement component
│   │   │   ├── ViolationWarning.jsx     # Warning modal
│   │   │   ├── ViolationCounter.jsx     # Violation display
│   │   │   └── TestInterface.jsx        # Test UI
│   │   ├── services/
│   │   │   ├── eventLogger.js           # Event logging service
│   │   │   ├── browserMonitor.js        # Browser monitoring
│   │   │   └── storageService.js        # IndexedDB operations
│   │   ├── store/
│   │   │   └── testStore.js             # Zustand global state store
│   │   ├── hooks/
│   │   │   ├── useBrowserEnforcement.js # Enforcement hook
│   │   │   └── useEventLogger.js        # Logging hook
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── .env                      # Frontend environment variables
│   ├── vite.config.js
│   └── package.json
│
└── plan.md                       # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) - Local or Atlas
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Secure-Test-Environment
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secure-test-db
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
EOF

# Start MongoDB (if running locally)
# mongod

# Start backend server
npm run dev
```

**Backend runs on:** `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
EOF

# Start frontend dev server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## 📖 Usage Guide

### For Test Administrators

1. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

2. **Access Admin Dashboard**
   - Navigate to `http://localhost:5173/admin`
   - Create a new assessment
   - Generate test links for candidates

### For Test Candidates

1. **Start Test**
   - Open provided test link
   - Browser will request fullscreen mode (allow it)
   - Test begins with monitoring active

2. **During Test**
   - Stay in the test window
   - Don't switch tabs or minimize
   - Violations trigger immediate warnings
   - Violation count is visible

3. **Complete Test**
   - Click "Submit Test" button
   - All events are finalized and locked
   - Redirect to completion page

### Testing the Enforcement (Development)

Open: `http://localhost:5173/test` or use `https://example.com/` in Chrome

**Try these actions to trigger violations:**

- ✅ Switch to another tab (Ctrl+Tab)
- ✅ Click outside browser window
- ✅ Press ESC to exit fullscreen
- ✅ Try to copy text (Ctrl+C)
- ✅ Right-click for context menu
- ✅ Open DevTools (F12)

Each action will:
1. Trigger a warning modal
2. Increment violation counter
3. Log event to backend
4. Save to IndexedDB

---

## 📊 Event Logging Schema

### Event Document Structure

```javascript
{
  _id: ObjectId,
  eventType: String,           // Event classification
  timestamp: Date,             // When event occurred
  attemptId: ObjectId,         // Reference to test attempt
  questionId: String,          // Current question (optional)
  metadata: {
    browserInfo: String,       // User agent
    focusState: Boolean,       // Window focus state
    additionalData: Mixed      // Event-specific data
  },
  immutable: Boolean           // Locked after submission
}
```

### Event Types

| Event Type | Description | Trigger |
|------------|-------------|---------|
| `TAB_SWITCH` | User switched tabs | `visibilitychange` |
| `WINDOW_BLUR` | Browser lost focus | `blur` event |
| `FOCUS_RESTORED` | Focus returned | `focus` event |
| `FULLSCREEN_EXIT` | Exited fullscreen | `fullscreenchange` |
| `COPY_ATTEMPT` | Copy blocked | `copy` event |
| `PASTE_ATTEMPT` | Paste blocked | `paste` event |
| `CONTEXT_MENU` | Right-click blocked | `contextmenu` |
| `DEVTOOLS_DETECTED` | DevTools opened | Heuristic |
| `QUESTION_VIEWED` | Question navigation | UI interaction |
| `ANSWER_SELECTED` | Answer chosen | UI interaction |
| `ATTEMPT_STARTED` | Test began | Initialization |
| `ATTEMPT_SUBMITTED` | Test completed | Submission |

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Attempts

**Start New Attempt**
```http
POST /api/attempts/start
Content-Type: application/json

{
  "userId": "user_id_here",
  "assessmentId": "assessment_id_here"
}

Response: {
  "success": true,
  "attemptId": "attempt_id_here",
  "startTime": "2026-02-10T16:00:00.000Z"
}
```

**Submit Attempt**
```http
PUT /api/attempts/:attemptId/submit

Response: {
  "success": true,
  "message": "Attempt submitted and locked"
}
```

**Get Attempt Details**
```http
GET /api/attempts/:attemptId

Response: {
  "attemptId": "...",
  "userId": "...",
  "startTime": "...",
  "endTime": "...",
  "violationCount": 5,
  "status": "completed"
}
```

#### Events

**Log Single Event**
```http
POST /api/events/single
Content-Type: application/json

{
  "eventType": "TAB_SWITCH",
  "attemptId": "attempt_id_here",
  "questionId": "q1",
  "metadata": {
    "browserInfo": "Chrome 120",
    "focusState": false
  }
}
```

**Batch Log Events**
```http
POST /api/events/batch
Content-Type: application/json

{
  "events": [
    { "eventType": "TAB_SWITCH", "attemptId": "...", ... },
    { "eventType": "FOCUS_RESTORED", "attemptId": "...", ... }
  ]
}

Response: {
  "success": true,
  "inserted": 2
}
```

**Get Events for Attempt**
```http
GET /api/events/attempt/:attemptId

Response: {
  "events": [
    {
      "eventType": "TAB_SWITCH",
      "timestamp": "2026-02-10T16:05:23.000Z",
      "metadata": { ... }
    },
    ...
  ]
}
```

---

## 🔐 Security Features

### Browser-Level Enforcement

```javascript
// Tab Switch Detection
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    logViolation('TAB_SWITCH');
  }
});

// Focus Loss Detection
window.addEventListener('blur', () => {
  logViolation('WINDOW_BLUR');
});

// Fullscreen Enforcement
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    logViolation('FULLSCREEN_EXIT');
    // Auto re-enter fullscreen
    document.documentElement.requestFullscreen();
  }
});

// Copy/Paste Prevention
document.addEventListener('copy', (e) => {
  e.preventDefault();
  logViolation('COPY_ATTEMPT');
});

document.addEventListener('paste', (e) => {
  e.preventDefault();
  logViolation('PASTE_ATTEMPT');
});

// Right-Click Blocking
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  logViolation('CONTEXT_MENU');
});
```

### Backend Security

- **Helmet.js** - Security headers (XSS, CSRF protection)
- **Rate Limiting** - Max 100 events/minute per IP
- **JWT Authentication** - Secure session management
- **Immutability Enforcement** - Prevents log tampering post-submission
- **Input Validation** - Sanitizes all incoming data

---

## 🧪 Testing Instructions

### Manual Testing Checklist

- [ ] Start test and verify fullscreen mode activates
- [ ] Switch tabs - confirm warning appears
- [ ] Click outside browser - verify blur detection
- [ ] Exit fullscreen (ESC) - check auto re-entry
- [ ] Try copying text - verify blocking
- [ ] Open DevTools (F12) - check detection
- [ ] Disconnect network - verify offline storage
- [ ] Reconnect network - confirm event sync
- [ ] Submit test - verify immutability

### Automated Tests (Coming Soon)

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

---

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Set environment variables:
   ```
   MONGODB_URI=<your-mongo-atlas-uri>
   JWT_SECRET=<random-secret>
   PORT=5000
   NODE_ENV=production
   ```

2. Deploy command:
   ```bash
   npm start
   ```

### Frontend Deployment (Vercel/Netlify)

1. Build production bundle:
   ```bash
   npm run build
   ```

2. Set environment variable:
   ```
   VITE_API_URL=<your-backend-url>/api
   ```

3. Deploy `dist/` folder

---

## 🔮 Future Enhancements

- [ ] **Webcam Proctoring** - Optional video recording
- [ ] **Screen Recording** - Capture screen activity
- [ ] **AI Behavior Analysis** - Detect suspicious patterns
- [ ] **Mobile Support** - Tablet-optimized interface
- [ ] **Multi-language Support** - Internationalization
- [ ] **Advanced Analytics** - Employer dashboard with charts
- [ ] **Live Monitoring** - Real-time test observation

---

## 📄 License

This project is created for educational and assessment purposes.

---

## 👥 Contributors

Built as part of a secure assessment system implementation.

---

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Last Updated:** February 10, 2026
