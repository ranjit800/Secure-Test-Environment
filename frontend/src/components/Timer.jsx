import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const Timer = ({ onTimeUp, duration = 300 }) => { // 300 seconds = 5 minutes
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft <= 60 && timeLeft > 0;
  const isExpired = timeLeft <= 0;

  return (
    <div className={`fixed top-6 right-6 z-40 px-6 py-4rounded-2xl shadow-2xl border-2 transition-all ${
      isExpired 
        ? 'bg-red-600 border-red-700' 
        : isWarning 
          ? 'bg-yellow-500 border-yellow-600 animate-pulse' 
          : 'bg-white border-zinc-200'
    }`}>
      <div className="flex items-center gap-3">
        {isWarning ? (
          <AlertCircle className={`w-6 h-6 ${isExpired ? 'text-white' : 'text-white'}`} />
        ) : (
          <Clock className="w-6 h-6 text-black" />
        )}
        <div className={`text-2xl font-black ${
          isExpired ? 'text-white' : isWarning ? 'text-white' : 'text-black'
        }`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
      </div>
      {isWarning && !isExpired && (
        <p className="text-xs font-bold text-white mt-1">TIME RUNNING OUT!</p>
      )}
      {isExpired && (
        <p className="text-xs font-bold text-white mt-1">SUBMITTING...</p>
      )}
    </div>
  );
};

export default Timer;
