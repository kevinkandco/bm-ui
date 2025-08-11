// preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

// Expose a small API to renderer processes
contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  closeSlack: () => ipcRenderer.invoke("close-slack"),
  minimizeMain: () => ipcRenderer.send("minimize-main"),
  closeMain: () => ipcRenderer.send("close-main"),
  toggleBar: (collapsed) => ipcRenderer.send("toggle-bar", !!collapsed),
  sendStatus: (status) => ipcRenderer.send("status-changed", status),
  // allow renderer to react to status updates from main
  onStatusUpdated: (cb) => {
    ipcRenderer.on("status-updated", (event, status) => cb(status));
  },
  openGoogleLogin: () => ipcRenderer.send('open-google-login'),
});


window.addEventListener('message', (event) => {
  if (event.data.type === 'auth-success') {
    ipcRenderer.send('auth-success', event.data.token);
  }
});

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (msg) => ipcRenderer.send('message', msg),
});