import React from 'react';
import { Task, ScheduleEvent, ScratchNote } from '../../types';
import { CheckIcon, ClockIcon, NoteIcon, GitHubIcon } from '../common/Icons';

interface DashboardViewProps {
  tasks: Task[];
  events: ScheduleEvent[];
  notes: ScratchNote[];
  onOpenSyncModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  events,
  notes,
  onOpenSyncModal,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <span>🪐</span> OmniDesk Central Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Unified work tracking, timetable scheduling, and fast note capture
          </p>
        </div>

        <button
          onClick={onOpenSyncModal}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
        >
          <GitHubIcon className="w-4 h-4" />
          <span>Sync with GitHub</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-xs text-slate-400 block mb-1">Total Tasks</span>
          <span className="text-2xl font-bold font-mono text-slate-100">{tasks.length}</span>
        </div>
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-xs text-slate-400 block mb-1">Completed</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{completedTasks}</span>
        </div>
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-xs text-slate-400 block mb-1">In Progress</span>
          <span className="text-2xl font-bold font-mono text-indigo-400">{inProgressTasks}</span>
        </div>
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <span className="text-xs text-slate-400 block mb-1">Scheduled Blocks</span>
          <span className="text-2xl font-bold font-mono text-purple-400">{events.length}</span>
        </div>
      </div>

      {/* Two Column Layout: Notion-style Database & Timetable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Table */}
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-emerald-400" />
              <span>Tasks Database</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{completedTasks}/{tasks.length} Done</span>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-mono uppercase font-semibold ${
                      task.status === 'done'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : task.status === 'in-progress'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {task.status}
                  </span>
                  <span className={`text-xs font-medium ${task.status === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-[11px] text-indigo-300 font-mono">#{task.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timetable Schedule */}
        <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-indigo-400" />
              <span>Full Daily Schedule</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{events.length} Blocks</span>
          </div>

          <div className="space-y-2">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-white/5"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-100 block">{ev.title}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {ev.startTime} - {ev.endTime}
                  </span>
                </div>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">
                  {ev.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
