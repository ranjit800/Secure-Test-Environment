import { useEffect, useRef } from 'react';
import useTestStore from '../store/testStore';
import { eventLogger } from '../services/eventLogger';
import toast from 'react-hot-toast';

const BrowserEnforcer = () => {
  const { 
    isTestActive, 
    incrementViolation, 
    addWarning, 
    updateFocusState, 
    updateFullscreenState,
    isSubmitted,
    isSubmitting,
    isFullscreen
  } = useTestStore();

  const isTestActiveRef = useRef(isTestActive);
  const isSubmittedRef = useRef(isSubmitted);
  const hasEnteredFullscreenRef = useRef(false);

  // Sync refs safely
  useEffect(() => {
    isTestActiveRef.current = isTestActive;
    isSubmittedRef.current = isSubmitted;
  }, [isTestActive, isSubmitted]);

  // Track if user has successfully entered fullscreen at least once
  useEffect(() => {
    if (isFullscreen) {
      hasEnteredFullscreenRef.current = true;
    }
  }, [isFullscreen]);

  useEffect(() => {
    // Don't enforce anything until test is active
    if (!isTestActive || isSubmitted) return;

    // --- 1. Tab Switch / Visibility Change ---
    const handleVisibilityChange = () => {
      if (!isTestActiveRef.current || isSubmittedRef.current) return;
      if (!hasEnteredFullscreenRef.current) return;
      if (get().isSubmitting) return; // Skip during submit confirmation

      if (document.hidden) {
        eventLogger.log('TAB_SWITCH', { hidden: true });
        incrementViolation();
        addWarning({ type: 'TAB_SWITCH', message: 'You switched tabs!' });
        toast.error('⚠️ Violation: Tab Switching is Prohibited!', { duration: 4000 });
      } else {
        eventLogger.log('FOCUS_RESTORED', { hidden: false });
      }
    };

    // --- 2. Window Blur / Focus Loss ---
    const handleBlur = () => {
      if (!isTestActiveRef.current || isSubmittedRef.current) return;
      if (!hasEnteredFullscreenRef.current) return;
      if (useTestStore.getState().isSubmitting) return; // Skip during submit confirmation

      setTimeout(() => {
        if (!document.hasFocus()) {
          eventLogger.log('WINDOW_BLUR', { type: 'blur' });
          incrementViolation();
          updateFocusState(false);
          addWarning({ type: 'WINDOW_BLUR', message: 'Test window lost focus!' });
          toast.error('⚠️ Violation: Keep the Test Window Focused!', { duration: 4000 });
        }
      }, 100);
    };

    const handleFocus = () => {
      if (!isTestActiveRef.current || isSubmittedRef.current) return;
      updateFocusState(true);
      if (hasEnteredFullscreenRef.current) {
        eventLogger.log('FOCUS_RESTORED', { type: 'focus' });
      }
    };

    // --- 3. Fullscreen Enforcement ---
    const handleFullscreenChange = () => {
      if (!isTestActiveRef.current || isSubmittedRef.current) return;

      const isFullscreen = !!document.fullscreenElement;
      updateFullscreenState(isFullscreen);

      // Only log violations if user has successfully entered fullscreen before
      if (!isFullscreen && hasEnteredFullscreenRef.current) {
        eventLogger.log('FULLSCREEN_EXIT');
        incrementViolation();
        addWarning({ type: 'FULLSCREEN_EXIT', message: 'You exited fullscreen mode!' });
        toast.error('⚠️ Violation: Fullscreen is Required!', { duration: 5000 });
      } else if (isFullscreen) {
        eventLogger.log('FULLSCREEN_ENTERED');
        hasEnteredFullscreenRef.current = true;
      }
    };

    // --- 4. Prevent Copy/Paste/Context Menu ---
    const preventAction = (e, type) => {
      if (!isTestActiveRef.current || isSubmittedRef.current) return;
      if (!hasEnteredFullscreenRef.current) return;
      
      e.preventDefault();
      eventLogger.log(type);
      incrementViolation();
      toast.error(`⚠️ ${type.replace('_', ' ')} is disabled!`);
    };

    // Attach Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    // Prevent context menu (right click)
    const handleContextMenu = (e) => preventAction(e, 'CONTEXT_MENU');
    const handleCopy = (e) => preventAction(e, 'COPY_ATTEMPT');
    const handlePaste = (e) => preventAction(e, 'PASTE_ATTEMPT');
    const handleCut = (e) => preventAction(e, 'COPY_ATTEMPT');
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCut);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCut);
    };
  }, [isTestActive, isSubmitted, incrementViolation, addWarning, updateFocusState, updateFullscreenState]);

  return null; // Logic-only component
};

export default BrowserEnforcer;
