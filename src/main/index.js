import os from 'os';
import { join } from 'path';

import { app, BrowserWindow, ipcMain } from 'electron';
import './offline-storage';

const isWin7 = os.release().startsWith('6.1');
if (isWin7) app.disableHardwareAcceleration();

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win = null;

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window a',
    width: 1000,
    titleBarStyle: 'hidden',
    height: 700,
    webPreferences: {
      preload: join(__dirname, '../preload/index.cjs'),
    },
    autoHideMenuBar: true,
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, '../renderer/index.html'));
  } else {
    const pkg = await import('../../package.json');
    const url = `http://${pkg.env.HOST || '127.0.0.1'}:${pkg.env.PORT}`;

    win.loadURL(url);
    win.webContents.openDevTools();
  }

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });
}

async function loadDevtools() {
  if (!app.isPackaged) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
    } = await import('electron-devtools-installer');
    installExtension([REDUX_DEVTOOLS.id, REACT_DEVELOPER_TOOLS.id])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
}

app.whenReady().then(createWindow).then(loadDevtools);

app.on('window-all-closed', () => {
  win = null;
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('second-instance', () => {
  if (win) {
    // Someone tried to run a second instance, we should focus our window.
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

ipcMain.on('close', () => {
  win.close();
});

ipcMain.on('minimize', () => {
  win.minimize();
});
