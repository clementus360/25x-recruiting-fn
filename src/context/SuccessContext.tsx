import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the context value
interface SuccessContextType {
    success: string;
    setSuccess: (success: string, companyId?: number, applicantId?: number) => void;
    companyId: number | null;
    applicantId: number | null;
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
    const [success, setSuccessState] = useState<string>('');
    const [companyId, setCompanyId] = useState<number | null>(null);
    const [applicantId, setApplicantId] = useState<number | null>(null);

    useEffect(() => {
        // Only start a timer if either companyId or applicantId is missing
        if (success && (!companyId || !applicantId)) {
            const timer = setTimeout(() => {
                setSuccessState('');
                setCompanyId(null);
                setApplicantId(null);
            }, 5000);

            return () => clearTimeout(timer); // Clean up the timer
        }
        // If both are present, success remains indefinitely (no timer set)
    }, [success, companyId, applicantId]);

    const setSuccess = (message: string, companyId?: number, applicantId?: number) => {
        setSuccessState(message);
        if (companyId) {
            setCompanyId(companyId)
        } else {
            setCompanyId(null)
        }
        if (applicantId) {
            setApplicantId(applicantId)
        } else {
            setApplicantId(null)
        };
    };

    return (
        <SuccessContext.Provider value={{ success, setSuccess, companyId, applicantId }}>
            {children}
        </SuccessContext.Provider>
    );
};
