import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  enableFocusMode: () => ipcRenderer.send('enable-focus-mode')
});
