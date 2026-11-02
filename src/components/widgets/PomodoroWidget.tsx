import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, RotateCcwIcon } from '../common/Icons';

export const PomodoroWidget: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === 'work') {
        setCompletedSessions((c) => c + 1);
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalDuration = mode === 'work' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalDuration - timeLeft) / totalDuration) * 100);

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-3">
      {/* Mode Switcher */}
      <div className="flex items-center gap-1 p-1 bg-slate-950/60 rounded-xl border border-white/5 w-full">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
            mode === 'work'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🎯 Focus (25m)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-all ${
            mode === 'break'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ☕ Break (5m)
        </button>
      </div>

      {/* Circular / Big Digital Display */}
      <div className="relative flex flex-col items-center justify-center py-2">
        <span className="text-4xl font-mono font-extrabold tracking-wider text-slate-100 drop-shadow-md">
          {timeFormatted}
        </span>
        <span className="text-[11px] font-medium text-slate-400 mt-1">
          {mode === 'work' ? 'Deep Work Session' : 'Rest & Refresh'}
        </span>

        {/* Mini progress line */}
        <div className="w-48 bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              mode === 'work' ? 'bg-rose-500' : 'bg-emerald-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Controls & Session Dots */}
      <div className="flex items-center justify-between w-full pt-1 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400">Sessions:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={`w-2 h-2 rounded-full ${
                  dot <= completedSessions ? 'bg-indigo-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetTimer}
            title="Reset"
            className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
          >
            <RotateCcwIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleTimer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <PauseIcon className="w-3 h-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-3 h-3" />
                <span>Start</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

