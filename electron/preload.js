const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize: () => ipcRenderer.send('window-minimize'),
  togglePin: (alwaysOnTop) => ipcRenderer.send('window-toggle-pin', alwaysOnTop),
  setOpacity: (opacity) => ipcRenderer.send('window-set-opacity', opacity),
  close: () => ipcRenderer.send('window-close'),
  quit: () => ipcRenderer.send('window-quit'),
  isElectron: true,
});
