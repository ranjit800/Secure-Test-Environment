import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, AlertTriangle, Maximize } from 'lucide-react';
import useTestStore from '../store/testStore';
import { apiService } from '../services/apiService';
import { eventLogger } from '../services/eventLogger';
import Timer from '../components/Timer';
import toast from 'react-hot-toast';

const TestPage = () => {
  const navigate = useNavigate();
  const { 
    attemptId, 
    violationCount, 
    answers, 
    isFullscreen,
    updateFullscreenState,
    incrementViolation,
    setAnswer, 
    endTest 
  } = useTestStore();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showFullscreenBanner, setShowFullscreenBanner] = useState(false);
  const hasRequestedFullscreen = useRef(false);

  // Request fullscreen on mount
  useEffect(() => {
    const requestFullscreen = async () => {
      if (hasRequestedFullscreen.current) return;
      hasRequestedFullscreen.current = true;

      try {
        await document.documentElement.requestFullscreen();
        updateFullscreenState(true);
      } catch (error) {
        console.error('Fullscreen request failed:', error);
        setShowFullscreenBanner(true);
      }
    };

    requestFullscreen();
  }, [updateFullscreenState]);

  // Monitor fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      updateFullscreenState(isNowFullscreen);

      if (!isNowFullscreen) {
        setShowFullscreenBanner(true);
        eventLogger.logEvent(attemptId, 'FULLSCREEN_EXIT', {});
        incrementViolation();
        toast.error('Fullscreen exited! Violation recorded.');
      } else {
        setShowFullscreenBanner(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [attemptId, updateFullscreenState, incrementViolation]);

  // Monitor window visibility (tab switch)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        eventLogger.logEvent(attemptId, 'TAB_SWITCH', {});
        incrementViolation();
        toast.error('Tab switch detected! Violation recorded.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attemptId, incrementViolation]);

  // Monitor window blur
  useEffect(() => {
    const handleBlur = () => {
      eventLogger.logEvent(attemptId, 'WINDOW_BLUR', {});
      incrementViolation();
      toast.error('Window lost focus! Violation recorded.');
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [attemptId, incrementViolation]);

  // Prevent copy/paste
  useEffect(() => {
    const handleCopy = (e) => {
      e.preventDefault();
      eventLogger.logEvent(attemptId, 'COPY_ATTEMPT', {});
      incrementViolation();
      toast.error('Copy prevented! Violation recorded.');
    };

    const handlePaste = (e) => {
      e.preventDefault();
      eventLogger.logEvent(attemptId, 'PASTE_ATTEMPT', {});
      incrementViolation();
      toast.error('Paste prevented! Violation recorded.');
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      eventLogger.logEvent(attemptId, 'CONTEXT_MENU', {});
      incrementViolation();
      toast.error('Context menu disabled! Violation recorded.');
    };

    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [attemptId, incrementViolation]);

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await apiService.getQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading questions:', error);
        toast.error('Failed to load questions');
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, []);

  const handleEnterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowFullscreenBanner(false);
    } catch (error) {
      toast.error('Unable to enter fullscreen');
    }
  };

  const handleTimeUp = () => {
    toast.error('Time is up! Auto-submitting...');
    handleSubmit();
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    
    try {
      const loading = toast.loading('Submitting Assessment...');
      
      // Stop event logging
      await eventLogger.stopSync();
      
      // Submit with answers and violation count
      await apiService.submitAttempt(attemptId, violationCount, answers);
      
      endTest();
      toast.dismiss(loading);
      toast.success('Assessment submitted successfully!');
      navigate('/result');
      
    } catch (error) {
      console.error('Error submitting:', error);
      toast.error('Failed to submit. Please try again.');
    }
  };

  const handleAnswer = (questionId, option) => {
    // Only allow answers when in fullscreen
    if (!isFullscreen) {
      toast.error('Please enter fullscreen to answer questions!');
      return;
    }
    setAnswer(questionId, option);
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentIndex === questions.length - 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white font-bold">Loading Assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-3 sm:p-6">
      <Timer onTimeUp={handleTimeUp} duration={300} />
      
      {/* Fullscreen Warning Banner */}
      {showFullscreenBanner && (
        <div className="fixed top-4 sm:top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 sm:gap-4 animate-pulse max-w-[90vw]">
          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
          <div className="text-center sm:text-left">
            <p className="font-bold text-sm sm:text-base">Fullscreen Required!</p>
            <p className="text-xs sm:text-sm">Click below to re-enter fullscreen</p>
          </div>
          <button
            onClick={handleEnterFullscreen}
            className="sm:ml-4 bg-white text-red-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-bold hover:bg-zinc-100 transition-all flex items-center gap-2"
          >
            <Maximize className="w-4 h-4" />
            <span className="hidden sm:inline">Enter Fullscreen</span>
            <span className="sm:hidden">Enter</span>
          </button>
        </div>
      )}

      {/* Violation Counter */}
      {/* Removed - violations tracked internally */}
      
      <div className="max-w-4xl mx-auto pt-12 sm:pt-20">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-black">Web Development Quiz</h2>
              <p className="text-xs sm:text-sm text-zinc-500">Question {currentIndex + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-zinc-500">Answered</p>
              <p className="text-2xl sm:text-3xl font-black text-black">{answeredCount}/{questions.length}</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-zinc-200 rounded-full h-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl mb-4 sm:mb-6">
          <div className="mb-4 sm:mb-6">
            <span className="bg-black text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
              Question {currentIndex + 1}
            </span>
          </div>
          
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-6 sm:mb-8">
            {currentQuestion?.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 sm:space-y-4">
            {currentQuestion && Object.entries(currentQuestion.options).map(([key, value]) => {
              const isSelected = answers[currentQuestion.id] === key;
              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(currentQuestion.id, key)}
                  disabled={!isFullscreen}
                  className={`w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 text-left transition-all ${
                    !isFullscreen
                      ? 'opacity-50 cursor-not-allowed border-zinc-300 bg-zinc-100 text-zinc-500'
                      : isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-zinc-200 bg-white text-black hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 ${
                      !isFullscreen
                        ? 'bg-zinc-200 text-zinc-400'
                        : isSelected ? 'bg-white text-black' : 'bg-zinc-100 text-black'
                    }`}>
                      {key}
                    </span>
                    <span className="font-medium text-sm sm:text-base">{value}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black rounded-lg sm:rounded-xl text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-full px-1 py-1">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
                  idx === currentIndex
                    ? 'bg-black text-white'
                    : answers[questions[idx]?.id]
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-black border-2 border-zinc-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {isLastQuestion ? (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-green-700 transition-all shadow-lg"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black rounded-lg sm:rounded-xl text-sm sm:text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 sm:p-6 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full">
            <h3 className="text-xl sm:text-2xl font-black text-black mb-3 sm:mb-4">Submit Assessment?</h3>
            <p className="text-sm sm:text-base text-zinc-600 mb-2">
              You have answered <span className="font-bold">{answeredCount}</span> out of <span className="font-bold">{questions.length}</span> questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-sm sm:text-base text-yellow-600 font-bold mb-4 sm:mb-6">
                ⚠️ You have unanswered questions!
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-200 text-black rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-zinc-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-zinc-800 transition-all"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPage;
