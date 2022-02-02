/**
 * Use 'electron-store' sample code.
 */
import { ipcMain } from 'electron';
import Store from 'electron-store';

const schema = {
  'recent-projects': {
    type: 'string',
    default: JSON.stringify({}),
  },
  'window-options': {
    type: 'object',
    properties: {
      isMaximized: { type: 'boolean', default: false },
      width: { type: 'number', default: 1000 },
      height: { type: 'number', default: 700 },
      x: { type: 'number', nullable: true, default: null },
      y: { type: 'number', nullable: true, default: null },
    },
  },
};

const migrations = {
  '0.0.5': (store) => {
    store.set('window-options', {
      isMaximized: false,
      width: 1000,
      height: 700,
      x: null,
      y: null,
    });
  },
};

const offlineStorage = new Store({ schema, migrations });

/**
 * Expose 'electron-store' to Renderer-process through 'ipcMain.handle'
 */
export function listenStoreEvent() {
  ipcMain.handle('offline-storage', async (_evnet, methodSign, ...args) => {
    if (typeof offlineStorage[methodSign] === 'function') {
      return offlineStorage[methodSign](...args);
    }
    return offlineStorage[methodSign];
  });
}

export default offlineStorage;
