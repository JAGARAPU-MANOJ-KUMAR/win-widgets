import React, { useState } from 'react';
import { PinIcon, SlidersIcon } from '../common/Icons';

interface StandaloneWidgetFrameProps {
  widgetId: string;
  title: string;
  badge?: string | number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const StandaloneWidgetFrame: React.FC<StandaloneWidgetFrameProps> = ({
  widgetId,
  title,
  badge,
  icon,
  children,
  headerAction,
}) => {
  const [isPinned, setIsPinned] = useState(false);
  const [opacity, setOpacity] = useState(0.95);
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);

  const handleTogglePin = () => {
    const nextPin = !isPinned;
    setIsPinned(nextPin);
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.togglePin(widgetId, nextPin);
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = parseFloat(e.target.value);
    setOpacity(nextVal);
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.setOpacity(widgetId, nextVal);
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.closeWidget(widgetId);
    } else {
      window.close();
    }
  };

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden p-1.5 select-none"
      style={{ opacity }}
    >
      <div className="w-full h-full flex flex-col rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Native Draggable Title Bar */}
        <div
          className="flex items-center justify-between px-3.5 py-2.5 bg-white/[0.04] border-b border-white/5 cursor-move"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          {/* Left Title & Icon */}
          <div className="flex items-center gap-2">
            <div className="text-indigo-400 opacity-90">{icon}</div>
            <span className="text-xs font-bold text-slate-100 tracking-wide flex items-center gap-1.5">
              {title}
              {badge !== undefined && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {badge}
                </span>
              )}
            </span>
          </div>

          {/* Right Action Buttons (no-drag so clicks register immediately) */}
          <div
            className="flex items-center gap-1"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            {headerAction}

            {/* Opacity Control Popover */}
            <div className="relative">
              <button
                onClick={() => setShowOpacitySlider(!showOpacitySlider)}
                title="Adjust Widget Opacity"
                className={`p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all ${
                  showOpacitySlider ? 'bg-white/10 text-white' : ''
                }`}
              >
                <SlidersIcon className="w-3 h-3" />
              </button>

              {showOpacitySlider && (
                <div className="absolute right-0 top-7 z-50 p-2 rounded-xl bg-slate-950 border border-white/10 shadow-xl flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {Math.round(opacity * 100)}%
                  </span>
                  <input
                    type="range"
                    min="0.35"
                    max="1.0"
                    step="0.05"
                    value={opacity}
                    onChange={handleOpacityChange}
                    className="w-16 h-1 bg-slate-700 rounded appearance-none accent-indigo-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Pin / Always On Top */}
            <button
              onClick={handleTogglePin}
              title={isPinned ? 'Unpin from Top' : 'Pin Always On Top'}
              className={`p-1 rounded-lg transition-all ${
                isPinned
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <PinIcon className="w-3 h-3" />
            </button>

            {/* Close Widget */}
            <button
              onClick={handleClose}
              title="Close Widget"
              className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs font-mono"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Widget Content Area */}
        <div className="flex-1 overflow-auto p-3.5 bg-slate-950/40">
          {children}
        </div>
      </div>
    </div>
  );
};

