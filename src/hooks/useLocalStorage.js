// @ts-nocheck
import { useState } from 'react';

/**
 * Custom hook to read/write state from/to localStorage.
 * Maintains state synchronization with local storage logs.
 * 
 * @param {string} key - The local storage key string.
 * @param {*} initialValue - The fallback value if storage is empty.
 * @returns {[*, Function]} State value and its update setter function.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key:', key, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing localStorage key:', key, error);
    }
  };

  return [storedValue, setValue];
}
