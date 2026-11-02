const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, screen } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1360, width - 40),
    height: Math.min(840, height - 40),
    x: 20,
    y: 20,
    frame: false,
    transparent: true,
    hasShadow: true,
    alwaysOnTop: false,
    skipTaskbar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    // In dev, load Vite dev server URL if active, otherwise load dist
    mainWindow.loadURL('http://localhost:3000').catch(() => {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle minimize to tray
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      return false;
    }
  });

  setupIPC();
}

function setupTray() {
  // Simple tray setup (gracefully handles absence of custom icon)
  try {
    tray = new Tray(path.join(__dirname, 'icon.png'));
  } catch (e) {
    // If icon is missing, tray creation will be skipped or handled gracefully
  }

  if (tray) {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show Widgets',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        },
      },
      {
        label: 'Always On Top',
        type: 'checkbox',
        checked: false,
        click: (item) => {
          if (mainWindow) {
            mainWindow.setAlwaysOnTop(item.checked);
          }
        },
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

    tray.setToolTip('OmniDesk - Desktop Widgets');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    });
  }
}

function setupIPC() {
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.on('window-toggle-pin', (event, alwaysOnTop) => {
    if (mainWindow) {
      mainWindow.setAlwaysOnTop(alwaysOnTop);
    }
  });

  ipcMain.on('window-set-opacity', (event, opacity) => {
    if (mainWindow) {
      mainWindow.setOpacity(Math.max(0.2, Math.min(1.0, opacity)));
    }
  });

  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.hide();
  });

  ipcMain.on('window-quit', () => {
    isQuitting = true;
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();
  setupTray();

  // Register Global Hotkey to quickly summon / toggle widgets
  try {
    globalShortcut.register('CommandOrControl+Shift+Space', () => {
      if (!mainWindow) return;
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  } catch (err) {
    console.error('Failed to register global shortcut:', err);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
