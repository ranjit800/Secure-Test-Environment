import { AlertTriangle, Eye, Copy, MousePointer2, Monitor, Maximize } from 'lucide-react';

const TestInstructions = ({ onStart, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-t-2xl">
          <div className="flex items-center gap-3 text-white">
            <AlertTriangle className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-black">Test Rules & Restrictions</h2>
              <p className="text-red-100 text-sm">Please read carefully before starting</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Important Notice */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
            <p className="text-yellow-900 font-bold text-sm">
              ⚠️ This is a <span className="underline">monitored assessment</span>. All activities are tracked and violations will be recorded.
            </p>
          </div>

          {/* Test Details */}
          <div className="bg-zinc-50 rounded-xl p-4">
            <h3 className="font-bold text-black mb-2">📝 Test Details:</h3>
            <ul className="space-y-1 text-sm text-zinc-700">
              <li>• <span className="font-semibold">Questions:</span> 10 multiple-choice questions</li>
              <li>• <span className="font-semibold">Time Limit:</span> 5 minutes (auto-submits when time is up)</li>
              <li>• <span className="font-semibold">Navigation:</span> You can move between questions freely</li>
            </ul>
          </div>

          {/* Restrictions */}
          <div>
            <h3 className="font-bold text-black mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Strict Restrictions (Violations Recorded):
            </h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Maximize className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-red-900">Fullscreen Required</p>
                  <p className="text-xs text-red-700">You must stay in fullscreen mode. Exiting fullscreen = violation</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Monitor className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-red-900">No Tab Switching</p>
                  <p className="text-xs text-red-700">Switching tabs or minimizing the window = violation</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Eye className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-red-900">No Window Focus Loss</p>
                  <p className="text-xs text-red-700">Clicking outside browser, Alt+Tab, or losing focus = violation</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <Copy className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-red-900">No Copy/Paste</p>
                  <p className="text-xs text-red-700">Copying questions or pasting answers = violation</p>
                </div>
              </div>

              <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <MousePointer2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-red-900">No Right-Click</p>
                  <p className="text-xs text-red-700">Right-click context menu is disabled = violation if attempted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Consequences */}
          <div className="bg-orange-50 border border-orange-300 rounded-xl p-4">
            <h3 className="font-bold text-orange-900 mb-2">⚠️ Consequences:</h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• All violations are <span className="font-bold">permanently logged</span></li>
              <li>• Administrators can view all violation events</li>
              <li>• Multiple violations may result in test invalidation</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-300 rounded-xl p-4">
            <h3 className="font-bold text-green-900 mb-2">✓ Tips for Success:</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Close all other applications before starting</li>
              <li>• Disable notifications on your computer</li>
              <li>• Ensure stable internet connection</li>
              <li>• Read each question carefully</li>
              <li>• You can navigate between questions freely</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 bg-zinc-50 rounded-b-2xl">
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-zinc-200 text-black rounded-xl font-bold hover:bg-zinc-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onStart}
              className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all"
            >
              I Understand - Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;
