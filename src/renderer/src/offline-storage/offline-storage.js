// Use 'electron-store'
export const offlineStorage = {
  async get(key) {
    const { invoke } = window.ipcRenderer;
    let value = await invoke("offline-storage", "get", key);
    try {
      value = JSON.parse(value);
    } finally {
      return value;
    }
  },
  async set(key, value) {
    const { invoke } = window.ipcRenderer;
    let val = value;
    try {
      if (value && typeof value === "object") {
        val = JSON.stringify(value);
      }
    } finally {
      await invoke("offline-storage", "set", key, val);
    }
  },
};

export {};
