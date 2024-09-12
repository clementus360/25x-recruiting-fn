import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the context value
interface SuccessContextType {
    success: string;
    setSuccess: (success: string) => void;
}

// Create the context with a default value
const SuccessContext = createContext<SuccessContextType | undefined>(undefined);

// Custom hook to use the SuccessContext
export const useSuccess = () => {
    const context = useContext(SuccessContext);

    if (!context) {
        throw new Error('useSuccess must be used within an ErrorProvider');
    }

    return context;
};

// SuccessProvider component
export const SuccessProvider = ({ children }: { children: ReactNode }) => {
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        if (success) {
          const timer = setTimeout(() => {
            setSuccess('');
          }, 5000); // Success disappears after 5 seconds
    
          return () => clearTimeout(timer); // Clean up timer if component unmounts
        }
      }, [success]);

    return (
        <SuccessContext.Provider value={{ success, setSuccess }}>
            {children}
        </SuccessContext.Provider>
    );
};
