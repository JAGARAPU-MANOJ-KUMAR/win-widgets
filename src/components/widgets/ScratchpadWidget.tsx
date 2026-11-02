import React, { useState } from 'react';
import { ScratchNote } from '../../types';
import { NoteIcon, PlusIcon, TrashIcon, CopyIcon } from '../common/Icons';

interface ScratchpadWidgetProps {
  notes: ScratchNote[];
  onUpdateNotes: (notes: ScratchNote[]) => void;
}

export const ScratchpadWidget: React.FC<ScratchpadWidgetProps> = ({ notes, onUpdateNotes }) => {
  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '');
  const [isEditing, setIsEditing] = useState(true);
  const [copied, setCopied] = useState(false);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleTextChange = (text: string) => {
    if (!activeNote) return;
    const updated = notes.map((n) =>
      n.id === activeNote.id
        ? {
            ...n,
            content: text,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        : n
    );
    onUpdateNotes(updated);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!activeNote) return;
    const updated = notes.map((n) =>
      n.id === activeNote.id ? { ...n, title: newTitle } : n
    );
    onUpdateNotes(updated);
  };

  const handleCreateNote = () => {
    const newNote: ScratchNote = {
      id: `n-${Date.now()}`,
      title: 'New Scratchpad',
      content: `- [ ] Quick idea or task\n- [ ] Priority item\n\n> Note captured at ${new Date().toLocaleTimeString()}`,
      color: 'amber',
      isPinned: false,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: ['Quick'],
    };
    onUpdateNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    const filtered = notes.filter((n) => n.id !== id);
    onUpdateNotes(filtered);
    if (activeNoteId === id) {
      setActiveNoteId(filtered[0]?.id || '');
    }
  };

  const handleCopyMarkdown = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(`${activeNote.title}\n\n${activeNote.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Toggle checklist checkbox directly inside text
  const toggleCheckbox = (lineIndex: number) => {
    if (!activeNote) return;
    const lines = activeNote.content.split('\n');
    const targetLine = lines[lineIndex];
    if (targetLine.includes('- [ ]')) {
      lines[lineIndex] = targetLine.replace('- [ ]', '- [x]');
    } else if (targetLine.includes('- [x]')) {
      lines[lineIndex] = targetLine.replace('- [x]', '- [ ]');
    }
    handleTextChange(lines.join('\n'));
  };

  if (!activeNote) return null;

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Note Tabs & Quick Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[280px] scrollbar-none py-1">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                note.id === activeNoteId
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <span>{note.title.slice(0, 14)}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCreateNote}
            title="Create New Note"
            className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all"
          >
            <PlusIcon className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsEditing(!isEditing)}
            title={isEditing ? 'Preview Markdown' : 'Edit Note'}
            className="px-2 py-1 text-xs rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 transition-all"
          >
            {isEditing ? 'Preview' : 'Edit'}
          </button>

          <button
            onClick={handleCopyMarkdown}
            title="Copy as Markdown"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          >
            {copied ? (
              <span className="text-emerald-400 text-[10px] font-bold">✓</span>
            ) : (
              <CopyIcon className="w-3.5 h-3.5" />
            )}
          </button>

          {notes.length > 1 && (
            <button
              onClick={() => handleDeleteNote(activeNote.id)}
              title="Delete Note"
              className="p-1.5 rounded-lg text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Note Title Input */}
      <input
        type="text"
        value={activeNote.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="w-full bg-transparent text-sm font-bold text-slate-100 focus:outline-none placeholder-slate-500 border-b border-transparent focus:border-indigo-500/40 pb-1"
        placeholder="Note Title..."
      />

      {/* Content Area */}
      {isEditing ? (
        <textarea
          value={activeNote.content}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Fast capture: type notes, ideas, or '- [ ] task' for instant checklists..."
          className="w-full flex-1 min-h-[160px] bg-slate-950/40 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 resize-none leading-relaxed border border-white/5"
        />
      ) : (
        <div className="w-full flex-1 min-h-[160px] bg-slate-950/40 rounded-xl p-3 text-xs text-slate-200 overflow-y-auto leading-relaxed border border-white/5 space-y-2">
          {activeNote.content.split('\n').map((line, idx) => {
            if (line.startsWith('# ')) {
              return (
                <h3 key={idx} className="font-bold text-slate-100 text-sm mt-2">
                  {line.replace('# ', '')}
                </h3>
              );
            }
            if (line.startsWith('> ')) {
              return (
                <blockquote
                  key={idx}
                  className="border-l-2 border-amber-400/60 pl-2 text-slate-400 italic text-[11px]"
                >
                  {line.replace('> ', '')}
                </blockquote>
              );
            }
            if (line.includes('- [ ]') || line.includes('- [x]')) {
              const checked = line.includes('- [x]');
              const taskText = line.replace(/- \[[ x]\] /, '');
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheckbox(idx)}
                  className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors py-0.5"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] border transition-all ${
                      checked
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'border-slate-500 hover:border-amber-400'
                    }`}
                  >
                    {checked && '✓'}
                  </span>
                  <span className={checked ? 'line-through text-slate-500' : 'text-slate-200'}>
                    {taskText}
                  </span>
                </div>
              );
            }
            return <p key={idx}>{line}</p>;
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>Updated at {activeNote.updatedAt}</span>
        <span className="font-mono text-[10px] text-amber-400/80">Instant Local Sync</span>
      </div>
    </div>
  );
};

