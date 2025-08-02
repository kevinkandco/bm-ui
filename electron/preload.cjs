// electron/preload.cjs   (CommonJS)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  closeSlack: () => ipcRenderer.invoke("close-slack"),
});

contextBridge.exposeInMainWorld('focusEnv', {
  token: process.env.FOCUS_ACCESS_TOKEN || '',
  user_id: process.env.USER_ID || '',
});