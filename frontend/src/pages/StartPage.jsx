import { useNavigate } from 'react-router-dom';
import useTestStore from '../store/testStore';
import { apiService } from '../services/apiService';
import { eventLogger } from '../services/eventLogger';
import toast from 'react-hot-toast';

const StartPage = () => {
  const navigate = useNavigate();
  const { startTest } = useTestStore();

  const handleStart = async () => {
    try {
      const loadingToast = toast.loading('Initializing Secure Environment...');
      
      const userId = 'user-' + Math.random().toString(36).substr(2, 9);
      const assessmentId = 'eval-101';
      
      // Start attempt on backend
      const data = await apiService.startAttempt(userId, assessmentId, {
        browser: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`
      });

      // Initialize store (but don't mark as active yet)
      startTest(data.attemptId, userId, assessmentId);
      
      // Initialize event logger
      eventLogger.init();

      toast.dismiss(loadingToast);
      toast.success('Redirecting to test...');
      
      // Navigate to test page (fullscreen will be requested there)
      navigate('/test');
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to start test. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-white to-zinc-100 rounded-t-3xl p-10 text-center border-b border-zinc-200">
          <div className="inline-block p-4 bg-black rounded-2xl mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-5xl font-black text-black mb-3 tracking-tight">Secure Assessment</h1>
          <p className="text-zinc-600 text-lg">Environment designed for integrity</p>
        </div>
        
        {/* Main Content Card */}
        <div className="bg-white rounded-b-3xl p-10 shadow-2xl border-x border-b border-zinc-200">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                Security Protocols
              </h3>
              <ul className="space-y-4">
                {[
                  'Fullscreen mode is mandatory throughout the assessment',
                  'Tab switching will trigger immediate violation alerts',
                  'Copy/paste and context menus are disabled',
                  'All actions are monitored and logged in real-time'
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-4 group">
                    <span className="mt-1 w-2 h-2 bg-black rounded-full group-hover:scale-150 transition-transform"></span>
                    <span className="text-zinc-700 text-lg leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-black text-white rounded-2xl p-6 flex items-start gap-4">
              <span className="text-3xl">💡</span>
              <div>
                <p className="font-semibold mb-1">Before you begin</p>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Ensure stable internet connection. Do not close this window until you submit your assessment.
                </p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-black hover:bg-zinc-800 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 uppercase tracking-wider text-sm"
            >
              I Agree & Start Assessment →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
