import React from 'react';
import { WidgetContainer } from '../widgets/WidgetContainer';
import { ScratchpadWidget } from '../widgets/ScratchpadWidget';
import { TimetableWidget } from '../widgets/TimetableWidget';
import { TaskTrackerWidget } from '../widgets/TaskTrackerWidget';
import { PomodoroWidget } from '../widgets/PomodoroWidget';
import { MiniDockWidget } from '../widgets/MiniDockWidget';
import { Task, ScheduleEvent, ScratchNote, WidgetSettings } from '../../types';
import { NoteIcon, ClockIcon, CheckIcon } from '../common/Icons';

interface FloatingWidgetsViewProps {
  tasks: Task[];
  events: ScheduleEvent[];
  notes: ScratchNote[];
  settings: WidgetSettings;
  onUpdateTasks: (tasks: Task[]) => void;
  onUpdateEvents: (events: ScheduleEvent[]) => void;
  onUpdateNotes: (notes: ScratchNote[]) => void;
  onUpdateSettings: (settings: WidgetSettings) => void;
  onOpenSyncModal: () => void;
}

export const FloatingWidgetsView: React.FC<FloatingWidgetsViewProps> = ({
  tasks,
  events,
  notes,
  settings,
  onUpdateTasks,
  onUpdateEvents,
  onUpdateNotes,
  onUpdateSettings,
  onOpenSyncModal,
}) => {
  const pendingTasksCount = tasks.filter((t) => t.status !== 'done').length;

  const popOutWidget = (type: string) => {
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      (window as any).electronAPI.spawnWidget(type);
    } else {
      window.open(`/?widget=${type}&id=widget-${type}-${Date.now()}`, '_blank', 'width=360,height=480');
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen p-6 space-y-6 transition-all duration-300"
      style={{ opacity: settings.opacity }}
    >
      {/* Top Floating Control Dock */}
      <div className="flex items-center justify-center">
        <MiniDockWidget
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onOpenSyncModal={onOpenSyncModal}
        />
      </div>

      {/* Screen Placement Explainer Banner */}
      <div className="max-w-7xl mx-auto w-full p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📱</span>
          <div>
            <h4 className="text-xs font-bold text-indigo-200">
              True Desktop Screen Widgets (Like Mobile Home Screen)
            </h4>
            <p className="text-[11px] text-slate-400">
              Each widget runs as its own floating gadget directly on your laptop screen. Drag them anywhere, pin them, or adjust transparency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => popOutWidget('timetable')}
            className="px-2.5 py-1 text-xs rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 font-medium"
          >
            + Pop out Timetable
          </button>
          <button
            onClick={() => popOutWidget('tasks')}
            className="px-2.5 py-1 text-xs rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-medium"
          >
            + Pop out Tasks
          </button>
          <button
            onClick={() => popOutWidget('scratchpad')}
            className="px-2.5 py-1 text-xs rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 font-medium"
          >
            + Pop out Notes
          </button>
        </div>
      </div>

      {/* Grid of Floating Desktop Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto w-full flex-1">
        {/* Widget 1: Timetable / Schedule */}
        {settings.showTimetable && (
          <WidgetContainer
            title="Today's Timetable"
            badge={`${events.length} blocks`}
            icon={<ClockIcon className="w-4 h-4 text-indigo-400" />}
            headerAction={
              <button
                onClick={() => popOutWidget('timetable')}
                title="Pop out as desktop widget"
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono"
              >
                ↗ Screen
              </button>
            }
            className="h-[460px]"
          >
            <TimetableWidget events={events} onUpdateEvents={onUpdateEvents} />
          </WidgetContainer>
        )}

        {/* Widget 2: Work & Task Tracker */}
        {settings.showTasks && (
          <WidgetContainer
            title="Work Tracker"
            badge={`${pendingTasksCount} pending`}
            icon={<CheckIcon className="w-4 h-4 text-emerald-400" />}
            headerAction={
              <button
                onClick={() => popOutWidget('tasks')}
                title="Pop out as desktop widget"
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono"
              >
                ↗ Screen
              </button>
            }
            className="h-[460px]"
          >
            <TaskTrackerWidget tasks={tasks} onUpdateTasks={onUpdateTasks} />
          </WidgetContainer>
        )}

        {/* Widget 3: Fast Scratchpad & Notes */}
        {settings.showScratchpad && (
          <WidgetContainer
            title="Fast Scratchpad"
            badge={`${notes.length} notes`}
            icon={<NoteIcon className="w-4 h-4 text-amber-400" />}
            headerAction={
              <button
                onClick={() => popOutWidget('scratchpad')}
                title="Pop out as desktop widget"
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono"
              >
                ↗ Screen
              </button>
            }
            className="h-[460px]"
          >
            <ScratchpadWidget notes={notes} onUpdateNotes={onUpdateNotes} />
          </WidgetContainer>
        )}

        {/* Widget 4: Pomodoro Focus Widget */}
        {settings.showPomodoro && (
          <WidgetContainer
            title="Focus & Pomodoro"
            icon={<span className="text-sm">🎯</span>}
            headerAction={
              <button
                onClick={() => popOutWidget('pomodoro')}
                title="Pop out as desktop widget"
                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 font-mono"
              >
                ↗ Screen
              </button>
            }
            className="h-[280px] xl:col-span-1"
          >
            <PomodoroWidget />
          </WidgetContainer>
        )}

        {/* Widget 5: Quick Notion Quick-Capture Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex flex-col justify-between backdrop-blur-xl h-[280px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300">
              <span className="text-base font-bold">⚡ Notion-Style Screen Widgets</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Drag them to corners of your screen, leave them on your wallpaper, or use global shortcut <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px] border border-white/10">Ctrl+Shift+Space</kbd> anywhere on your PC to toggle all widgets on/off.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Multi-Window Gadget Mode:</span>
              <span className="text-emerald-400 font-bold">Enabled</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>State Persistence:</span>
              <span className="text-emerald-400 font-bold font-mono">Real-Time Sync</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
