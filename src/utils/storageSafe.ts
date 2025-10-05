export type StorageNamespace = 'bridgeway-demo';

const NAMESPACE: StorageNamespace = 'bridgeway-demo';

export const safeStorage = {
  get(key: string): string | null {
    try {
      return window.localStorage.getItem(`${NAMESPACE}:${key}`);
    } catch (error) {
      console.warn('LocalStorage unavailable, falling back to memory.', error);
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(`${NAMESPACE}:${key}`, value);
    } catch (error) {
      console.warn('Persisting failed, continuing without storage.', error);
    }
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(`${NAMESPACE}:${key}`);
    } catch (error) {
      console.warn('Removing persistence failed.', error);
    }
  }
};
