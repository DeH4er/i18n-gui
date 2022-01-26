/**
 * Use 'electron-store' sample code.
 */
import { ipcMain } from "electron";
import Store from "electron-store";

/**
 * Expose 'electron-store' to Renderer-process through 'ipcMain.handle'
 */
const schema = {
  "recent-projects": {
    type: "string",
    default: JSON.stringify({}),
  },
};

const offlineStorage = new Store({ schema });
ipcMain.handle("offline-storage", async (_evnet, methodSign, ...args) => {
  if (typeof offlineStorage[methodSign] === "function") {
    return offlineStorage[methodSign](...args);
  }
  return offlineStorage[methodSign];
});
