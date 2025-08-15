const { app, BrowserWindow, ipcMain, shell, screen } = require("electron");
const { default: Store } = require("electron-store");
const path = require("path");

let store = new Store();
let mainWindow;

// IPC handler for token
ipcMain.handle("get-token", () => store.get("token"));

// ====== MAIN WINDOW ======
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: true, // allow require in renderer
      contextIsolation: false, // disable isolation
    },
  });
  mainWindow.loadFile(path.join(__dirname, "..", "appLogin.html"));
}

// ====== MINI BAR WINDOW ======
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

    store.set("token", token)
    console.log("✅ Received token => :", token);

    if (mainWindow) {
      mainWindow.webContents.send("auth-success", token);
      // mainWindow.loadURL(`https://hey.brief-me.app?token=${token}`);

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
  createBarWindow();
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

// macOS deep link handling
app.on("open-url", (event, url) => {
  event.preventDefault();
  console.log("🔗 macOS deep link:", url);
  handleDeepLink([url]); 
});

ipcMain.handle("delete-token", () => {
  store.delete("token");
  console.log("🗑 Token deleted");
});

ipcMain.on("redirect-to-web-login", () => {

   //   for local
   shell.openExternal(`http://localhost:8080/app-login?appLogin=${true}`);

   //   for live
  // shell.openExternal(`https://hey.brief-me.app/app-login?appLogin=${true}`);
});

module.exports = { createWindow };
