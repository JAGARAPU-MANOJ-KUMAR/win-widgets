const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, screen } = require('electron');
const path = require('path');
const fs = require('fs');

// Path to store widget positions and active state
const configPath = path.join(app.getPath('userData'), 'widgets-config.json');

// Registry of open BrowserWindow instances by widget ID
const widgetWindows = new Map();
let launcherWindow = null;
let tray = null;
let isQuitting = false;

// Default layout for desktop widgets
const DEFAULT_WIDGETS = [
  { id: 'widget-timetable', type: 'timetable', x: 40, y: 60, width: 340, height: 480, alwaysOnTop: false, opacity: 0.95 },
  { id: 'widget-tasks', type: 'tasks', x: 410, y: 60, width: 340, height: 480, alwaysOnTop: false, opacity: 0.95 },
  { id: 'widget-scratchpad', type: 'scratchpad', x: 780, y: 60, width: 340, height: 480, alwaysOnTop: false, opacity: 0.95 },
  { id: 'widget-pomodoro', type: 'pomodoro', x: 1150, y: 60, width: 280, height: 260, alwaysOnTop: false, opacity: 0.95 },
];

function loadWidgetsConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Failed to load widget config, using defaults:', err);
  }
  return DEFAULT_WIDGETS;
}

function saveWidgetsConfig() {
  try {
    const list = [];
    for (const [id, win] of widgetWindows.entries()) {
      if (!win.isDestroyed()) {
        const bounds = win.getBounds();
        const widgetType = win.__widgetType || 'scratchpad';
        list.push({
          id,
          type: widgetType,
          x: bounds.x,
          y: bounds.y,
          width: bounds.width,
          height: bounds.height,
          alwaysOnTop: win.isAlwaysOnTop(),
          opacity: win.getOpacity(),
        });
      }
    }
    fs.writeFileSync(configPath, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save widget config:', err);
  }
}

function getAppUrl(widgetQuery = '') {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    return `http://localhost:3000${widgetQuery ? '?' + widgetQuery : ''}`;
  }
  const indexPath = path.join(__dirname, '../dist/index.html');
  return `file://${indexPath}${widgetQuery ? '?' + widgetQuery : ''}`;
}

