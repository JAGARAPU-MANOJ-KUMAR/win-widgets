import React from 'react';

interface NavigationProps {
  currentView: 'widgets' | 'dashboard';
  onChangeView: (view: 'widgets' | 'dashboard') => void;
  onOpenSync: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onChangeView,
  onOpenSync,
}) => {
  return (
    <header className="px-6 py-3 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪐</span>
          <span className="font-extrabold text-sm tracking-wider text-slate-100">
            OmniDesk
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            v1.0
          </span>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex items-center p-1 bg-slate-900/80 rounded-xl border border-white/5">
        <button
          onClick={() => onChangeView('widgets')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            currentView === 'widgets'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📌 Screen Widgets
        </button>

        <button
          onClick={() => onChangeView('dashboard')}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
            currentView === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📊 Central Workspace
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSync}
          className="text-xs px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-all font-medium flex items-center gap-1.5"
        >
          <span>GitHub Sync</span>
        </button>
      </div>
    </header>
  );
};

