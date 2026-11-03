# 🪐 OmniDesk — True Floating Desktop Widgets for Your Laptop

> **True independent desktop widgets placed directly on your screen (just like phone home screen widgets).** No giant app window required — stick individual widgets anywhere on your desktop wallpaper or keep them pinned above your work to track tasks, timetable, and fast notes.

---

## 📱 How the Desktop Widgets Work

Unlike traditional apps that keep everything trapped inside a single browser or application window, **OmniDesk runs each widget as an independent, frameless desktop gadget**:

1. **Independent Floating Windows**:
   - ⏱️ **Timetable Widget**: Place your day's time blocks and live progress needle anywhere on your screen.
   - ✅ **Tasks Tracker Widget**: A floating checklist with Notion-style priority badges (`P1`, `P2`, `P3`) and progress meters.
   - 📝 **Sticky Scratchpad Widget**: Instant note capture with interactive markdown checklists (`- [ ]`) and 1-click **Copy to Notion/Markdown**.
   - 🎯 **Focus Pomodoro Widget**: A tiny floating timer pill for 25m Focus / 5m Break sessions.
   - 🪐 **Widget Launcher Bar**: A sleek floating pill docked at the bottom/top of your screen with buttons to spawn new widgets or toggle all widgets in 1 click.

2. **Drag & Position Anywhere**:
   - Drag any widget by its top bar to place it anywhere across single or multi-monitor setups.
   - **Auto-Saved Coordinates**: Screen positions (`x`, `y`) and dimensions are automatically saved to disk so your widgets remain in the exact spot you left them when you turn on your laptop.

3. **Pin & Opacity Control (Per-Widget)**:
   - **📌 Pin Button**: Toggle whether a widget stays on top of your full-screen code/apps or sits calmly on your desktop background.
   - **🎛️ Opacity Slider (35% to 100%)**: Make widgets subtle and translucent so they never block your view while coding, reading, or working.
   - **✕ Close Button**: Close any individual widget at any time.

4. **⚡ Global Hotkey**:
   - Press <kbd>Ctrl + Shift + Space</kbd> anywhere on your laptop to instantly hide or reveal all widgets at once.

---

## 🚀 How to Run Your Desktop Widgets

### 1. Launch Native Desktop Gadget Mode (Multi-Window Screen Widgets)
```powershell
npm run electron:start
```
This spawns:
- Your floating desktop widgets directly on your laptop screen.
- The sleek **Widget Launcher Bar** to spawn additional widgets.
- System tray integration with quick-access controls.

### 2. Launch Web Mode (In Browser)
```powershell
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to preview or pop out individual widgets into floating mini-windows.

---

## 🔗 GitHub Remote Repository
* **Repository**: [https://github.com/JAGARAPU-MANOJ-KUMAR/win-widgets](https://github.com/JAGARAPU-MANOJ-KUMAR/win-widgets)
* **Branch**: `main`
* **Syncing Updates**:
  ```powershell
  git add .
  git commit -m "update widgets"
  git push origin main
  ```
