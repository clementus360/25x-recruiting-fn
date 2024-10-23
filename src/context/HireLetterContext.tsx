import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context value
interface HireLetterContextType {
    isHireLetterOpen: boolean;
    companyId: number | null;
    applicantId: number | null;
    openHireLetter: (companyId: number, applicantId: number) => void;
    closeHireLetter: () => void;
}

// Create the context with a default value
const HireLetterContext = createContext<HireLetterContextType | undefined>(undefined);

// Custom hook to use the HireLetterContext
export const useHireLetter = () => {
    const context = useContext(HireLetterContext);

    if (!context) {
        throw new Error('useHireLetter must be used within a HireLetterProvider');
    }

    return context;
};

// HireLetterProvider component
export const HireLetterProvider = ({ children }: { children: ReactNode }) => {
    const [isHireLetterOpen, setIsHireLetterOpen] = useState<boolean>(false);
    const [companyId, setCompanyId] = useState<number | null>(null);
    const [applicantId, setApplicantId] = useState<number | null>(null);

    const openHireLetter = (companyId: number, applicantId: number) => {
        setCompanyId(companyId);
        setApplicantId(applicantId);
        setIsHireLetterOpen(true);
    };

    const closeHireLetter = () => {
        setIsHireLetterOpen(false);
        setCompanyId(null);
        setApplicantId(null);
    };

    return (
        <HireLetterContext.Provider value={{ isHireLetterOpen, companyId, applicantId, openHireLetter, closeHireLetter }}>
            {children}
        </HireLetterContext.Provider>
    );
};
