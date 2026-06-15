import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a fast-changing state.
 * 
 * TEST CASES:
 * const debounced = useDebounce(value, 250)
 * Rapid updates to value within 200ms -> debounced remains unchanged until 250ms has elapsed since the last update.
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
