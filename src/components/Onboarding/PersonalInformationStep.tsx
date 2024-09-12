import React, { useState } from 'react';
import UserInfoForm from './PersonalInformation/UserInformationForm';
import EmergencyContactForm from './PersonalInformation/EmergencyContact';

interface PersonalInformationProcessProps {
    onClose: () => void
}

const PersonalInformationProcess: React.FC<PersonalInformationProcessProps> = ({ onClose }) => {
    const [step, setStep] = useState<number>(1);
    const [userInfo, setUserInfo] = useState<Record<string, string>>({});
    const [emergencyContact, setEmergencyContact] = useState<Record<string, string>>({});

    const handleUserInfoNext = (data: Record<string, string>) => {
        setUserInfo(data);
        setStep(2); // Move to user info preview step
    };

    const handleUserInfoSubmit = (data: Record<string, string>) => {
        return
    };

    const handleEmergencyContactNext = (data: Record<string, string>) => {
        setEmergencyContact(data);
        setStep(4); // Move to emergency contact preview step
    };

    const handleEmergencyContactSubmit = (data: Record<string, string>) => {
        return
    };

    const handleFinalSubmit = () => {
        return
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
            {step === 1 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Step 1: User Information</h2>
                    <UserInfoForm onSubmit={handleUserInfoNext} onClose={onClose} />
                </div>
            )}

            {step === 2 && (
                <div className='flex flex-col gap-2 w-full'>
                    <h2 className="text-lg font-semibold mb-4">Step 2: Review User Information</h2>

                    <div className="border p-4 rounded-md">
                        <p><strong>First Name:</strong> {userInfo.firstName}</p>
                        <p><strong>Last Name:</strong> {userInfo.lastName}</p>
                        {/* Add more fields as necessary */}
                    </div>

                    <div className='flex w-full justify-between'>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setStep(1)} className="bg-gray-300 text-black px-4 py-2 rounded-md">
                                Edit
                            </button>
                            <button onClick={() => setStep(3)} className="bg-primary text-white px-4 py-2 rounded-md">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Step 3: Emergency Contact Information</h2>
                    <EmergencyContactForm onSubmit={handleEmergencyContactNext} onClose={onClose} />
                </div>
            )}

            {step === 4 && (
                <div className='flex flex-col gap-2 w-full'>
                    <h2 className="text-lg font-semibold mb-4">Step 4: Review Emergency Contact Information</h2>
                    <div className="border p-4 rounded-md">
                        <p><strong>First Name:</strong> {emergencyContact.firstName}</p>
                        <p><strong>Last Name:</strong> {emergencyContact.lastName}</p>
                        {/* Add more fields as necessary */}
                    </div>
                    <div className='flex w-full justify-between'>
                        <button
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setStep(3)} className="bg-gray-300 text-black px-4 py-2 rounded-md">
                                Edit
                            </button>
                            <button onClick={handleFinalSubmit} className="bg-primary text-white px-4 py-2 rounded-md">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInformationProcess;