// Create a single floating desktop widget window
function createWidgetWindow(widget) {
  if (widgetWindows.has(widget.id)) {
    const existing = widgetWindows.get(widget.id);
    if (!existing.isDestroyed()) {
      existing.show();
      existing.focus();
      return existing;
    }
  }

  const win = new BrowserWindow({
    x: widget.x,
    y: widget.y,
    width: widget.width || 340,
    height: widget.height || 480,
    minWidth: 240,
    minHeight: 180,
    frame: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: widget.alwaysOnTop || false,
    skipTaskbar: true, // Independent floating widgets don't clutter the taskbar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.__widgetId = widget.id;
  win.__widgetType = widget.type;

  if (widget.opacity) {
    win.setOpacity(Math.max(0.3, Math.min(1.0, widget.opacity)));
  }

  const query = `widget=${widget.type}&id=${widget.id}`;
  const targetUrl = getAppUrl(query);

  if (targetUrl.startsWith('http')) {
    win.loadURL(targetUrl).catch(() => {
      win.loadFile(path.join(__dirname, '../dist/index.html'), { query: { widget: widget.type, id: widget.id } });
    });
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'), { query: { widget: widget.type, id: widget.id } });
  }

  // Save location on move or resize
  win.on('moved', () => saveWidgetsConfig());
  win.on('resized', () => saveWidgetsConfig());

  win.on('closed', () => {
    widgetWindows.delete(widget.id);
    saveWidgetsConfig();
  });

  widgetWindows.set(widget.id, win);
  return win;
}

// Create the sleek Floating Desktop Launcher (the pill to add/remove widgets on screen)
function createLauncherWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  launcherWindow = new BrowserWindow({
    width: 440,
    height: 58,
    x: Math.round((width - 440) / 2),
    y: height - 80, // Docked near bottom of screen
    frame: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const targetUrl = getAppUrl('widget=launcher');
  if (targetUrl.startsWith('http')) {
    launcherWindow.loadURL(targetUrl).catch(() => {
      launcherWindow.loadFile(path.join(__dirname, '../dist/index.html'), { query: { widget: 'launcher' } });
    });
  } else {
    launcherWindow.loadFile(path.join(__dirname, '../dist/index.html'), { query: { widget: 'launcher' } });
  }

  launcherWindow.on('closed', () => {
    launcherWindow = null;
  });
}

function setupTray() {
  try {
    tray = new Tray(path.join(__dirname, 'icon.png'));
  } catch (e) {
    // Graceful fallback if icon is not yet packaged
  }

  const buildMenu = () => {
    return Menu.buildFromTemplate([
      {
        label: 'Add Timetable Widget',
        click: () => spawnNewWidget('timetable'),
      },
      {
        label: 'Add Tasks Widget',
        click: () => spawnNewWidget('tasks'),
      },
      {
        label: 'Add Scratchpad Widget',
        click: () => spawnNewWidget('scratchpad'),
      },
      {
        label: 'Add Pomodoro Widget',
        click: () => spawnNewWidget('pomodoro'),
      },
      { type: 'separator' },
      {
        label: 'Show/Hide All Widgets',
        click: () => toggleAllWidgetsVisibility(),
      },
      {
        label: 'Reset Widgets to Default Layout',
        click: () => resetWidgetsLayout(),
      },
      { type: 'separator' },
      {
        label: 'Quit OmniDesk',
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);
  };

  if (tray) {
    tray.setToolTip('OmniDesk Desktop Widgets');
    tray.setContextMenu(buildMenu());
  }
}

function spawnNewWidget(type) {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const id = `widget-${type}-${Date.now()}`;
  const defaultDims = {
    timetable: { w: 340, h: 480 },
    tasks: { w: 340, h: 480 },
    scratchpad: { w: 340, h: 480 },
    pomodoro: { w: 280, h: 260 },
  }[type] || { w: 340, h: 400 };

  const randomOffset = Math.floor(Math.random() * 80);
  const newWidget = {
    id,
    type,
    x: Math.min(width - defaultDims.w - 20, 100 + randomOffset),
    y: Math.min(height - defaultDims.h - 20, 100 + randomOffset),
    width: defaultDims.w,
    height: defaultDims.h,
    alwaysOnTop: false,
    opacity: 0.95,
  };

  createWidgetWindow(newWidget);
  saveWidgetsConfig();
}

function toggleAllWidgetsVisibility() {
  let anyVisible = false;
  for (const win of widgetWindows.values()) {
    if (!win.isDestroyed() && win.isVisible()) {
      anyVisible = true;
      break;
    }
  }

  for (const win of widgetWindows.values()) {
    if (!win.isDestroyed()) {
      if (anyVisible) win.hide();
      else win.show();
    }
  }
}

function resetWidgetsLayout() {
  for (const win of widgetWindows.values()) {
    if (!win.isDestroyed()) win.close();
  }
  widgetWindows.clear();
  DEFAULT_WIDGETS.forEach((w) => createWidgetWindow(w));
  saveWidgetsConfig();
}

function setupIPC() {
  // Spawn a new desktop widget directly onto screen
  ipcMain.on('widget-spawn', (event, type) => {
    spawnNewWidget(type);
  });

  // Close an individual widget window
  ipcMain.on('widget-close', (event, widgetId) => {
    const win = widgetWindows.get(widgetId);
    if (win && !win.isDestroyed()) {
      win.close();
    }
  });

  // Toggle Always On Top for an individual widget
  ipcMain.on('widget-toggle-pin', (event, { widgetId, alwaysOnTop }) => {
    const win = widgetWindows.get(widgetId);
    if (win && !win.isDestroyed()) {
      win.setAlwaysOnTop(alwaysOnTop);
      saveWidgetsConfig();
    }
  });

  // Adjust Opacity for an individual widget
  ipcMain.on('widget-set-opacity', (event, { widgetId, opacity }) => {
    const win = widgetWindows.get(widgetId);
    if (win && !win.isDestroyed()) {
      win.setOpacity(Math.max(0.3, Math.min(1.0, opacity)));
      saveWidgetsConfig();
    }
  });

  // Toggle launcher / widgets
  ipcMain.on('widget-toggle-all', () => {
    toggleAllWidgetsVisibility();
  });

  // Broadcast data changes to all open widget windows
  ipcMain.on('widget-broadcast-data', (event, { key, data }) => {
    for (const win of widgetWindows.values()) {
      if (!win.isDestroyed()) {
        win.webContents.send('widget-data-synced', { key, data });
      }
    }
    if (launcherWindow && !launcherWindow.isDestroyed()) {
      launcherWindow.webContents.send('widget-data-synced', { key, data });
    }
  });

  ipcMain.on('app-quit', () => {
    isQuitting = true;
    app.quit();
  });
}

app.whenReady().then(() => {
  setupIPC();
  setupTray();

  // Load saved widgets or spawn defaults onto desktop
  const savedWidgets = loadWidgetsConfig();
  savedWidgets.forEach((w) => createWidgetWindow(w));

  // Open the Floating Desktop Launcher bar
  createLauncherWindow();

  // Global hotkey to toggle all screen widgets
  try {
    globalShortcut.register('CommandOrControl+Shift+Space', () => {
      toggleAllWidgetsVisibility();
    });
  } catch (err) {
    console.error('Failed to register global shortcut:', err);
  }

  app.on('activate', () => {
    if (widgetWindows.size === 0) {
      DEFAULT_WIDGETS.forEach((w) => createWidgetWindow(w));
    }
  });
});

app.on('before-quit', () => {
  saveWidgetsConfig();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep alive in tray if widgets are closed
  if (process.platform !== 'darwin' && isQuitting) {
    app.quit();
  }
});
