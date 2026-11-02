import React, { useState } from 'react';
import { PinIcon, MoveIcon } from '../common/Icons';

interface WidgetContainerProps {
  title: string;
  badge?: string | number;
  icon?: React.ReactNode;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  isPinned?: boolean;
  onTogglePin?: () => void;
  className?: string;
  defaultCollapsed?: boolean;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  title,
  badge,
  icon,
  children,
  headerAction,
  isPinned,
  onTogglePin,
  className = '',
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div
      className={`rounded-2xl transition-all duration-300 shadow-2xl backdrop-blur-xl border border-white/10 overflow-hidden flex flex-col bg-slate-900/80 ${className}`}
      style={{
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Widget Header / Drag Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/[0.04] border-b border-white/5 select-none cursor-move group">
        <div className="flex items-center gap-2.5">
          <div className="text-slate-400 group-hover:text-indigo-400 transition-colors">
            {icon || <MoveIcon className="w-3.5 h-3.5 opacity-60" />}
          </div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            {title}
            {badge !== undefined && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {badge}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 cursor-default">
          {headerAction}

          {onTogglePin && (
            <button
              onClick={onTogglePin}
              title={isPinned ? 'Unpin Widget' : 'Pin Widget to Desktop'}
              className={`p-1.5 rounded-lg transition-all ${
                isPinned
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <PinIcon className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Widget' : 'Collapse Widget'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all text-xs font-mono"
          >
            {isCollapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>

      {/* Widget Body */}
      {!isCollapsed && <div className="p-4 flex-1 overflow-auto">{children}</div>}
    </div>
  );
};
