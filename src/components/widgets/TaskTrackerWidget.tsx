import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '../../types';
import { PlusIcon, CheckIcon, TrashIcon } from '../common/Icons';

interface TaskTrackerWidgetProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export const TaskTrackerWidget: React.FC<TaskTrackerWidgetProps> = ({ tasks, onUpdateTasks }) => {
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('p2');
  const [tag, setTag] = useState('Work');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const handleToggleStatus = (task: Task) => {
    const nextStatus: TaskStatus =
      task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'done';

    const updated = tasks.map((t) =>
      t.id === task.id
        ? {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined,
          }
        : t
    );
    onUpdateTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    onUpdateTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      status: 'todo',
      priority,
      tag: tag.trim() || 'General',
      estimatedMinutes,
      createdAt: new Date().toISOString(),
    };

    onUpdateTasks([newTask, ...tasks]);
    setTitle('');
    setShowAddForm(false);
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'p1':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">P1 Urgent</span>;
      case 'p2':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">P2 High</span>;
      case 'p3':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-300 font-medium border border-slate-500/30">P3 Normal</span>;
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Progress Metric & Quick Add */}
      <div className="space-y-1.5 pb-2 border-b border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-200">
            Work Progress: <span className="text-indigo-400 font-mono">{completedCount}/{tasks.length}</span> ({progressPercent}%)
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1 text-[11px] font-medium">
        {(['all', 'todo', 'in-progress', 'done'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-2 py-0.5 rounded-lg capitalize transition-all ${
              filter === tab
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Add Task Quick Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-3 bg-slate-950/70 rounded-xl border border-indigo-500/30 space-y-2">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-400"
            autoFocus
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-1.5 py-1 text-slate-200"
              >
                <option value="p1">P1 Urgent</option>
                <option value="p2">P2 High</option>
                <option value="p3">P3 Normal</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Tag</label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Est. (mins)</label>
              <input
                type="number"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full text-xs bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-slate-200"
              />
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
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-1.5 overflow-y-auto max-h-[280px] pr-1 scrollbar-thin">
        {filteredTasks.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No tasks in this view.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                task.status === 'done'
                  ? 'border-white/5 bg-slate-950/30 opacity-60'
                  : task.status === 'in-progress'
                  ? 'border-indigo-500/30 bg-indigo-950/20'
                  : 'border-white/10 bg-slate-950/50 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <button
                  onClick={() => handleToggleStatus(task)}
                  title={`Status: ${task.status} (click to advance)`}
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-all border ${
                    task.status === 'done'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : task.status === 'in-progress'
                      ? 'bg-indigo-500/30 border-indigo-400 text-indigo-300'
                      : 'border-slate-500 hover:border-indigo-400'
                  }`}
                >
                  {task.status === 'done' && '✓'}
                  {task.status === 'in-progress' && '•'}
                </button>

                <div className="min-w-0 flex-1">
                  <span
                    className={`text-xs font-medium block truncate ${
                      task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-200'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span className="text-indigo-300/80 font-mono">#{task.tag}</span>
                    {task.estimatedMinutes && <span>⏱ {task.estimatedMinutes}m</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-2">
                {getPriorityBadge(task.priority)}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

