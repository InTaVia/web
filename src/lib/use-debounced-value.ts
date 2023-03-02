import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 150): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [value]);

  return debouncedValue;
}
