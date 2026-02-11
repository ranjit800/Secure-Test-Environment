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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black p-6">
      <Timer onTimeUp={handleTimeUp} duration={300} />
      
      {/* Fullscreen Warning Banner */}
      {showFullscreenBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-pulse">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <p className="font-bold">Fullscreen Required!</p>
            <p className="text-sm">Click below to re-enter fullscreen</p>
          </div>
          <button
            onClick={handleEnterFullscreen}
            className="ml-4 bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-zinc-100 transition-all flex items-center gap-2"
          >
            <Maximize className="w-4 h-4" />
            Enter Fullscreen
          </button>
        </div>
      )}

      {/* Violation Counter */}
      {/* Removed - violations tracked internally */}
      
      <div className="max-w-4xl mx-auto pt-20">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-black">Web Development Quiz</h2>
              <p className="text-zinc-500">Question {currentIndex + 1} of {questions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-500">Answered</p>
              <p className="text-3xl font-black text-black">{answeredCount}/{questions.length}</p>
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
        <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6">
          <div className="mb-6">
            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
              Question {currentIndex + 1}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-black mb-8">
            {currentQuestion?.question}
          </h3>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion && Object.entries(currentQuestion.options).map(([key, value]) => {
              const isSelected = answers[currentQuestion.id] === key;
              return (
                <button
                  key={key}
                  onClick={() => handleAnswer(currentQuestion.id, key)}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-black bg-black text-white'
                      : 'border-zinc-200 bg-white text-black hover:border-black'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected ? 'bg-white text-black' : 'bg-zinc-100 text-black'
                    }`}>
                      {key}
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
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
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 transition-all"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-black text-black mb-4">Submit Assessment?</h3>
            <p className="text-zinc-600 mb-2">
              You have answered <span className="font-bold">{answeredCount}</span> out of <span className="font-bold">{questions.length}</span> questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-yellow-600 font-bold mb-6">
                ⚠️ You have unanswered questions!
              </p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-6 py-3 bg-zinc-200 text-black rounded-xl font-bold hover:bg-zinc-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
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
