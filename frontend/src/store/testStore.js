import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTestStore = create(
  persist(
    (set, get) => ({
      // State
      attemptId: null,
      assessmentId: null,
      userId: null,
      user: null, // Store full user details
      token: null, // JWT token
      startTime: null,
      isTestActive: false,
      hasStartedTest: false,
      isSubmitted: false,
      isSubmitting: false, // Track if submission is in progress
      
      violationCount: 0,
      warnings: [],
      
      answers: {}, // Quiz answers
      
      focusState: true,
      isFullscreen: false,
      
      currentQuestionId: null,

      // Actions
      startTest: (attemptId, userId, assessmentId, user, token) => set({
        attemptId,
        userId,
        assessmentId,
        user, // Store user info
        token, // Store JWT
        startTime: new Date().toISOString(),
        isTestActive: true,
        violationCount: 0,
        warnings: [],
        isSubmitted: false,
        isSubmitting: false
      }),

      markTestStarted: () => set({ hasStartedTest: true }),

      setSubmitting: (value) => set({ isSubmitting: value }),

      endTest: () => set({
        isTestActive: false,
        isSubmitted: true,
        isSubmitting: false
      }),

      incrementViolation: () => set((state) => ({
        violationCount: state.violationCount + 1
      })),

      addWarning: (warning) => set((state) => ({
        warnings: [...state.warnings, { ...warning, id: Date.now() }]
      })),

      clearWarning: (id) => set((state) => ({
        warnings: state.warnings.filter(w => w.id !== id)
      })),

      updateFocusState: (hasFocus) => set({ focusState: hasFocus }),
      
      updateFullscreenState: (isPartOfFullscreen) => set({ isFullscreen: isPartOfFullscreen }),

      setCurrentQuestion: (id) => set({ currentQuestionId: id }),
      
      setAnswer: (questionId, answer) => set((state) => ({
        answers: { ...state.answers, [questionId]: answer }
      })),
      
      resetStore: () => set({
        attemptId: null,
        assessmentId: null,
        userId: null,
        user: null,
        token: null,
        startTime: null,
        isTestActive: false,
        hasStartedTest: false,
        isSubmitted: false,
        isSubmitting: false,
        violationCount: 0,
        warnings: [],
        answers: {},
        focusState: true,
        isFullscreen: false,
        currentQuestionId: null
      })
    }),
    {
      name: 'secure-test-storage',
      partialize: (state) => ({ 
        attemptId: state.attemptId,
        userId: state.userId,
        user: state.user,
        token: state.token,
        assessmentId: state.assessmentId,
        isTestActive: state.isTestActive,
        hasStartedTest: state.hasStartedTest,
        violationCount: state.violationCount
      }),
    }
  )
);

export default useTestStore;
