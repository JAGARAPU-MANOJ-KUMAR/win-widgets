import React, { useState } from 'react';
import { GitHubIcon } from '../common/Icons';
import { Task, ScheduleEvent, ScratchNote } from '../../types';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  events: ScheduleEvent[];
  notes: ScratchNote[];
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({
  isOpen,
  onClose,
  tasks,
  events,
  notes,
}) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const exportBackupJSON = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks,
      events,
      notes,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omnidesk-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Backup JSON downloaded successfully!');
  };

  const copyGitCommand = () => {
    const cleanUrl = repoUrl.trim() || 'https://github.com/<YOUR_USERNAME>/win-widgets.git';
    const cmd = `git remote add origin ${cleanUrl}\ngit add .\ngit commit -m "feat: initial OmniDesk widgets system"\ngit push -u origin main`;
    navigator.clipboard.writeText(cmd);
    setStatusMessage('Git commands copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <GitHubIcon className="w-6 h-6 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">GitHub Remote Repository Sync</h3>
              <p className="text-xs text-slate-400">Track and store all your widgets, notes & tasks remotely</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-mono p-1 rounded-lg hover:bg-white/5"
          >
            ✕
          </button>
        </div>

        {/* Step-by-step Connection Guide */}
        <div className="space-y-3">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
            <span className="text-xs font-semibold text-indigo-300 block">
              Step 1: Create an empty repository on GitHub
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-indigo-400 underline font-semibold">github.com/new</a> and create a repository named <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">win-widgets</code> (leave README unchecked).
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Step 2: Enter your GitHub Repository URL
            </label>
            <input
              type="text"
              placeholder="e.g. https://github.com/username/win-widgets.git"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-400 font-mono"
            />
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Git Terminal Push Commands</span>
              <button
                onClick={copyGitCommand}
                className="text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 font-medium"
              >
                Copy Commands
              </button>
            </div>
            <pre className="text-[11px] font-mono text-emerald-300/90 bg-slate-900/80 p-2 rounded-lg overflow-x-auto">
              git remote add origin {repoUrl.trim() || 'https://github.com/<YOUR_USER>/win-widgets.git'}
              {'\n'}git add .
              {'\n'}git commit -m "feat: initial OmniDesk widgets"
              {'\n'}git push -u origin main
            </pre>
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center">
            {statusMessage}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={exportBackupJSON}
            className="text-xs px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all font-medium"
          >
            📦 Download Local Backup JSON
          </button>

          <button
            onClick={onClose}
            className="text-xs px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

