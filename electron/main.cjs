const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const killSlack = require('./killSlack.cjs');

function createWindow() {
  const win = new BrowserWindow({
    width: 700,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
     icon: path.join(__dirname, 'assets', 'icon.png'), // see next step
  });

  // win.loadURL('http://localhost:8080');
    const htmlPath = path.join(__dirname, '..', 'main.htm');
  win.loadFile(htmlPath);
}

app.setName("Focus Mode");
app.whenReady().then(createWindow);

ipcMain.handle('close-slack', async (event) => {
  // 1 kill Slack
  const msg = await new Promise((res) => {
    exec(killSlack(), (err, _out, stderr) => {
      res(err ? `Failed: ${stderr || err.message}` : 'Slack closed.');
    });
  });

  // 2 close the window that made the call
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) win.close();

  // Returning a value is optional now because the renderer is about to vanish
  return msg;
});
