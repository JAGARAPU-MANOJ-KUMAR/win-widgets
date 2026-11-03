import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));

      // Broadcast to other Electron widget windows
      if (typeof window !== 'undefined' && (window as any).electronAPI?.broadcastData) {
        (window as any).electronAPI.broadcastData(key, valueToStore);
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    // 1. Listen for standard storage events from other windows/tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 2. Listen for Electron IPC broadcast sync
    let unsubscribe: (() => void) | undefined;
    if (typeof window !== 'undefined' && (window as any).electronAPI?.onDataSynced) {
      unsubscribe = (window as any).electronAPI.onDataSynced((payload: { key: string; data: any }) => {
        if (payload.key === key) {
          setStoredValue(payload.data);
        }
      });
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (unsubscribe) unsubscribe();
    };
  }, [key]);

  return [storedValue, setValue];
}
