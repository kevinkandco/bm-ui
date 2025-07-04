import { app, BrowserWindow, ipcMain } from "electron";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win: BrowserWindow | null = null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  console.log("VITE_DEV_SERVER_URL:", process.env.VITE_DEV_SERVER_URL);
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};

app.whenReady()
  .then(createWindow)
  .catch((err) => {
    console.error("Failed to create Electron window:", err);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('enable-focus-mode', () => {
  console.log("IPC: enable-focus-mode received");

  const platform = process.platform;
  console.log("Platform:", platform);

  if (platform === 'win32') {
    exec('taskkill /IM Slack.exe /F', (err, stdout, stderr) => {
      console.log("Exec stdout:", stdout);
      console.log("Exec stderr:", stderr);
      if (err) console.error("Slack kill error:", err.message);
    });
  } else if (platform === 'darwin') {
    exec(`osascript -e 'quit app "Slack"'`, (err, stdout, stderr) => {
      console.log("Exec stdout:", stdout);
      console.log("Exec stderr:", stderr);
      if (err) console.error("Slack kill error:", err.message);
    });
  } else {
    exec('pkill slack', (err, stdout, stderr) => {
      console.log("Exec stdout:", stdout);
      console.log("Exec stderr:", stderr);
      if (err) console.error("Slack kill error:", err.message);
    });
  }
});
