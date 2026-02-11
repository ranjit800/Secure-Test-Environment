import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import EventLogModal from '../components/EventLogModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    // Get user and token from location state
    const { user: passedUser, token: passedToken } = location.state || {};
    
    if (!passedUser || !passedToken || passedUser.role !== 'admin') {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }

    setUser(passedUser);
    setToken(passedToken);
    fetchAttempts(passedToken);
  }, [location, navigate]);

  const fetchAttempts = async (authToken) => {
    try {
      const response = await axios.get(`${API_URL}/attempts/all/admin`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      
      setAttempts(response.data.attempts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching attempts:', error);
      toast.error('Failed to load attempts');
      setLoading(false);
    }
  };

  const fetchEvents = async (attemptId) => {
    setLoadingEvents(true);
    try {
      const response = await axios.get(`${API_URL}/events/attempt/${attemptId}`);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleRowClick = (attempt) => {
    setSelectedAttempt(attempt);
    fetchEvents(attempt._id);
  };

  const closeModal = () => {
    setSelectedAttempt(null);
    setEvents([]);
  };

  const getIntegrityStatus = (violationCount) => {
    if (violationCount === 0) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    if (violationCount <= 2) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (violationCount <= 5) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-zinc-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-black">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500">Welcome, {user?.name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <p className="text-sm text-zinc-500 mb-1">Total Attempts</p>
            <p className="text-3xl font-black text-black">{attempts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <p className="text-sm text-zinc-500 mb-1">Completed</p>
            <p className="text-3xl font-black text-green-600">
              {attempts.filter(a => a.status === 'completed').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200">
            <p className="text-sm text-zinc-500 mb-1">Active</p>
            <p className="text-3xl font-black text-blue-600">
              {attempts.filter(a => a.status === 'active').length}
            </p>
          </div>
        </div>

        {/* Attempts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200">
            <h2 className="text-lg font-bold text-black">All Test Attempts</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Assessment</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Violations</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Integrity</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-zinc-700 uppercase tracking-wider">Start Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {attempts.map((attempt) => {
                  const integrity = getIntegrityStatus(attempt.violationCount);
                  return (
                    <tr 
                      key={attempt._id} 
                      onClick={() => handleRowClick(attempt)}
                      className="hover:bg-zinc-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">{attempt.studentName || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-600">{attempt.username || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-zinc-600">{attempt.assessmentId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attempt.score !== null && attempt.score !== undefined ? (
                          <div className="text-sm">
                            <span className="font-bold text-black">{attempt.score}%</span>
                            <span className="text-zinc-500 text-xs ml-1">
                              ({attempt.correctAnswers}/{attempt.totalQuestions})
                            </span>
                          </div>
                        ) : (
                          <span className="text-zinc-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-black">{attempt.violationCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${integrity.bg} ${integrity.color}`}>
                          {integrity.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          attempt.status === 'completed' 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {attempt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">
                        {new Date(attempt.startTime).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Events Modal */}
      <EventLogModal
        isOpen={!!selectedAttempt}
        onClose={closeModal}
        attempt={selectedAttempt}
        events={events}
        loading={loadingEvents}
      />
    </div>
  );
};

export default DashboardPage;
