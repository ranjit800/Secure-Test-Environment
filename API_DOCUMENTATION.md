# 🔐 Secure Assessment Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Attempts](#attempts)
3. [Questions](#questions)
4. [Events](#events)

---

## 🔑 Authentication

### 1. Register Student
Create a new student account.

**Endpoint:** `POST /api/auth/register`  
**Access:** Public

**Request Body:**
```json
{
  "username": "student123",
  "name": "John Doe",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "_id": "65f8c2a3b1e4d8f9c0123456",
  "username": "student123",
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

---

### 2. Login (Student/Admin)
Authenticate and get access token.

**Endpoint:** `POST /api/auth/login`  
**Access:** Public

**Request Body:**
```json
{
  "username": "student123",
  "password": "password123"
}
```

**For Admin Login:**
```json
{
  "username": "admin@gmail.com",
  "password": "admin1234"
}
```

**Success Response (200):**
```json
{
  "_id": "65f8c2a3b1e4d8f9c0123456",
  "username": "student123",
  "name": "John Doe",
  "email": null,
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Admin Response:**
```json
{
  "_id": "65f8c2a3b1e4d8f9c0123456",
  "username": "admin@gmail.com",
  "name": "Admin",
  "email": "admin@gmail.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

### 3. Create Admin (Protected)
Create a new admin account using secret key.

**Endpoint:** `POST /api/auth/create-admin`  
**Access:** Protected (requires secret key)

**Request Body:**
```json
{
  "name": "Super Admin",
  "email": "superadmin@example.com",
  "password": "Admin@1234",
  "secretKey": "super-secret-admin-key-2024"
}
```

**Success Response (201):**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "_id": "65f8c2a3b1e4d8f9c0123456",
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "role": "admin"
  }
}
```

**Error Response (403):**
```json
{
  "message": "Invalid secret key. Unauthorized."
}
```

**Error Response (400):**
```json
{
  "message": "Admin with this email already exists"
}
```

---

## 📝 Attempts

### 4. Start Attempt
Start a new test attempt for a student.

**Endpoint:** `POST /api/attempts/start`  
**Access:** Public

**Request Body:**
```json
{
  "userId": "65f8c2a3b1e4d8f9c0123456",
  "assessmentId": "eval-101",
  "metadata": {
    "browser": "Mozilla/5.0...",
    "screen": "1920x1080",
    "ip": "192.168.1.1"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "attemptId": "65f8c2a3b1e4d8f9c0789012",
  "startTime": "2026-02-11T10:30:00.000Z"
}
```

---

### 5. Submit Attempt
Submit and lock a test attempt with answers and violations.

**Endpoint:** `PUT /api/attempts/:attemptId/submit`  
**Access:** Public

**Request Body:**
```json
{
  "violationCount": 2,
  "answers": {
    "1": "A",
    "2": "C",
    "3": "B",
    "4": "D",
    "5": "A"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Attempt submitted successfully",
  "score": 80,
  "correctAnswers": 8,
  "totalQuestions": 10
}
```

---

### 6. Get Attempt Details
Retrieve details of a specific attempt.

**Endpoint:** `GET /api/attempts/:attemptId`  
**Access:** Public

**Success Response (200):**
```json
{
  "_id": "65f8c2a3b1e4d8f9c0789012",
  "userId": "65f8c2a3b1e4d8f9c0123456",
  "userName": "John Doe",
  "userUsername": "student123",
  "assessmentId": "eval-101",
  "startTime": "2026-02-11T10:30:00.000Z",
  "endTime": "2026-02-11T10:35:00.000Z",
  "violationCount": 2,
  "score": 80,
  "correctAnswers": 8,
  "totalQuestions": 10,
  "submitted": true
}
```

---

### 7. Get All Attempts (Admin)
Get all attempts across all students (admin only).

**Endpoint:** `GET /api/attempts/all/admin`  
**Access:** Admin (requires JWT token)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 25,
  "attempts": [
    {
      "_id": "65f8c2a3b1e4d8f9c0789012",
      "userName": "John Doe",
      "userUsername": "student123",
      "assessmentId": "eval-101",
      "startTime": "2026-02-11T10:30:00.000Z",
      "endTime": "2026-02-11T10:35:00.000Z",
      "duration": 300000,
      "violationCount": 2,
      "score": 80,
      "submitted": true
    }
  ]
}
```

---

### 8. Get User Attempts
Get all attempts for a specific user.

**Endpoint:** `GET /api/attempts/user/:userId`  
**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "userId": "65f8c2a3b1e4d8f9c0123456",
  "count": 3,
  "attempts": [...]
}
```

---

## 📚 Questions

### 9. Get Questions
Retrieve all quiz questions (without correct answers).

**Endpoint:** `GET /api/questions`  
**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "questions": [
    {
      "id": "1",
      "question": "What does HTML stand for?",
      "options": {
        "A": "Hyper Text Markup Language",
        "B": "High Tech Modern Language",
        "C": "Home Tool Markup Language",
        "D": "Hyperlinks and Text Markup Language"
      }
    }
  ]
}
```

---

### 10. Grade Answers
Grade student answers and calculate score.

**Endpoint:** `POST /api/questions/grade`  
**Access:** Public (internal use)

**Request Body:**
```json
{
  "answers": {
    "1": "A",
    "2": "C",
    "3": "B",
    "4": "D",
    "5": "A",
    "6": "B",
    "7": "C",
    "8": "A",
    "9": "D",
    "10": "B"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "score": 80,
  "correctCount": 8,
  "totalQuestions": 10,
  "results": {
    "1": {
      "userAnswer": "A",
      "correctAnswer": "A",
      "isCorrect": true
    },
    "2": {
      "userAnswer": "C",
      "correctAnswer": "B",
      "isCorrect": false
    }
  }
}
```

---

## 📊 Events

### 11. Log Single Event
Log a single security/activity event.

**Endpoint:** `POST /api/events/single`  
**Access:** Public

**Request Body:**
```json
{
  "eventType": "TAB_SWITCH",
  "attemptId": "65f8c2a3b1e4d8f9c0789012",
  "questionId": "3",
  "metadata": {
    "timestamp": 1707650400000,
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Event logged successfully",
  "eventId": "65f8c2a3b1e4d8f9c0999888"
}
```

---

### 12. Log Batch Events
Log multiple events in a single request.

**Endpoint:** `POST /api/events/batch`  
**Access:** Public

**Request Body:**
```json
{
  "events": [
    {
      "eventType": "TAB_SWITCH",
      "attemptId": "65f8c2a3b1e4d8f9c0789012",
      "questionId": "3",
      "metadata": {
        "timestamp": 1707650400000
      }
    },
    {
      "eventType": "FULLSCREEN_EXIT",
      "attemptId": "65f8c2a3b1e4d8f9c0789012",
      "questionId": "4",
      "metadata": {
        "timestamp": 1707650450000
      }
    }
  ]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "2 events logged successfully",
  "count": 2
}
```

---

### 13. Get Attempt Events
Retrieve all events for a specific attempt.

**Endpoint:** `GET /api/events/attempt/:attemptId`  
**Access:** Public

**Success Response (200):**
```json
{
  "success": true,
  "attemptId": "65f8c2a3b1e4d8f9c0789012",
  "count": 5,
  "events": [
    {
      "_id": "65f8c2a3b1e4d8f9c0999888",
      "eventType": "ATTEMPT_STARTED",
      "attemptId": "65f8c2a3b1e4d8f9c0789012",
      "timestamp": "2026-02-11T10:30:00.000Z",
      "metadata": {
        "ip": "192.168.1.1"
      }
    },
    {
      "_id": "65f8c2a3b1e4d8f9c0999889",
      "eventType": "TAB_SWITCH",
      "attemptId": "65f8c2a3b1e4d8f9c0789012",
      "questionId": "3",
      "timestamp": "2026-02-11T10:32:00.000Z",
      "metadata": {
        "hidden": true
      }
    }
  ]
}
```

---

## 🔐 Event Types Reference

| Event Type | Description | When Logged |
|------------|-------------|-------------|
| `ATTEMPT_STARTED` | Test attempt initiated | When student starts test |
| `ATTEMPT_SUBMITTED` | Test attempt submitted | When student submits test |
| `TAB_SWITCH` | Browser tab changed | Student switches to another tab |
| `WINDOW_BLUR` | Window lost focus | Student clicks outside browser |
| `FOCUS_RESTORED` | Window regained focus | Student returns to test |
| `FULLSCREEN_EXIT` | Fullscreen mode exited | Student exits fullscreen |
| `FULLSCREEN_ENTERED` | Fullscreen mode entered | Student enters fullscreen |
| `COPY_ATTEMPT` | Copy action attempted | Student tries to copy text |
| `PASTE_ATTEMPT` | Paste action attempted | Student tries to paste text |
| `CONTEXT_MENU` | Right-click menu opened | Student right-clicks |
| `QUESTION_VIEWED` | Question displayed | Student navigates to question |
| `ANSWER_SELECTED` | Answer selected | Student selects an option |

---

## 🔒 Authentication & Authorization

### JWT Token Usage

For protected routes (admin endpoints), include JWT token in headers:

```
Authorization: Bearer <your_jwt_token>
```

### Admin Routes
- `GET /api/attempts/all/admin` - Requires admin role

### Role Types
- `student` - Regular students taking assessments
- `admin` - Administrators with dashboard access

---

## ⚙️ Environment Variables

```env
# Server
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Admin Creation
ADMIN_SECRET_KEY=super-secret-admin-key-2024
```

---

## 📌 Notes

1. **Security**: In production, enable authentication middleware for all attempt and event routes
2. **CORS**: Configure CORS settings based on your frontend domain
3. **Rate Limiting**: Consider adding rate limiting for API endpoints
4. **Validation**: All endpoints include basic validation, add more as needed
5. **Logging**: Enable server-side logging for debugging and monitoring

---

## 🧪 Testing with cURL

### Example: Start Attempt
```bash
curl -X POST http://localhost:5000/api/attempts/start \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "65f8c2a3b1e4d8f9c0123456",
    "assessmentId": "eval-101",
    "metadata": {
      "browser": "Chrome",
      "screen": "1920x1080"
    }
  }'
```

### Example: Admin Login & Get All Attempts
```bash
# Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@gmail.com","password":"admin1234"}' \
  | jq -r '.token')

# Get all attempts
curl -X GET http://localhost:5000/api/attempts/all/admin \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📞 Support

For issues or questions, refer to the project README or contact the development team.
