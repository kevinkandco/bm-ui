// electron/main.cjs
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      // ⚠️  MUST point to preload.cjs, not .js
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,   // default is true, keep it
      nodeIntegration: false,  // keep false for safety
    },
  });

  // During development load Vite dev‑server, in prod load your index.html
  win.loadURL('http://localhost:8080');
}

app.whenReady().then(createWindow);

// Handle the “close-slack” IPC
ipcMain.handle('close-slack', async () => {
  try {
    // macOS
    exec('pkill Slack');
    // Windows (comment out the line above and uncomment below if you’re on Windows)
    // exec('taskkill /IM slack.exe /F');
    return 'Slack closed successfully!';
  } catch (e) {
    return 'Could not close Slack (maybe it is not running).';
  }
});
