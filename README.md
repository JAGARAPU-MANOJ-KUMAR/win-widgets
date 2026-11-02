# 🪐 OmniDesk — Unified Desktop Widgets & Everything Tracker

> **The floating desktop widget system for your laptop.** Combines the relational organization of **Notion**, the time-blocking schedule of **TickTick**, and the instant capture speed of **Sticky Notes** — directly on your screen without OS limitations.

---

## ⚡ The Problems It Solves

| Traditional App | Limitation | How OmniDesk Solves It |
| :--- | :--- | :--- |
| **Notion** | No floating desktop widgets on laptop; slow to load for quick notes; heavy browser tab. | **Floating translucent desktop widgets** that stay pinned on your screen; instant scratchpad capture in < 1 second. |
| **TickTick** | Paywalled calendar & widgets; rigid notes; no markdown code blocks or checklists. | **100% Free daily timetable** with live auto-advancing time-block progress, interactive markdown checklists. |
| **Sticky Notes** | No timetable; no task management; no priority tags; purely plain text. | **Rich multi-widget system**: Timetable + Work Tracker + Scratchpad + Pomodoro Timer. |

---

## 🌟 Core Features

- 📌 **Screen Floating Widgets**:
  - Keep widgets floating over your desktop wallpaper or on top of active work.
  - **Opacity Slider (35% to 100%)**: Make widgets subtle and non-intrusive while coding or browsing.
  - **Always-on-top Pin**: Keep critical tasks and schedule visible at a glance.
- ⏱️ **Live Timetable & Schedule Tracker**:
  - Visual time blocks for Deep Work, Meetings, Quick Tasks, and Breaks.
  - Auto-calculated real-time progress bar showing the elapsed time for the current active block.
- ✅ **Work & Task Tracker**:
  - Priority pills (`P1 Urgent`, `P2 High`, `P3 Normal`).
  - Progress meter (`5/8 completed - 63%`).
  - Filter by status (`Todo`, `In Progress`, `Done`).
- 📝 **Fast Scratchpad (The Notion Hybrid)**:
  - Interactive checklists (`- [ ]` and `- [x]`) — click directly to check off items.
  - Multi-note tabs for separating Ideas, Meetings, and Quick Jots.
  - 1-click **Copy as Markdown** to paste into Notion or GitHub.
- 🎯 **Focus Pomodoro Timer**:
  - 25m Focus / 5m Break with progress arc and session counter.
- 💾 **Local-First & Git-Synced**:
  - 100% offline functionality with zero loading delay.
  - Export full JSON backups or sync directly to your GitHub repository.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run in Browser / Web Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your widgets.

### 3. Run as Native Desktop App (Frameless Floating Widgets)
```bash
npm run electron:start
```

---

## 🔗 Connecting to Your Remote GitHub Repository

To link this repository to your GitHub account and keep it up to date:

1. **Create an empty repository** on GitHub:
   - Visit [github.com/new](https://github.com/new)
   - Repository name: `win-widgets` (or any name you prefer)
   - Leave *"Add a README file"* **unchecked** (we already have one).
2. **Add Remote & Push**:
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/win-widgets.git
   git branch -M main
   git push -u origin main
   ```
3. **Keep it Updated**:
   Whenever you make updates:
   ```bash
   git add .
   git commit -m "update widgets and data"
   git push
   ```

---

## ⌨️ Shortcuts & Controls
- `Ctrl + Shift + Space`: Summon / Hide widgets anywhere (when running via Electron).
- `Opacity Slider`: Adjust widget translucency so it blends with your desktop background.
- `Pin Button`: Pin widgets to stay on top of other applications.

