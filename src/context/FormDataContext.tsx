import { FormDataContextType, FormDataProviderProps, FormDataType } from '@/types/jobTypes';
import { createContext, useContext, useEffect, useState } from 'react'

const initialState: FormDataType = {
    jobTitle: '',
    category: '',
    department: '',
    seats: 0,
    payRate: 0,
    payPeriod: '',
    payFrequency: '',
    managementRole: '',
    employmentType: '',
    hireType: '',
    hiringManager: '',
    search: '',
    isRemote: true,
    country: 'United States',
    address: '',
    city: 'Fort Myers',
    state: 'Florida',
    zip: '',
    description: '',
    status: '',
    visibility: ''
};

const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export const useFormData = () => useContext(FormDataContext);

const FormDataProvider: React.FC<FormDataProviderProps> = ({ children }) => {
    const [formData, setFormData] = useState<FormDataType>(() => {
        // Load from local storage or initialize with the default state
        const savedData = localStorage.getItem('formData');
        const savedTimestamp = localStorage.getItem('formDataTimestamp');

        if (savedData && savedTimestamp) {
            const isExpired = Date.now() - parseInt(savedTimestamp, 10) > EXPIRATION_TIME;

            if (!isExpired) {
                return JSON.parse(savedData);
            }
        }

        return initialState;
    });

    useEffect(() => {
        // Save form data to local storage whenever it changes
        localStorage.setItem('formData', JSON.stringify(formData));
        localStorage.setItem('formDataTimestamp', Date.now().toString());
    }, [formData]);


    return (
        <FormDataContext.Provider value={{ formData, setFormData }}>
            {children}
        </FormDataContext.Provider>
    )
}

export { FormDataContext, FormDataProvider }