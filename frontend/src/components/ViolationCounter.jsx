import useTestStore from '../store/testStore';

const ViolationCounter = () => {
  const { violationCount } = useTestStore();

  const getSeverityColor = (count) => {
    if (count === 0) return 'from-emerald-500/90 to-emerald-600/90';
    if (count < 3) return 'from-amber-500/90 to-amber-600/90';
    if (count < 5) return 'from-orange-500/90 to-orange-600/90';
    return 'from-red-500/90 to-red-600/90 animate-pulse';
  };

  return (
    <div className={`fixed top-24 right-6 z-40 px-6 py-3 rounded-2xl bg-gradient-to-br ${getSeverityColor(violationCount)} backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105`}>
      <div className="flex flex-col items-center">
        <span className="text-white/80 text-xs font-medium uppercase tracking-widest">Violations</span>
        <span className="text-white text-4xl font-bold leading-none tabular-nums">{violationCount}</span>
      </div>
      <div className="text-3xl">{violationCount === 0 ? '✓' : '⚠️'}</div>
    </div>
  );
};

export default ViolationCounter;
