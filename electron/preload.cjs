// electron/preload.cjs   (CommonJS)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  closeSlack: () => ipcRenderer.invoke("close-slack"),
});

contextBridge.exposeInMainWorld('focusEnv', {
  token: process.env.FOCUS_ACCESS_TOKEN || '',
});