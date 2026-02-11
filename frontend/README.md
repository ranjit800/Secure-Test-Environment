# Secure Test Environment - Frontend

A React-based secure testing interface with advanced browser enforcement features.

## Features
- **Browser Enforcement**: Detects tab switching, window blur, and fullscreen exit.
- **Event Logging**: Tracks all user actions and violations.
- **Offline Support**: Queues events when offline and syncs when online.
- **Security**: Blocks copy/paste, context menu, and text selection.

## Prerequisites
- Node.js (v16+)
- Backend server running on port 5000

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:5173 to view the app.

## Project Structure
- `/src/components` - UI and Logic components (BrowserEnforcer, ViolationCounter)
- `/src/services` - API and Event Logging services
- `/src/store` - Global state management (Zustand)
- `/src/pages` - Route pages (Start, Test, Result)

## Key Components
- `BrowserEnforcer.jsx`: The core security component that monitors browser events.
- `EventLogger.js`: Service that queues and syncs events to the backend.
