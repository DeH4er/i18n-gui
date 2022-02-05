import fs from 'fs';
import path from 'path';

import { contextBridge, ipcRenderer } from 'electron';

import { version } from '../../package.json';

import domReady from './domReady';
import useLoading from './loading';

const { appendLoading, removeLoading } = useLoading();

(async () => {
  await domReady();
  document.title = `i18n Editor v${version}`;

  appendLoading();
})();

// --------- Expose some API to Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs);
contextBridge.exposeInMainWorld('path', path);
contextBridge.exposeInMainWorld('removeLoading', removeLoading);
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer));

// `exposeInMainWorld` can not detect `prototype` attribute and methods, manually patch it.
function withPrototype(obj) {
  const protos = Object.getPrototypeOf(obj);

  Object.entries(protos).forEach(([key, value]) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return;

    if (typeof value === 'function') {
      // Some native API not work in Renderer-process, like `NodeJS.EventEmitter['on']`. Wrap a function patch it.
      obj[key] = (...args) => {
        return value.call(obj, ...args);
      };
    } else {
      obj[key] = value;
    }
  });
  return obj;
}
