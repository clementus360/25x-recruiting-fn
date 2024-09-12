// useLocalStorage.tsx
import { useState } from 'react';

export function useLocalStorage(key: string, initialValue: string | null) {
    // State to store the current value
    const [storedValue, setStoredValue] = useState<string | null>(() => {
        if (typeof window === 'undefined') {
            return initialValue; // If running on server, use initial value
        }

        try {
            const item = window.localStorage.getItem(key);
            // If item exists, return it as a string
            return item ? item : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // Function to set a new value
    const setValue = (value: string | null) => {
        try {
            setStoredValue(value);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, value!); // Save as string
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Function to remove the value
    const removeValue = () => {
        try {
            setStoredValue(null);
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue, removeValue] as const;
}
