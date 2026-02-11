import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useTestStore = create(
  persist(
    (set, get) => ({
      // State
      attemptId: null,
      assessmentId: null,
      userId: null,
      startTime: null,
      isTestActive: false,
      hasStartedTest: false,
      isSubmitted: false,
      isSubmitting: false, // Track if submission is in progress
      
      violationCount: 0,
      warnings: [],
      
      focusState: true,
      isFullscreen: false,
      
      currentQuestionId: null,

      // Actions
      startTest: (attemptId, userId, assessmentId) => set({
        attemptId,
        userId,
        assessmentId,
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
      
      resetStore: () => set({
        attemptId: null,
        assessmentId: null,
        userId: null,
        startTime: null,
        isTestActive: false,
        hasStartedTest: false,
        isSubmitted: false,
        isSubmitting: false,
        violationCount: 0,
        warnings: [],
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
        assessmentId: state.assessmentId,
        isTestActive: state.isTestActive,
        hasStartedTest: state.hasStartedTest,
        violationCount: state.violationCount
      }),
    }
  )
);

export default useTestStore;
