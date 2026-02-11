import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Trophy, Award, Medal } from 'lucide-react';
import useTestStore from '../store/testStore';
import { apiService } from '../services/apiService';

const ResultPage = () => {
  const navigate = useNavigate();
  const { violationCount, attemptId, resetStore } = useTestStore();
  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exit fullscreen when results page loads
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => {
        console.error('Error exiting fullscreen:', err);
      });
    }

    const fetchAttempt = async () => {
      try {
        if (attemptId) {
          const data = await apiService.getAttempt(attemptId);
          setAttemptData(data.attempt || data);
        }
      } catch (error) {
        console.error('Error fetching attempt:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttempt();
  }, [attemptId]);

  const handleReturn = async () => {
    // Exit fullscreen before navigating home
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error('Error exiting fullscreen:', err);
      }
    }
    resetStore();
    navigate('/');
  };

  const getStatus = () => {
    // If we have a score, base status on that
    if (attemptData?.score !== null && attemptData?.score !== undefined) {
      if (attemptData.score >= 80) return {
        text: 'Excellent',
        desc: `${attemptData.score}% - Outstanding Performance`,
        icon: <Trophy className="w-12 h-12" />,
        gradient: 'from-emerald-500 to-teal-600'
      };
      if (attemptData.score >= 60) return {
        text: 'Good',
        desc: `${attemptData.score}% - Good Performance`,
        icon: <Award className="w-12 h-12" />,
        gradient: 'from-blue-500 to-cyan-600'
      };
      if (attemptData.score >= 40) return {
        text: 'Fair',
        desc: `${attemptData.score}% - Room for Improvement`,
        icon: <Medal className="w-12 h-12" />,
        gradient: 'from-amber-500 to-orange-600'
      };
      return {
        text: 'Needs Improvement',
        desc: `${attemptData.score}% - Keep Practicing`,
        icon: <Medal className="w-12 h-12" />,
        gradient: 'from-red-500 to-rose-600'
      };
    }
    
    // Fallback to violation-based status
    if (violationCount === 0) return {
      text: 'Perfect Integrity',
      desc: 'No violations detected',
      icon: <Trophy className="w-12 h-12" />,
      gradient: 'from-emerald-500 to-teal-600'
    };
    if (violationCount < 3) return {
      text: 'Good Integrity',
      desc: 'Minor violations detected',
      icon: <Award className="w-12 h-12" />,
      gradient: 'from-blue-500 to-cyan-600'
    };
    if (violationCount < 5) return {
      text: 'Fair Integrity',
      desc: 'Multiple violations detected',
      icon: <Medal className="w-12 h-12" />,
      gradient: 'from-amber-500 to-orange-600'
    };
    return {
      text: 'Compromised',
      desc: 'Serious violations detected',
      icon: <Medal className="w-12 h-12" />,
      gradient: 'from-red-500 to-rose-600'
    };
  };

  const status = getStatus();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Success Animation Container */}
        <div className="text-center mb-8">
          <div className={`inline-block p-8 bg-gradient-to-br ${status.gradient} rounded-full mb-6 shadow-2xl`}>
            <div className="text-white">{status.icon}</div>
          </div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">Assessment Complete</h1>
          <p className="text-zinc-400 text-lg">Your submission has been recorded</p>
        </div>

        {/* Results Card */}
        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-zinc-200 mb-6">
          <div className="text-center mb-8">
            <div className={`inline-block px-6 py-3 bg-gradient-to-r ${status.gradient} text-white rounded-2xl font-bold text-xl mb-2`}>
              {status.text}
            </div>
            <p className="text-zinc-500 text-sm">{status.desc}</p>
          </div>

          <div className="space-y-4 pt-6 border-t border-zinc-200">
            {attemptData?.score !== null && attemptData?.score !== undefined && (
              <>
                <div className="flex justify-between items-center p-6 bg-gradient-to-r from-black to-zinc-800 rounded-2xl text-white">
                  <span className="font-bold">Quiz Score</span>
                  <div className="text-right">
                    <div className="text-4xl font-black">
                      {attemptData.correctAnswers}/{attemptData.totalQuestions}
                    </div>
                    <div className="text-lg font-bold opacity-90">
                      {attemptData.score}%
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="flex justify-between items-center p-4 bg-zinc-50 rounded-xl">
              <span className="text-zinc-600 font-medium">Total Violations</span>
              <span className="text-3xl font-bold text-black tabular-nums">{violationCount}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-50 rounded-xl">
              <span className="text-zinc-600 font-medium">Assessment ID</span>
              <span className="text-sm font-mono text-zinc-400">EVAL-101-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-zinc-50 rounded-xl">
              <span className="text-zinc-600 font-medium">Status</span>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Submitted
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleReturn}
          className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-5 px-8 rounded-2xl transition-all duration-200 shadow-xl hover:shadow-2xl uppercase tracking-wider text-sm"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
