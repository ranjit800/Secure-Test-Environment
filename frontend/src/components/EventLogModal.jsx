import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

const EventLogModal = ({ isOpen, onClose, attempt, events, loading }) => {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !attempt) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop with click to close */}
      <div 
        className="absolute inset-0 bg-black/20 cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Modal Content */}
        <div 
          className="bg-white rounded-2xl shadow-2xl max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-black">Event Log</h3>
            <p className="text-sm text-gray-600 mt-1">
              {attempt.studentName} ({attempt.username}) - {attempt.assessmentId}
            </p>
            <p className="text-xs text-gray-400 mt-1">Click outside or press ESC to close</p>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="ml-3 text-gray-600">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No events recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event, index) => {
                  const isViolation = ['TAB_SWITCH', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'CONTEXT_MENU'].includes(event.eventType);
                  
                  return (
                    <div
                      key={event._id || index}
                      className={`p-4 rounded-lg border ${
                        isViolation 
                          ? 'border-red-200 bg-red-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            isViolation 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-600 text-white'
                          }`}>
                            {event.eventType.replace(/_/g, ' ')}
                          </span>
                          {isViolation && (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="text-xs text-gray-600 mt-2">
                          <pre className="bg-white p-2 rounded border border-gray-200 overflow-x-auto">
                            {JSON.stringify(event.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLogModal;
