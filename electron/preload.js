const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  spawnWidget: (type) => ipcRenderer.send('widget-spawn', type),
  closeWidget: (widgetId) => ipcRenderer.send('widget-close', widgetId),
  togglePin: (widgetId, alwaysOnTop) => ipcRenderer.send('widget-toggle-pin', { widgetId, alwaysOnTop }),
  setOpacity: (widgetId, opacity) => ipcRenderer.send('widget-set-opacity', { widgetId, opacity }),
  toggleAll: () => ipcRenderer.send('widget-toggle-all'),
  broadcastData: (key, data) => ipcRenderer.send('widget-broadcast-data', { key, data }),
  onDataSynced: (callback) => {
    const handler = (event, payload) => callback(payload);
    ipcRenderer.on('widget-data-synced', handler);
    return () => ipcRenderer.removeListener('widget-data-synced', handler);
  },
  quit: () => ipcRenderer.send('app-quit'),
});
