import React from 'react';
import { ClockIcon, CheckIcon, NoteIcon, PlusIcon } from '../common/Icons';

export const DesktopLauncherBar: React.FC = () => {
  const spawnWidget = (type: string) => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.spawnWidget(type);
    } else {
      window.open(`/?widget=${type}&id=widget-${type}-${Date.now()}`, '_blank');
    }
  };

  const toggleAll = () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.toggleAll();
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-1 select-none">
      <div
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl cursor-move"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
          <span className="text-sm">🪐</span>
          <span className="font-extrabold text-[11px] tracking-wider bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
            WIDGETS
          </span>
        </div>

        {/* Quick Add Buttons (no-drag) */}
        <div
          className="flex items-center gap-1.5"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          <button
            onClick={() => spawnWidget('timetable')}
            title="Place Timetable Widget on Screen"
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all"
          >
            <ClockIcon className="w-3 h-3" />
            <span>+ Timetable</span>
          </button>

          <button
            onClick={() => spawnWidget('tasks')}
            title="Place Task Tracker Widget on Screen"
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all"
          >
            <CheckIcon className="w-3 h-3" />
            <span>+ Tasks</span>
          </button>

          <button
            onClick={() => spawnWidget('scratchpad')}
            title="Place Scratchpad Widget on Screen"
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition-all"
          >
            <NoteIcon className="w-3 h-3" />
            <span>+ Notes</span>
          </button>

          <button
            onClick={() => spawnWidget('pomodoro')}
            title="Place Pomodoro Focus Widget on Screen"
            className="flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 transition-all"
          >
            <span>🎯 + Focus</span>
          </button>

          <div className="h-3 w-[1px] bg-white/10 mx-0.5" />

          {/* Toggle All button */}
          <button
            onClick={toggleAll}
            title="Show or Hide All Desktop Widgets"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5 text-xs font-mono"
          >
            👁️
          </button>
        </div>
      </div>
    </div>
  );
};

