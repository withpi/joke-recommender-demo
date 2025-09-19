
import { useState, useEffect } from 'react';

function getSavedValue(key:string, initialValue: string | null) {
  if (typeof window !== 'undefined') {
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
  } return null;
}

export default function useLocalStorage(key:string, initialValue:string | null) {
  const [value, setValue] = useState(() => {
    return getSavedValue(key, initialValue);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save value to local storage:", error);
      }
    }
  }, [key, value]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setValue(getSavedValue(key, initialValue));
    }
  }, [])

  return [value, setValue];
}