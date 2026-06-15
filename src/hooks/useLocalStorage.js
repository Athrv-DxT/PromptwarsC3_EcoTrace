import { useState, useEffect } from 'react';

/**
 * Custom hook to read/write state from/to localStorage.
 * 
 * TEST CASES:
 * const [history, setHistory] = useLocalStorage('ecotrace_history', [])
 * setHistory([{ score: 5000, date: '2026-06-15' }]) => window.localStorage contains key 'ecotrace_history' with stringified value.
 * Isolation Check: No PII stored, only score and date.
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
