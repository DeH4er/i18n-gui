import { ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

autoUpdater.autoInstallOnAppQuit = false;

function checkForUpdates() {
  autoUpdater.checkForUpdates();
}

export default function registerEvents(win) {
  function sendAutoUpdateEvent(...events) {
    win.webContents.send('update', ...events);
  }

  autoUpdater.on('update-available', (info) => {
    sendAutoUpdateEvent('update-available', JSON.stringify(info));
  });

  autoUpdater.on('checking-for-update', () => {
    sendAutoUpdateEvent('checking-for-update');
  });

  autoUpdater.on('update-not-available', () => {
    sendAutoUpdateEvent('update-not-available');
  });

  autoUpdater.on('error', () => {
    sendAutoUpdateEvent('error');
  });

  autoUpdater.on('download-progress', (progressObj) => {
    sendAutoUpdateEvent('download-progress', JSON.stringify(progressObj));
  });

  autoUpdater.on('update-downloaded', () => {
    sendAutoUpdateEvent('update-downloaded');
  });

  ipcMain.on('check-for-updates', () => {
    if (!autoUpdater.isUpdaterActive()) {
      sendAutoUpdateEvent('update-not-needed');
    } else {
      checkForUpdates();
    }
  });

  ipcMain.on('update-install', () => {
    autoUpdater.quitAndInstall();
  });
}
