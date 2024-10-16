import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the context value
interface AuthErrorContextType {
    error: string;
    setError: (error: string) => void;
}

// Create the context with a default value
const AuthErrorContext = createContext<AuthErrorContextType | undefined>(undefined);

// Custom hook to use the ErrorContext
export const useAuthError = () => {
    const context = useContext(AuthErrorContext);

    if (!context) {
        throw new Error('useError must be used within an ErrorProvider');
    }

    return context;
};

// ErrorProvider component
export const AuthErrorProvider = ({ children }: { children: ReactNode }) => {
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
        <AuthErrorContext.Provider value={{ error, setError }}>
            {children}
        </AuthErrorContext.Provider>
    );
};
