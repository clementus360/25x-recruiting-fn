import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the context value
interface ErrorContextType {
    error: string;
    setError: (error: string) => void;
}

// Create the context with a default value
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Custom hook to use the ErrorContext
export const useError = () => {
    const context = useContext(ErrorContext);

    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }

    return context;
};

// ErrorProvider component
export const ErrorProvider = ({ children }: { children: ReactNode }) => {
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (error) {
          const timer = setTimeout(() => {
            setError('');
          }, 5000); // Error disappears after 5 seconds
    
          return () => clearTimeout(timer); // Clean up timer if component unmounts
        }
      }, [error]);

    return (
        <ErrorContext.Provider value={{ error, setError }}>
            {children}
        </ErrorContext.Provider>
    );
};
