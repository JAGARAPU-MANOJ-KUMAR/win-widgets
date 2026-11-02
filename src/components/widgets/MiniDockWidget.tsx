import React from 'react';
import { WidgetSettings } from '../../types';
import { NoteIcon, ClockIcon, CheckIcon, SlidersIcon, PinIcon, GitHubIcon } from '../common/Icons';

interface MiniDockWidgetProps {
  settings: WidgetSettings;
  onUpdateSettings: (settings: WidgetSettings) => void;
  onOpenSyncModal: () => void;
}

export const MiniDockWidget: React.FC<MiniDockWidgetProps> = ({
  settings,
  onUpdateSettings,
  onOpenSyncModal,
}) => {
  const toggleSetting = (key: keyof WidgetSettings) => {
    const nextVal = !settings[key];
    onUpdateSettings({ ...settings, [key]: nextVal });

    // Inform Electron if available
    if (key === 'alwaysOnTop' && typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.togglePin(nextVal);
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = parseFloat(e.target.value);
    onUpdateSettings({ ...settings, opacity: newOpacity });

    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.setOpacity(newOpacity);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
      {/* App Branding */}
      <div className="flex items-center gap-2 pr-2 border-r border-white/10">
        <span className="text-lg">🪐</span>
        <span className="font-bold text-xs tracking-wider bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
          OMNIDESK
        </span>
      </div>

      {/* Widget Visibility Toggles */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => toggleSetting('showScratchpad')}
          title="Toggle Scratchpad Widget"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
            settings.showScratchpad
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 opacity-50'
          }`}
        >
          <NoteIcon className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => toggleSetting('showTimetable')}
          title="Toggle Timetable Widget"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
            settings.showTimetable
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 opacity-50'
          }`}
        >
          <ClockIcon className="w-3.5 h-3.5" />
          <span>Timetable</span>
        </button>

        <button
          onClick={() => toggleSetting('showTasks')}
          title="Toggle Tasks Widget"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
            settings.showTasks
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 opacity-50'
          }`}
        >
          <CheckIcon className="w-3.5 h-3.5" />
          <span>Tasks</span>
        </button>

        <button
          onClick={() => toggleSetting('showPomodoro')}
          title="Toggle Pomodoro Widget"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
            settings.showPomodoro
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 opacity-50'
          }`}
        >
          <span>🎯 Focus</span>
        </button>
      </div>

      <div className="h-4 w-[1px] bg-white/10" />

      {/* Screen Controls: Opacity & Always On Top */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5" title={`Widget Opacity: ${Math.round(settings.opacity * 100)}%`}>
          <SlidersIcon className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="range"
            min="0.35"
            max="1.0"
            step="0.05"
            value={settings.opacity}
            onChange={handleOpacityChange}
            className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <button
          onClick={() => toggleSetting('alwaysOnTop')}
          title={settings.alwaysOnTop ? 'Pin Active (Always On Top of Apps)' : 'Pin to Screen (Always on Top)'}
          className={`p-1.5 rounded-xl text-xs font-semibold transition-all border ${
            settings.alwaysOnTop
              ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400 shadow-lg shadow-indigo-500/20'
              : 'text-slate-400 border-transparent hover:bg-white/5'
          }`}
        >
          <PinIcon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenSyncModal}
          title="GitHub Remote Sync & Backup"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all"
        >
          <GitHubIcon className="w-3.5 h-3.5" />
          <span>Sync</span>
        </button>
      </div>
    </div>
  );
};

