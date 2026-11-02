import { Task, ScheduleEvent, ScratchNote, WidgetSettings } from '../types';

export const INITIAL_SETTINGS: WidgetSettings = {
  showScratchpad: true,
  showTimetable: true,
  showTasks: true,
  showPomodoro: true,
  opacity: 0.95,
  alwaysOnTop: false,
  dockPosition: 'free',
  theme: 'glass',
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Design Widget Desktop Canvas',
    description: 'Implement translucent frameless container with drag handles',
    status: 'done',
    priority: 'p1',
    tag: 'Core UI',
    dueDate: 'Today',
    estimatedMinutes: 45,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-2',
    title: 'Live Timetable current-hour tracking',
    description: 'Add auto-advancing time-indicator needle and visual progress',
    status: 'in-progress',
    priority: 'p1',
    tag: 'Timetable',
    dueDate: 'Today',
    estimatedMinutes: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Fast Markdown Scratchpad',
    description: 'Instant checklist rendering & export as Notion page',
    status: 'todo',
    priority: 'p2',
    tag: 'Notes',
    dueDate: 'Tomorrow',
    estimatedMinutes: 60,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'GitHub remote sync & backup',
    description: 'Configure auto-push backup of all widgets & tasks to GitHub',
    status: 'todo',
    priority: 'p3',
    tag: 'Sync',
    dueDate: 'This Week',
    estimatedMinutes: 20,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_EVENTS: ScheduleEvent[] = [
  {
    id: 'e-1',
    title: 'Morning Plan & Scratchpad Review',
    startTime: '09:00',
    endTime: '09:30',
    category: 'quick-task',
    notes: 'Prioritize top 3 focus blocks for today',
    completed: true,
  },
  {
    id: 'e-2',
    title: 'Deep Work: Desktop Widget Engine',
    startTime: '09:30',
    endTime: '12:00',
    category: 'deep-work',
    notes: 'Build modular widget containers and state management',
    completed: true,
  },
  {
    id: 'e-3',
    title: 'Lunch & Screen Break',
    startTime: '12:00',
    endTime: '13:00',
    category: 'break',
    notes: 'Walk outside, step away from screens',
    completed: false,
  },
  {
    id: 'e-4',
    title: 'Sprint Sync & Review',
    startTime: '13:30',
    endTime: '14:15',
    category: 'meeting',
    notes: 'Demo floating widgets and timetable features',
    completed: false,
  },
  {
    id: 'e-5',
    title: 'Focus: Quick Capture & Note-taking',
    startTime: '14:30',
    endTime: '16:30',
    category: 'deep-work',
    notes: 'Polish keyboard shortcuts and markdown rendering',
    completed: false,
  },
  {
    id: 'e-6',
    title: 'Daily Log Wrap-up & Tomorrow Setup',
    startTime: '17:00',
    endTime: '17:30',
    category: 'personal',
    notes: 'Log achievements and commit changes',
    completed: false,
  },
];

export const INITIAL_NOTES: ScratchNote[] = [
  {
    id: 'n-1',
    title: '💡 Idea Hub & Quick Jots',
    content: `# Ideas for Next Features
- [x] Floating desktop widgets like phone
- [x] Current-time timetable tracker
- [ ] Direct export to Notion database
- [ ] Global shortcut (Ctrl+Shift+Space) to summon/hide
- [ ] Sound alert when Pomodoro finishes

# Key Rules:
> "Capture thoughts in < 2 seconds so you never break deep flow."`,
    color: 'amber',
    isPinned: true,
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tags: ['Ideas', 'Notion', 'Workflow'],
  },
  {
    id: 'n-2',
    title: '📋 Meeting Minutes & Action Items',
    content: `- Check widget opacity settings (best at 90-95%)
- Setup Git remote sync on GitHub
- Test performance when 4 widgets run simultaneously`,
    color: 'sky',
    isPinned: false,
    updatedAt: '11:20 AM',
    tags: ['Meeting', 'Tasks'],
  },
];
