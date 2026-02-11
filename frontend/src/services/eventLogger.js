import axios from 'axios';
import localforage from 'localforage';
import useTestStore from '../store/testStore';

// Configure local storage for offline events
localforage.config({
  name: 'secure-test-events',
  storeName: 'events_queue'
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class EventLoggerService {
  constructor() {
    this.queue = [];
    this.isSyncing = false;
    this.BATCH_SIZE = 10;
    this.SYNC_INTERVAL = 5000; // 5 seconds
    this.timerId = null;
  }

  // Initialize service
  init() {
    this.loadQueueFromStorage();
    this.startSyncTimer();
  }

  // Log an event
  async log(eventType, metadata = {}) {
    const state = useTestStore.getState();
    
    // Don't log if no active attempt (unless it's ATTEMPT_STARTED handled by backend)
    if (!state.attemptId && eventType !== 'ATTEMPT_STARTED') return;

    const event = {
      eventType,
      attemptId: state.attemptId,
      questionId: state.currentQuestionId,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    };

    // Add to queue
    this.queue.push(event);
    await this.saveQueueToStorage();

    // Trigger sync if batch size reached
    if (this.queue.length >= this.BATCH_SIZE) {
      this.syncEvents();
    }
  }

  // Load pending events from IndexedDB
  async loadQueueFromStorage() {
    try {
      const storedQueue = await localforage.getItem('events_queue');
      if (storedQueue && Array.isArray(storedQueue)) {
        this.queue = [...storedQueue, ...this.queue];
      }
    } catch (err) {
      console.error('Failed to load event queue', err);
    }
  }

  // Save queue to IndexedDB
  async saveQueueToStorage() {
    try {
      await localforage.setItem('events_queue', this.queue);
    } catch (err) {
      console.error('Failed to save event queue', err);
    }
  }

  // Start periodic sync
  startSyncTimer() {
    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => this.syncEvents(), this.SYNC_INTERVAL);
  }

  // Stop sync
  stopSync() {
    if (this.timerId) clearInterval(this.timerId);
    this.syncEvents(); // Final sync
  }

  // Sync events to backend
  async syncEvents() {
    if (this.isSyncing || this.queue.length === 0) return;
    if (!navigator.onLine) return; // Don't try if offline

    this.isSyncing = true;
    const batch = [...this.queue]; // Copy current queue
    
    try {
      await axios.post(`${API_URL}/events/batch`, { events: batch });
      
      // Remove synced events from queue
      this.queue = this.queue.filter(e => !batch.includes(e));
      await this.saveQueueToStorage();
      
      console.log(`✅ Synced ${batch.length} events`);
    } catch (error) {
      console.error('Failed to sync events:', error);
      // Leave events in queue to retry later
    } finally {
      this.isSyncing = false;
    }
  }
}

export const eventLogger = new EventLoggerService();
