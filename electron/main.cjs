const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: true, // allow require in renderer
      contextIsolation: false, // disable isolation
    },
  });
  mainWindow.loadFile(path.join(__dirname, "..", "appLogin.html"));
}

if (!app.isDefaultProtocolClient("electron-fiddle")) {
  app.setAsDefaultProtocolClient("electron-fiddle");
}

// Deep link handler
function handleDeepLink(argv) {
  const deepLink = argv.find((arg) => arg.startsWith("electron-fiddle://"));
  if (!deepLink) return;

  try {
    const urlObj = new URL(deepLink);
    const token = urlObj.searchParams.get("access_token");
    console.log("✅ Received token:", token);

    if (mainWindow) {
      mainWindow.webContents.send("auth-success", token);
      mainWindow.loadURL(`http://localhost:8080?token=${token}`);
    }
  } catch (err) {
    console.error("❌ Invalid deep link:", err);
  }
}

// Prevent multiple instances (needed for second-instance to work)
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// First instance — app startup
app.whenReady().then(() => {
  createWindow();
  console.log("🚀 Startup args:", process.argv);
  handleDeepLink(process.argv);
});

// Second instance — app already running
app.on("second-instance", (event, argv) => {
  console.log("🔄 Second instance args:", argv);
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
  handleDeepLink(argv);
});

ipcMain.on("redirect-to-web-login", () => {

   //   for local
  shell.openExternal(`http://localhost:8080/app-login?appLogin=${true}`);

   //   for live
//   shell.openExternal(`https://hey.brief-me.app/app-login?appLogin=${true}`);
});

module.exports = { createWindow };
