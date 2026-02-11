import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock } from 'lucide-react';
import useTestStore from '../store/testStore';
import { apiService } from '../services/apiService';
import { eventLogger } from '../services/eventLogger';
import TestInstructions from '../components/TestInstructions';
import toast from 'react-hot-toast';

const StartPage = () => {
  const navigate = useNavigate();
  const { startTest, resetStore } = useTestStore();
  const [showStudentAuth, setShowStudentAuth] = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  // Reset store when returning to start page
  useEffect(() => {
    resetStore();
  }, [resetStore]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Student Auth
  const handleStudentAuth = async (e) => {
    e.preventDefault();
    try {
      const loadingToast = toast.loading(isLogin ? 'Verifying...' : 'Creating Account...');
      
      let user;
      if (isLogin) {
        user = await apiService.login({
          username: formData.username,
          password: formData.password
        });
      } else {
        user = await apiService.register({
          name: formData.name,
          username: formData.username,
          password: formData.password
        });
      }
      
      toast.dismiss(loadingToast);
      
      if (user.role === 'admin') {
        toast.error('Admin accounts cannot take tests');
        return;
      }
      
      toast.success(`Welcome, ${user.name}!`);
      
      // Show instructions before starting test
      setPendingUser(user);
      setShowInstructions(true);
      
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  // Admin Auth
  const handleAdminAuth = async (e) => {
    e.preventDefault();
    try {
      const loadingToast = toast.loading('Verifying Admin...');
      
      const user = await apiService.login({
        username: formData.email, // Use email as username for admin
        password: formData.password
      });
      
      toast.dismiss(loadingToast);
      
      if (user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        return;
      }
      
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard', { state: { user, token: user.token } });
      
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Admin login failed');
    }
  };

  // Start Test
  const handleStartTest = async (user) => {
    try {
      const loadingToast = toast.loading('Initializing Secure Environment...');
      
      const userId = user._id;
      const assessmentId = 'eval-101';
      
      console.log('Starting test for user:', userId);
      
      // Start attempt on backend
      const data = await apiService.startAttempt(userId, assessmentId, {
        browser: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`
      });

      console.log('Attempt started:', data);

      // Initialize store with user details
      startTest(data.attemptId, userId, assessmentId, user, user.token);

      // Initialize event logging
      eventLogger.init();

      toast.dismiss(loadingToast);
      toast.success('Redirecting to test...');
      navigate('/test');
      
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      toast.dismiss();
      const errorMsg = error.response?.data?.message || error.message || 'Failed to start test';
      toast.error(errorMsg + '. Check console for details.');
    }
  };

  const handleInstructionsConfirm = async () => {
    setShowInstructions(false);
    if (pendingUser) {
      await handleStartTest(pendingUser);
      setPendingUser(null);
    }
  };

  const handleInstructionsCancel = () => {
    setShowInstructions(false);
    setPendingUser(null);
    setShowStudentAuth(false);
  };

  // Landing Page (Choose Role)
  if (!showStudentAuth && !showAdminAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-white mb-4">Secure Assessment Platform</h1>
            <p className="text-zinc-400 text-lg">Choose your access type</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Card */}
            <div className="bg-white rounded-3xl p-10 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-2">
              <div className="mb-6">
                <GraduationCap className="w-16 h-16 text-black" />
              </div>
              <h2 className="text-2xl font-black text-black mb-3">Student Portal</h2>
              <p className="text-zinc-600 mb-6">Take your secure assessment</p>
              <ul className="space-y-2 mb-8 text-sm text-zinc-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Fullscreen enforcement
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Violation tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  Secure environment
                </li>
              </ul>
              <button
                onClick={() => setShowStudentAuth(true)}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-all"
              >
                Enter as Student
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-black rounded-3xl p-10 shadow-2xl border-2 border-zinc-800 hover:shadow-3xl transition-all hover:-translate-y-2">
              <div className="mb-6">
                <Lock className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Admin Dashboard</h2>
              <p className="text-zinc-400 mb-6">Monitor student assessments</p>
              <ul className="space-y-2 mb-8 text-sm text-zinc-500">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  View all attempts
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Track violations
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  Analytics & reports
                </li>
              </ul>
              <button
                onClick={() => setShowAdminAuth(true)}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-100 transition-all"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Auth Page
  if (showStudentAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-md w-full relative">
          {/* Back Button - Top Left */}
          <button
            onClick={() => setShowStudentAuth(false)}
            className="absolute top-6 left-6 text-zinc-400 hover:text-black transition-colors flex items-center gap-2 text-sm font-bold"
          >
            ← Back
          </button>

          <div className="mb-8 mt-4">
            <h1 className="text-3xl font-black text-black mb-2">
              {isLogin ? 'Student Login' : 'Student Registration'}
            </h1>
            <p className="text-zinc-600">
              {isLogin ? 'Enter your credentials' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleStudentAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-black mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-black mb-2">Username</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-black mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-black"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition-all shadow-lg mt-6"
            >
              {isLogin ? 'Login & Start Test' : 'Register & Start Test'}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center text-sm">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-black font-bold hover:underline"
            >
              {isLogin ? 'Create Account' : 'Already have an account?'}
            </button>
            <button
              onClick={() => setShowStudentAuth(false)}
              className="text-zinc-600 hover:text-black font-bold"
            >
              Back
            </button>
          </div>
        </div>

        {/* Test Instructions Modal */}
        {showInstructions && (
          <TestInstructions
            onStart={handleInstructionsConfirm}
            onCancel={handleInstructionsCancel}
          />
        )}
      </div>
    );
  }

  // Admin Auth Page
  if (showAdminAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-6">
        <div className="bg-black border-2 border-zinc-800 rounded-3xl p-10 shadow-2xl max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
            <p className="text-zinc-400">Secure dashboard login</p>
          </div>

          <form onSubmit={handleAdminAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-white text-white"
                placeholder="admin@gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl focus:outline-none focus:border-white text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-100 transition-all shadow-lg mt-6"
            >
              Login to Dashboard
            </button>
          </form>

          <button
            onClick={() => setShowAdminAuth(false)}
            className="mt-6 text-zinc-400 hover:text-white font-bold text-sm"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }
};

export default StartPage;
