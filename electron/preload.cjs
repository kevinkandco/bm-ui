const { ipcRenderer } = require("electron");

window.electronAPI = {
  onAuthSuccess: (callback) => ipcRenderer.on("auth-success", (event, token) => callback(token)),
};
