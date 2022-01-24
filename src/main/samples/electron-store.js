/**
 * Use 'electron-store' sample code.
 */
import { ipcMain } from "electron";
import Store from "electron-store";

/**
 * Expose 'electron-store' to Renderer-process through 'ipcMain.handle'
 */
const store = new Store();
ipcMain.handle("electron-store", async (_evnet, methodSign, ...args) => {
  if (typeof store[methodSign] === "function") {
    return store[methodSign](...args);
  }
  return store[methodSign];
});
