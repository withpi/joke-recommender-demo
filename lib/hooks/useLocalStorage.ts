
import { useState, useEffect } from 'react';

function getSavedValue(key:string, initialValue: string | null) {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      const savedValue = JSON.parse(item);
      if (savedValue !== null) {
        return savedValue;
      }
    }
  } catch (error) {
    console.error("Failed to parse stored value:", error);
  }

  return initialValue;
}

export default function useLocalStorage(key:string, initialValue:string | null) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Failed to save value to local storage:", error);
    }
  }, [key, value]);

  return [value, setValue];
}