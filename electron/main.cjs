const { app, BrowserWindow, ipcMain, shell } = require("electron"); // Added shell
const path = require("path");
const { Deeplink } = require('electron-deeplink');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // First load your app's loading screen
  const htmlPath = path.join(__dirname, "..", "loading.html");
  mainWindow.loadFile(htmlPath);

  mainWindow.webContents.openDevTools();

  // Then check auth status
  checkAuthStatus();

  const protocol = isDev ? 'briefme' : 'prod-app';
  const deeplink = new Deeplink({ app, mainWindow, protocol, isDev });


  deeplink.on("received", (link) => {
    console.log(link, "token");
    
    // do stuff here
  });
  
}


function checkAuthStatus() {
  if (hasValidToken()) {
    mainWindow.loadURL("http://localhost:8080/app-login?appLogin=true");
  } else {
    const htmlPath = path.join(__dirname, "..", "appLogin.html");
    mainWindow.loadFile(htmlPath);
  }
}

function hasValidToken(isValid = false) {
  return isValid;
}


ipcMain.on('redirect-to-web-login', () => {
  hasValidToken(true)
  shell.openExternal(`http://localhost:8080/app-login?appLogin=${true}`); 
});
  

ipcMain.on('open-external', (event, url) => {
  shell.openExternal(url);
});

if (!app.isDefaultProtocolClient('briefme')) {
  app.setAsDefaultProtocolClient('briefme');
}

app.whenReady().then(() => {
  createWindow();
});


// macOS deep link handler
app.on("open-url", (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send("deeplink-received", url);
  }
});

// Windows/Linux deep link handler
app.on("second-instance", (event, argv) => {
  const deepLink = argv.find((arg) => arg.startsWith("briefme://"));
  if (deepLink && mainWindow) {
    mainWindow.webContents.send("deeplink-received", deepLink);
  }
});

// For Windows/Linux: prevent multiple app instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, argv) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    const deepLink = argv.find((arg) => arg.startsWith("briefme://"));
    if (deepLink) {
      mainWindow.webContents.send("deeplink-received", deepLink);
    }
  });
}