const storage = (storage: Storage) => ({
  getItem: <T>(key: string): T | null => {
    const strItem = storage.getItem(key);

    return strItem !== null ? (JSON.parse(strItem) as T) : null;
  },
  setItem: <T>(keyName: string, keyValue: T) => {
    storage.setItem(keyName, JSON.stringify(keyValue));
  },
  clear: () => storage.clear(),
  key: (index: number): string | null => storage.key(index),
  removeItem: (keyName: string) => storage.removeItem(keyName),
});

export const localStorageJSON: StorageJSON = storage(window.localStorage);
export const sessionStorageJSON: StorageJSON = storage(window.sessionStorage);

export interface StorageJSON {
  getItem: <T>(key: string) => T | null,
  setItem: <T>(keyName: string, keyValue: T) => void,
  clear: () => void,
  key: (index: number) => string | null,
  removeItem: (keyName: string) => void
}
