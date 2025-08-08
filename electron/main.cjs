// main.cjs
const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const killSlack = require("./killSlack.cjs");

let mainWindow = null;
let barWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, "assets", "icon.png"),
  });

  mainWindow.loadURL("http://localhost:8080");

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Optional: open devtools for debugging:
  // mainWindow.webContents.openDevTools();
}

function createBarWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  barWindow = new BrowserWindow({
    x: Math.round(width / 2 - 275), // center for 550px width
    y: 20,
    width: 550,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const htmlPath = path.join(__dirname, "..", "floatingBar.html");
  barWindow.loadFile(htmlPath);

  barWindow.on("closed", () => {
    barWindow = null;
  });

  // Optional: open devtools for debugging:
  // barWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  createBarWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  // on macOS apps usually stay active until Cmd+Q, but adapt as needed
  if (process.platform !== "darwin") app.quit();
});

// IPC handlers
ipcMain.on("minimize-main", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("close-main", () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle("close-slack", async () => {
  const msg = await new Promise((res) => {
    exec(killSlack(), (err, _out, stderr) => {
      res(err ? `Failed: ${stderr || err.message}` : "Slack closed.");
    });
  });
  return msg;
});

// toggle-bar: reposition barWindow (shrink/right vs center/large)
ipcMain.on("toggle-bar", (event, collapsed) => {
  if (!barWindow) return;
  const { width } = screen.getPrimaryDisplay().workAreaSize;

  if (collapsed) {
    barWindow.setBounds({
      x: width - 60,
      y: 20,
      width: 50,
      height: 60,
    });
  } else {
    barWindow.setBounds({
      x: Math.round(width / 2 - 275),
      y: 20,
      width: 550,
      height: 350,
    });
  }
});

// status-changed: log and forward to mainWindow if present
ipcMain.on("status-changed", (event, status) => {
  console.log("Status changed to:", status);
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.send("status-updated", status);
  }
});
