import React, { useEffect, useState } from 'react';
import SignatureSection from '../ESignature/SignatureSection';
import { useError } from '@/context/ErrorContext';
import { getAccessToken } from '@/data/cookies';
import { getEmergencyContacts } from '@/data/onboarding';
import { OnboardingEmergencyContacts } from '@/types/onboardingTypes';

export default function UserInformationReview({ onClose, onNext, documentStatus, handleEmergencyContactSubmit, handleChangeStep }: { onClose: () => void, onNext: () => void, documentStatus: string, handleEmergencyContactSubmit: () => void, handleChangeStep: (step: number) => void }) {
    const { setError } = useError();
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState<boolean>(false);
    const [emergencyContacts, setEmergencyContacts] = useState<OnboardingEmergencyContacts>({
        firstName: '',
        lastName: '',
        primaryPhone: '',
        secondaryPhone: '',
        relationship: ''
    });

    const getEmergencyContactInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const emergencyContactInformation = await getEmergencyContacts(token)

            console.log(emergencyContactInformation)

            setEmergencyContacts(emergencyContactInformation.emergencyContactsInfo)

        } catch (err: any) {
            setError(err.message || "Failed to get personal information");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getEmergencyContactInfo()
    }, [])

    const handleAgreed = (value: boolean) => setAgreed(value);

    return (
        <div className='flex flex-col gap-6 w-full'>
            <h2 className="text-xl font-semibold mb-3">Step 4: Review Emergency Contact Information</h2>

            <div className="border px-4 py-8 rounded-md divide-y divide-gray-300">
                <div className="flex flex-col gap-12">
                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>First Name:</strong> <p className='text-grey'>{emergencyContacts.firstName}</p></div>
                        <div><strong>Last Name:</strong> <p className='text-grey'>{emergencyContacts.lastName}</p></div>
                        <div><strong>Phone Number:</strong> <p className='text-grey'>{emergencyContacts.primaryPhone}</p></div>
                        <div><strong>Relationship:</strong> <p className='text-grey'>{emergencyContacts.relationship}</p></div>
                    </div>

                    <button className=' border-[0.1rem] border-primary py-2 rounded-md' onClick={() => handleChangeStep(7)}>Preview document</button>
                </div>
            </div>

            {documentStatus != "COMPLETED" &&
                <div className="border p-4 rounded-md bg-lightBlue">
                    <SignatureSection
                        isAgreed={agreed}
                        setIsAgreed={handleAgreed}
                    />
                </div>
            }

            <div className='flex justify-between'>
                <button onClick={onClose} className="bg-gray-500 text-white px-3 py-2 rounded-md">Cancel</button>
                <div className="flex gap-2">
                    <button onClick={() => handleChangeStep(3)} className="bg-gray-300 text-black px-3 py-2 rounded-md">Edit</button>
                    {documentStatus === "COMPLETED" ?
                        <button
                            onClick={onNext}
                            className={`bg-primary text-white px-3 py-2 rounded-md`}
                        >
                            Next
                        </button>
                        :
                        <button
                            onClick={handleEmergencyContactSubmit}
                            className={`bg-primary text-white px-3 py-2 rounded-md ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!agreed}
                        >
                            Submit
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}
