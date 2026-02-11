import useTestStore from '../store/testStore';

const FullscreenWarning = () => {
  const { isFullscreen, isTestActive, hasStartedTest, isSubmitted } = useTestStore();

  // Only show warning if:
  // 1. Test is active
  // 2. Test has been started (user entered fullscreen at least once)
  // 3. User is NOT currently in fullscreen
  // 4. Test is not submitted
  if (!isTestActive || !hasStartedTest || isFullscreen || isSubmitted) return null;

  const requestFullscreen = () => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-zinc-900 to-black max-w-md w-full p-10 rounded-3xl shadow-2xl text-center border border-white/10 transform scale-100 transition-all">
        <div className="text-7xl mb-6 animate-bounce">🖥️</div>
        <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Fullscreen Required</h2>
        <p className="text-zinc-400 mb-10 text-lg leading-relaxed">
          For test integrity, you must complete this assessment in fullscreen mode.
        </p>
        <button
          onClick={requestFullscreen}
          className="w-full bg-white hover:bg-zinc-100 text-black font-bold py-5 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-xl uppercase tracking-wider text-sm"
        >
          Enter Fullscreen
        </button>
      </div>
    </div>
  );
};

export default FullscreenWarning;
