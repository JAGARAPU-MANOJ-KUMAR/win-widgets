import React, { useState, useEffect } from 'react';
import { ScheduleEvent, EventCategory } from '../../types';
import { calculateEventProgress, getCurrentTimeMinutes, formatMinutesToTime } from '../../utils/timeUtils';
import { PlusIcon, ClockIcon, TrashIcon } from '../common/Icons';

interface TimetableWidgetProps {
  events: ScheduleEvent[];
  onUpdateEvents: (events: ScheduleEvent[]) => void;
}

export const TimetableWidget: React.FC<TimetableWidgetProps> = ({ events, onUpdateEvents }) => {
  const [currentTimeMinutes, setCurrentTimeMinutes] = useState(getCurrentTimeMinutes());
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('14:00');
  const [newEnd, setNewEnd] = useState('15:00');
  const [newCategory, setNewCategory] = useState<EventCategory>('deep-work');

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeMinutes(getCurrentTimeMinutes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleEvent = (id: string) => {
    const updated = events.map((ev) =>
      ev.id === id ? { ...ev, completed: !ev.completed } : ev
    );
    onUpdateEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    onUpdateEvents(events.filter((ev) => ev.id !== id));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEv: ScheduleEvent = {
      id: `ev-${Date.now()}`,
      title: newTitle.trim(),
      startTime: newStart,
      endTime: newEnd,
      category: newCategory,
      completed: false,
    };

    // Keep events sorted by start time
    const updated = [...events, newEv].sort((a, b) => a.startTime.localeCompare(b.startTime));
    onUpdateEvents(updated);
    setNewTitle('');
    setShowAddForm(false);
  };

  const getCategoryStyles = (category: EventCategory) => {
    switch (category) {
      case 'deep-work':
        return 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300';
      case 'meeting':
        return 'border-purple-500/40 bg-purple-500/10 text-purple-300';
      case 'quick-task':
        return 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
      case 'break':
        return 'border-amber-500/40 bg-amber-500/10 text-amber-300';
      default:
        return 'border-slate-500/40 bg-slate-500/10 text-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Timetable Header / Time Summary */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono font-bold text-slate-200">
            {formatMinutesToTime(currentTimeMinutes)} Today
          </span>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Add Block</span>
        </button>
      </div>

      {/* Quick Add Block Form */}
      {showAddForm && (
        <form onSubmit={handleAddEvent} className="p-3 bg-slate-950/60 rounded-xl border border-indigo-500/30 space-y-2">
          <input
            type="text"
            placeholder="Event or Focus Block title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-400"
            autoFocus
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Start</label>
              <input
                type="time"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">End</label>
              <input
                type="time"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Type</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-1.5 py-1 text-slate-200"
              >
                <option value="deep-work">Deep Work</option>
                <option value="meeting">Meeting</option>
                <option value="quick-task">Quick Task</option>
                <option value="break">Break</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs px-2.5 py-1 rounded text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-xs px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 font-medium text-white transition-colors"
            >
              Save Block
            </button>
          </div>
        </form>
      )}

      {/* Events List */}
      <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin">
        {events.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No scheduled time blocks for today.</p>
        ) : (
          events.map((event) => {
            const { progress, isActive, isPast } = calculateEventProgress(event.startTime, event.endTime);

            return (
              <div
                key={event.id}
                className={`relative rounded-xl border p-2.5 transition-all overflow-hidden ${
                  isActive
                    ? 'border-indigo-400/80 bg-indigo-950/40 shadow-lg shadow-indigo-500/10'
                    : event.completed || isPast
                    ? 'border-white/5 bg-slate-950/30 opacity-60'
                    : 'border-white/10 bg-slate-950/50'
                }`}
              >
                {/* Active Live Progress Bar */}
                {isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-indigo-500/20 transition-all pointer-events-none"
                    style={{ width: `${progress}%` }}
                  />
                )}

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleEvent(event.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-all border ${
                        event.completed
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'border-slate-500 hover:border-indigo-400'
                      }`}
                    >
                      {event.completed && '✓'}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold truncate ${
                            event.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {event.title}
                        </span>
                        {isActive && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                        {isActive && (
                          <span className="text-indigo-300 font-bold">
                            {progress}% completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold ${getCategoryStyles(
                        event.category
                      )}`}
                    >
                      {event.category.replace('-', ' ')}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

