export type Priority = 'p1' | 'p2' | 'p3';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tag: string;
  dueDate?: string;
  estimatedMinutes?: number;
  completedAt?: string;
  createdAt: string;
}

export type EventCategory = 'deep-work' | 'meeting' | 'quick-task' | 'break' | 'personal';

export interface ScheduleEvent {
  id: string;
  title: string;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  category: EventCategory;
  notes?: string;
  completed?: boolean;
}

export type NoteColor = 'amber' | 'rose' | 'violet' | 'emerald' | 'sky' | 'slate';

export interface ScratchNote {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  updatedAt: string;
  tags: string[];
}

export interface WidgetSettings {
  showScratchpad: boolean;
  showTimetable: boolean;
  showTasks: boolean;
  showPomodoro: boolean;
  opacity: number;       // 0.4 to 1.0
  alwaysOnTop: boolean;
  dockPosition: 'left' | 'right' | 'free';
  theme: 'dark' | 'glass' | 'cyber';
}

