const { ipcRenderer } = require("electron");

const isElectron = !!process.versions.electron;

window.electronAPI = {
  isElectron: () => isElectron,
  
  onAuthSuccess: (callback) =>
    ipcRenderer.on("auth-success", (event, token) => callback(token)),

  redirectToWebLogin: () => ipcRenderer.send("redirect-to-web-login"),
};
