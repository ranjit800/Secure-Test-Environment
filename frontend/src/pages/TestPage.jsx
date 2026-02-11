import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTestStore from '../store/testStore';
import { apiService } from '../services/apiService';
import { eventLogger } from '../services/eventLogger';
import toast from 'react-hot-toast';

const TestPage = () => {
  const navigate = useNavigate();
  const { attemptId, endTest, hasStartedTest, markTestStarted, setSubmitting } = useTestStore();
  const [localTestStarted, setLocalTestStarted] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    setLocalTestStarted(hasStartedTest);
  }, [hasStartedTest]);

  const handleEnterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setLocalTestStarted(true);
      markTestStarted();
      eventLogger.log('ATTEMPT_STARTED');
      toast.success('Test started! Stay in fullscreen mode.', { duration: 3000 });
    } catch (err) {
      console.error('Fullscreen request failed:', err);
      toast.error('Please allow fullscreen to start the test');
    }
  };

  const handleAnswer = (option) => {
    if (!localTestStarted) return;
    eventLogger.log('ANSWER_SELECTED', { option });
    toast.success('Answer Saved', { duration: 1000, icon: '💾' });
  };

  const handleSubmitClick = () => {
    setSubmitting(true); // Prevent violations during modal interaction
    setShowSubmitModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const loading = toast.loading('Submitting Assessment...');
      
      eventLogger.stopSync();
      await apiService.submitAttempt(attemptId);
      
      endTest();
      
      toast.dismiss(loading);
      toast.success('Assessment Submitted Successfully!');
      
      navigate('/result');
      
      setTimeout(() => {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }, 100);
      
    } catch (error) {
      console.error(error);
      toast.error('Submission failed. Please check your connection.');
      setSubmitting(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowSubmitModal(false);
    setSubmitting(false); // Re-enable violation detection
  };

  if (!localTestStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl text-center">
          <div className="text-7xl mb-6">🖥️</div>
          <h2 className="text-3xl font-black text-black mb-3">Ready to Start?</h2>
          <p className="text-zinc-600 mb-8 text-lg leading-relaxed">
            Click the button below to enter fullscreen mode and begin your assessment.
          </p>
          <button
            onClick={handleEnterFullscreen}
            className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-xl uppercase tracking-wider text-sm"
          >
            Enter Fullscreen & Start Test
          </button>
          <p className="text-zinc-400 text-sm mt-4">
            Once started, you must remain in fullscreen mode
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl transform scale-100 transition-all">
            <div className="text-6xl text-center mb-6">⚠️</div>
            <h3 className="text-3xl font-black text-black text-center mb-4">Submit Assessment?</h3>
            <p className="text-zinc-600 text-center mb-8 text-lg leading-relaxed">
              This action cannot be undone. Make sure you've reviewed all your answers.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-black font-bold py-4 px-6 rounded-xl transition-all uppercase tracking-wider text-sm"
              >
                Review Again
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 bg-black hover:bg-zinc-800 text-white font-bold py-4 px-6 rounded-xl transition-all uppercase tracking-wider text-sm"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-2xl font-bold text-black">Section 1: Logical Reasoning</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-black font-mono text-xl font-semibold bg-zinc-100 px-4 py-2 rounded-xl">
            29:58
          </div>
          <button 
            onClick={handleSubmitClick}
            className="bg-black hover:bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold transition-all uppercase tracking-wider text-sm shadow-lg hover:shadow-xl"
          >
            Submit Test
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-8 pt-12">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-zinc-200">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-zinc-200">
            <div className="flex items-center gap-4">
              <span className="bg-black text-white px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                Question 1/10
              </span>
              <span className="text-zinc-400 font-mono text-sm">ID: Q-101</span>
            </div>
            <div className="flex gap-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-black' : 'bg-zinc-200'}`}
                ></div>
              ))}
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-black mb-10 leading-snug">
            Which of the following is NOT a principle of Object-Oriented Programming?
          </h2>

          <div className="space-y-4">
            {['Encapsulation', 'Polymorphism', 'Compilation', 'Inheritance'].map((option, index) => (
              <label 
                key={option}
                className="flex items-center p-6 border-2 border-zinc-200 rounded-2xl hover:border-black hover:bg-zinc-50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-center w-8 h-8 border-2 border-zinc-300 rounded-full mr-5 group-hover:border-black transition-colors">
                  <input 
                    type="radio" 
                    name="q1" 
                    className="appearance-none w-4 h-4 rounded-full checked:bg-black"
                    onChange={() => handleAnswer(option)}
                  />
                </div>
                <span className="text-zinc-700 group-hover:text-black text-xl font-medium transition-colors">
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-10 pt-8 border-t border-zinc-200">
            <button className="px-8 py-3 rounded-xl font-bold text-zinc-400 cursor-not-allowed">
              ← Previous
            </button>
            <button className="px-8 py-3 bg-black hover:bg-zinc-800 text-white rounded-xl font-bold transition-colors uppercase tracking-wider text-sm">
              Next Question →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage;
