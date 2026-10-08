const path = require('path');
const { app, BrowserWindow } = require('electron');
const next = require('next');
const http = require('http');

const isDev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const appDir = path.join(__dirname, '.');
let server;
let mainWindow;

async function startNextServer() {
  const nextApp = next({ dev: isDev, dir: appDir });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  return new Promise((resolve, reject) => {
    server = http.createServer((req, res) => {
      handle(req, res);
    });

    server.listen(port, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 850,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(`http://localhost:${port}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startNextServer();
    createWindow();
  } catch (error) {
    console.error('Failed to start Next server:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
