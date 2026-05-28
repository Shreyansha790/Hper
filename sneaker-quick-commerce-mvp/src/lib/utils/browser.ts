export const isBrowser = typeof window !== 'undefined';

const inMemoryStorage = new Map<string, string>();

const canUseStorage = (storage: 'localStorage' | 'sessionStorage') => {
  if (!isBrowser) return false;
  try {
    const key = '__kicksfly_storage_test__';
    window[storage].setItem(key, '1');
    window[storage].removeItem(key);
    return true;
  } catch {
    return false;
  }
};

const readStorage = (storage: 'localStorage' | 'sessionStorage', key: string): string | null => {
  if (canUseStorage(storage)) {
    return window[storage].getItem(key);
  }
  return inMemoryStorage.get(`${storage}:${key}`) ?? null;
};

const writeStorage = (storage: 'localStorage' | 'sessionStorage', key: string, value: string) => {
  if (canUseStorage(storage)) {
    window[storage].setItem(key, value);
    return;
  }
  inMemoryStorage.set(`${storage}:${key}`, value);
};

const removeStorage = (storage: 'localStorage' | 'sessionStorage', key: string) => {
  if (canUseStorage(storage)) {
    window[storage].removeItem(key);
    return;
  }
  inMemoryStorage.delete(`${storage}:${key}`);
};

export const safeLocalStorage = {
  getItem: (key: string) => readStorage('localStorage', key),
  setItem: (key: string, value: string) => writeStorage('localStorage', key, value),
  removeItem: (key: string) => removeStorage('localStorage', key),
};

export const prefersReducedMotion = (): boolean => {
  if (!isBrowser || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
