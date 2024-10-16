import { ReferencesAndEmployment } from '@/types/onboardingTypes';
import React, { useEffect, useState } from 'react';

interface UserInfoFormProps {
    professionalHistory: ReferencesAndEmployment,
    onSave: (formData: ReferencesAndEmployment) => void;
    onEdit: (formData: ReferencesAndEmployment) => void;
    onNext: () => void;
    onClose: () => void;
}

const ProfessionalHistoryForm: React.FC<UserInfoFormProps> = ({
    professionalHistory,
    onSave,
    onEdit,
    onNext,
    onClose,
}) => {
    const [initialData, setInitialData] = useState<ReferencesAndEmployment>(professionalHistory);
    const [formData, setFormData] = useState<ReferencesAndEmployment>(professionalHistory);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

    const handleChange = (field: keyof ReferencesAndEmployment, value: string) => {
        setFormData((prevFormData) => ({ ...prevFormData, [field]: value }));
        if (touched[field]) validateField(field, value);
    };


    const validateField = (field: keyof ReferencesAndEmployment, value: string) => {
        let error = '';
        if (!value) {
            error = 'This field is required';
        } else if (field.includes('Phone') && !/^\d{10}$/.test(value)) {
            error = 'Invalid phone number';
        }
        return error;
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        Object.keys(formData).forEach((key) => {
            const field = key as keyof ReferencesAndEmployment;
            const error = validateField(field, formData[field]);
            if (error) {
                newErrors[field] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBlur = (field: keyof ReferencesAndEmployment) => {
        setTouched((prevTouched) => ({ ...prevTouched, [field]: true }));
        validateField(field, formData[field]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const isEmptyForm = Object.keys(initialData).every(
                (key) => !initialData[key as keyof ReferencesAndEmployment]
            );

            if (isEmptyForm) {
                onSave(formData);
            } else {
                const isSameAsInitial = Object.keys(formData).every(
                    (key) => formData[key as keyof ReferencesAndEmployment] === initialData[key as keyof ReferencesAndEmployment]
                );
                if (isSameAsInitial) {
                    onNext();
                } else {
                    onEdit(formData);
                }
            }
        }
    };

    useEffect(() => {
        validateForm()
    }, [formData])

    useEffect(() => {
        setFormData(professionalHistory)
        setInitialData(professionalHistory)
    }, [professionalHistory])

    const renderInput = (label: string, field: keyof ReferencesAndEmployment, placeholder: string, type = 'text') => (
        <div className="flex flex-col">
            <label htmlFor={field}>
                <p>{label}</p>
            </label>
            <input
                type={type}
                name={field}
                placeholder={placeholder}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                onBlur={() => handleBlur(field)}
                className={`border px-3 py-2 rounded-md w-full ${errors[field] ? 'border-red-500' : ''}`}
            />
            {errors[field] && touched[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
            <h2 className="text-xl font-semibold mb-3">Step 1: Professional History Information</h2>

            <div className="flex flex-col gap-4 w-full">
                <h3 className="text-xl font-bold my-4">Primary Reference</h3>
                {renderInput('Primary Name', 'primaryName', 'Enter primary name')}
                {renderInput('Primary Employer', 'primaryEmployer', 'Enter primary employer')}
                {renderInput('Primary Phone', 'primaryPhone', 'Enter phone number')}
                {renderInput('Primary Relationship', 'primaryRelationship', 'Enter relationship')}

                {/* Secondary Reference */}
                <h3 className="text-xl font-bold my-4">Secondary Reference</h3>
                {renderInput('Secondary Name', 'secondaryName', 'Enter secondary name')}
                {renderInput('Secondary Employer', 'secondaryEmployer', 'Enter secondary employer')}
                {renderInput('Secondary Phone', 'secondaryPhone', 'Enter phone number')}
                {renderInput('Secondary Relationship', 'secondaryRelationship', 'Enter relationship')}

                {/* Work History Section */}
                <h3 className="text-xl font-bold my-4">Work History (Primary Job)</h3>
                {renderInput('Job Title', 'primaryJobTitle', 'Enter job title')}
                {renderInput('Company Name', 'primaryCompanyName', 'Enter company name')}
                {renderInput('Start Date', 'primaryStartDate', 'Enter start date', 'date')}
                {renderInput('End Date', 'primaryEndDate', 'Enter end date', 'date')}
                {renderInput('Starting Salary', 'primaryStartingSalary', 'Enter starting salary')}
                {renderInput('Ending Salary', 'primaryEndingSalary', 'Enter ending salary')}
                {renderInput('Supervisor Name', 'primarySupervisorName', 'Enter supervisor name')}
                {renderInput('Work Phone', 'primaryWorkPhone', 'Enter supervisor phone number')}
                {renderInput('Reason for Leaving', 'primaryReasonForLeave', 'Enter reason for leaving')}

                {/* Secondary Job */}
                <h3 className="text-xl font-bold my-4">Work History (Secondary Job)</h3>
                {renderInput('Job Title', 'secondaryJobTitle', 'Enter job title')}
                {renderInput('Company Name', 'secondaryCompanyName', 'Enter company name')}
                {renderInput('Start Date', 'secondaryStartDate', 'Enter start date', 'date')}
                {renderInput('End Date', 'secondaryEndDate', 'Enter end date', 'date')}
                {renderInput('Starting Salary', 'secondaryStartingSalary', 'Enter starting salary')}
                {renderInput('Ending Salary', 'secondaryEndingSalary', 'Enter ending salary')}
                {renderInput('Supervisor Name', 'secondarySupervisorName', 'Enter supervisor name')}
                {renderInput('Work Phone', 'secondaryWorkPhone', 'Enter supervisor phone number')}
                {renderInput('Reason for Leaving', 'secondaryReasonForLeave', 'Enter reason for leaving')}

                {/* Third Job */}
                <h3 className="text-xl font-bold my-4">Work History (Third Job)</h3>
                {renderInput('Job Title', 'thirdJobTitle', 'Enter job title')}
                {renderInput('Company Name', 'thirdCompanyName', 'Enter company name')}
                {renderInput('Start Date', 'thirdStartDate', 'Enter start date', 'date')}
                {renderInput('End Date', 'thirdEndDate', 'Enter end date', 'date')}
                {renderInput('Starting Salary', 'thirdStartingSalary', 'Enter starting salary')}
                {renderInput('Ending Salary', 'thirdEndingSalary', 'Enter ending salary')}
                {renderInput('Supervisor Name', 'thirdSupervisorName', 'Enter supervisor name')}
                {renderInput('Work Phone', 'thirdWorkPhone', 'Enter supervisor phone number')}
                {renderInput('Reason for Leaving', 'thirdReasonForLeave', 'Enter reason for leaving')}
            </div>

            <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
                    Close
                </button>
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md">
                    Next
                </button>
            </div>
        </form>
    );
};

export default ProfessionalHistoryForm;
