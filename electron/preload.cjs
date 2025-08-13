// preload.cjs
const { ipcRenderer, contextBridge } = require("electron");

// First API: "electron" (for legacy HTML files like appLogin.html)
contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    const validChannels = ["redirect-to-web-login"];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = [];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});


// Second API: "electronAPI" (for modern React/TSX code)
contextBridge.exposeInMainWorld("electronAPI", {
  isElectron: true,
  setToken: (token) => {
    console.log(1211212121);
    console.log(token, "TOKEN");
    
    return ipcRenderer.invoke("set-token", token); 
  },
  redirectToDashboard: () => {
    ipcRenderer.send("redirect-to-dashboard");
  },

  openExternal: (url) => ipcRenderer.send('open-external', url)
});

contextBridge.exposeInMainWorld("deeplink", {
  onReceived: (callback) => {
    ipcRenderer.on("deeplink-received", (event, url) => {
      callback(url);
    });
  }
});
