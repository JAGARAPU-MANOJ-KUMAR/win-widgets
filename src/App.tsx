import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { StandaloneWidgetFrame } from './components/widgets/StandaloneWidgetFrame';
import { DesktopLauncherBar } from './components/widgets/DesktopLauncherBar';
import { TimetableWidget } from './components/widgets/TimetableWidget';
import { TaskTrackerWidget } from './components/widgets/TaskTrackerWidget';
import { ScratchpadWidget } from './components/widgets/ScratchpadWidget';
import { PomodoroWidget } from './components/widgets/PomodoroWidget';
import { Navigation } from './components/Navigation';
import { FloatingWidgetsView } from './components/views/FloatingWidgetsView';
import { DashboardView } from './components/views/DashboardView';
import { GitHubSyncModal } from './components/modals/GitHubSyncModal';
import { ClockIcon, CheckIcon, NoteIcon } from './components/common/Icons';
import {
  INITIAL_TASKS,
  INITIAL_EVENTS,
  INITIAL_NOTES,
  INITIAL_SETTINGS,
} from './services/mockData';
import { Task, ScheduleEvent, ScratchNote, WidgetSettings } from './types';

// Robust parameter parser supporting search query (?widget=...) and hash (#widget=...)
function getWidgetInfo() {
  const searchParams = new URLSearchParams(window.location.search);
  let widgetType = searchParams.get('widget');
  let widgetId = searchParams.get('id');

  if (!widgetType && window.location.hash) {
    const rawHash = window.location.hash.replace(/^[#?\/]+/, '');
    const hashParams = new URLSearchParams(rawHash);
    widgetType = hashParams.get('widget');
    widgetId = hashParams.get('id');
  }

  return {
    widgetType,
    widgetId: widgetId || (widgetType ? `widget-${widgetType}` : ''),
  };
}

export const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('omnidesk_tasks', INITIAL_TASKS);
  const [events, setEvents] = useLocalStorage<ScheduleEvent[]>('omnidesk_events', INITIAL_EVENTS);
  const [notes, setNotes] = useLocalStorage<ScratchNote[]>('omnidesk_notes', INITIAL_NOTES);
  const [settings, setSettings] = useLocalStorage<WidgetSettings>('omnidesk_settings', INITIAL_SETTINGS);

  const [currentView, setCurrentView] = useState<'widgets' | 'dashboard'>('widgets');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const { widgetType, widgetId } = getWidgetInfo();

  // 1. Standalone Timetable Widget Window
  if (widgetType === 'timetable') {
    return (
      <StandaloneWidgetFrame
        widgetId={widgetId}
        title="Timetable"
        badge={`${events.length} blocks`}
        icon={<ClockIcon className="w-3.5 h-3.5" />}
      >
        <TimetableWidget events={events} onUpdateEvents={setEvents} />
      </StandaloneWidgetFrame>
    );
  }

  // 2. Standalone Task Tracker Widget Window
  if (widgetType === 'tasks') {
    const pendingCount = tasks.filter((t) => t.status !== 'done').length;
    return (
      <StandaloneWidgetFrame
        widgetId={widgetId}
        title="Tasks"
        badge={`${pendingCount} pending`}
        icon={<CheckIcon className="w-3.5 h-3.5" />}
      >
        <TaskTrackerWidget tasks={tasks} onUpdateTasks={setTasks} />
      </StandaloneWidgetFrame>
    );
  }

  // 3. Standalone Scratchpad Widget Window
  if (widgetType === 'scratchpad') {
    return (
      <StandaloneWidgetFrame
        widgetId={widgetId}
        title="Sticky Scratchpad"
        badge={`${notes.length} notes`}
        icon={<NoteIcon className="w-3.5 h-3.5" />}
      >
        <ScratchpadWidget notes={notes} onUpdateNotes={setNotes} />
      </StandaloneWidgetFrame>
    );
  }

  // 4. Standalone Pomodoro Widget Window
  if (widgetType === 'pomodoro') {
    return (
      <StandaloneWidgetFrame
        widgetId={widgetId}
        title="Focus Pomodoro"
        icon={<span>🎯</span>}
      >
        <PomodoroWidget />
      </StandaloneWidgetFrame>
    );
  }

  // 5. Desktop Launcher Bar (floating control pill on bottom/top of screen)
  if (widgetType === 'launcher') {
    return <DesktopLauncherBar />;
  }

  // 6. Default Workspace & Central Hub (when opened directly in browser or full app mode)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 text-slate-100 flex flex-col font-sans select-none">
      <Navigation
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenSync={() => setIsSyncModalOpen(true)}
      />

      <main className="flex-1 overflow-auto">
        {currentView === 'widgets' ? (
          <FloatingWidgetsView
            tasks={tasks}
            events={events}
            notes={notes}
            settings={settings}
            onUpdateTasks={setTasks}
            onUpdateEvents={setEvents}
            onUpdateNotes={setNotes}
            onUpdateSettings={setSettings}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
          />
        ) : (
          <DashboardView
            tasks={tasks}
            events={events}
            notes={notes}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
          />
        )}
      </main>

      <GitHubSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        tasks={tasks}
        events={events}
        notes={notes}
      />
    </div>
  );
};

export default App;
