import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Convert date strings back to Date objects
        if (Array.isArray(parsed)) {
          return parsed.map((item: any) => {
            if (item.createdAt && typeof item.createdAt === 'string') {
              item.createdAt = new Date(item.createdAt);
            }
            if (item.date && typeof item.date === 'string') {
              item.date = new Date(item.date);
            }
            // Handle weeklySales for clients
            if (item.weeklySales && Array.isArray(item.weeklySales)) {
              item.weeklySales = item.weeklySales.map((sale: any) => ({
                ...sale,
                weekStart: new Date(sale.weekStart),
                weekEnd: new Date(sale.weekEnd),
                createdAt: new Date(sale.createdAt)
              }));
            }
            return item;
          });
        }
        return parsed;
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
