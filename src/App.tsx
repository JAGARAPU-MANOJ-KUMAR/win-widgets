import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navigation } from './components/Navigation';
import { FloatingWidgetsView } from './components/views/FloatingWidgetsView';
import { DashboardView } from './components/views/DashboardView';
import { GitHubSyncModal } from './components/modals/GitHubSyncModal';
import {
  INITIAL_TASKS,
  INITIAL_EVENTS,
  INITIAL_NOTES,
  INITIAL_SETTINGS,
} from './services/mockData';
import { Task, ScheduleEvent, ScratchNote, WidgetSettings } from './types';

export const App: React.FC = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('omnidesk_tasks', INITIAL_TASKS);
  const [events, setEvents] = useLocalStorage<ScheduleEvent[]>('omnidesk_events', INITIAL_EVENTS);
  const [notes, setNotes] = useLocalStorage<ScratchNote[]>('omnidesk_notes', INITIAL_NOTES);
  const [settings, setSettings] = useLocalStorage<WidgetSettings>('omnidesk_settings', INITIAL_SETTINGS);

  const [currentView, setCurrentView] = useState<'widgets' | 'dashboard'>('widgets');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Navigation */}
      <Navigation
        currentView={currentView}
        onChangeView={setCurrentView}
        onOpenSync={() => setIsSyncModalOpen(true)}
      />

      {/* Main View Area */}
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

      {/* GitHub Sync & Backup Modal */}
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

