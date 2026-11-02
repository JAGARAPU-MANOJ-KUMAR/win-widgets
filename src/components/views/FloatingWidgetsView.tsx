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

      {/* Grid of Floating Desktop Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto w-full flex-1">
        {/* Widget 1: Timetable / Schedule */}
        {settings.showTimetable && (
          <WidgetContainer
            title="Today's Timetable"
            badge={`${events.length} blocks`}
            icon={<ClockIcon className="w-4 h-4 text-indigo-400" />}
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
            className="h-[280px] xl:col-span-1"
          >
            <PomodoroWidget />
          </WidgetContainer>
        )}

        {/* Widget 5: Quick Notion Quick-Capture Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 flex flex-col justify-between backdrop-blur-xl h-[280px]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-300">
              <span className="text-base font-bold">⚡ Notion-Style Fast Capture</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never break focus. Use global shortcut <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px] border border-white/10">Ctrl+Shift+Space</kbd> anywhere on your PC to summon or hide these widgets instantly.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Always-On-Top Screen Pin:</span>
              <span className={settings.alwaysOnTop ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {settings.alwaysOnTop ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Local Storage:</span>
              <span className="text-emerald-400 font-bold font-mono">100% Offline Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
