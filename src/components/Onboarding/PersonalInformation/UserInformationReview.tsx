import React, { useEffect, useState } from 'react';
import SignatureSection from '../ESignature/SignatureSection';
import { OnboardingPersonalInfo } from '@/types/onboardingTypes';
import { getAccessToken } from '@/data/cookies';
import { getPersonalInfo } from '@/data/onboarding';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { Oval } from 'react-loader-spinner';

export default function UserInformationReview({ handleUserInfoSubmit, onNext, documentStatus, handleChangeStep, onClose, loading }: { onClose: () => void, onNext: () => void, documentStatus: string, handleUserInfoSubmit: () => void, handleChangeStep: (step: number) => void, loading: boolean }) {
    const [agreed, setAgreed] = useState<boolean>(false);
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [userInfo, setUserInfo] = useState<OnboardingPersonalInfo>({
        firstName: '',
        lastName: '',
        preferedName: '',
        streeLine1: '',
        streetLine2: '',
        city: '',
        postalCode: '',
        country: '',
        state: '',
        primaryPhone: '',
        email: '',
        dob: '',
        ssn: '',
        gender: '',
        driverLicenseNumber: '',
        driverLicenseExpiration: '',
    });

    const getUserInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const userInformation = await getPersonalInfo(token)

            console.log(userInfo)

            setUserInfo(userInformation.personalInfo)

        } catch (err: any) {
            setError(err.message || "Failed to get personal information");
        }
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    const handleAgreed = (value: boolean) => setAgreed(value);

    return (
        <div className='flex flex-col gap-6 w-full'>
            <h2 className="text-xl font-semibold mb-3">Step 2: Review Your Information</h2>

            <div className="border px-4 py-8 rounded-md divide-y divide-gray-300">
                <div className="flex flex-col gap-12">
                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>First Name:</strong> <p className='text-grey'> {userInfo.firstName}</p></div>
                        <div><strong>Last Name:</strong> <p className='text-grey'>{userInfo.lastName} </p></div>
                        <div><strong>Preferred Name:</strong> <p className='text-grey'>{userInfo.preferedName || 'N/A'} </p></div>
                        <div><strong>Date of Birth:</strong> <p className='text-grey'>{userInfo.dob} </p></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>Phone Number:</strong> <p className='text-grey'>{userInfo.primaryPhone}</p></div>
                        <div><strong>Email:</strong> <p className='text-grey'>{userInfo.email}</p></div>
                        <div className="col-span-2"><strong>Address:</strong> <p className='text-grey'>{`${userInfo.streeLine1}, ${userInfo.streetLine2 ? `${userInfo.streetLine2}, ` : ''}${userInfo.city}, ${userInfo.state}, ${userInfo.postalCode}, ${userInfo.country}`}</p></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div><strong>SSN:</strong> <p className='text-grey'>{userInfo.ssn}</p></div>
                        <div><strong>Gender:</strong> <p className='text-grey'>{userInfo.gender}</p></div>
                        <div><strong>Driver&apos;s License:</strong> <p className='text-grey'>{userInfo.driverLicenseNumber}</p></div>
                        <div><strong>License Expiry:</strong> <p className='text-grey'>{userInfo.driverLicenseExpiration}</p></div>
                    </div>

                    <button className=' border-[0.1rem] border-primary py-2 rounded-md' onClick={() => handleChangeStep(6)}>Preview document</button>
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
                    <button onClick={() => handleChangeStep(1)} className="bg-gray-300 text-black px-3 py-2 rounded-md">Edit</button>
                    {documentStatus === "COMPLETED" ?
                        <button
                            onClick={onNext}
                            className={`bg-primary text-white px-3 py-2 rounded-md`}
                        >
                            Next
                        </button>
                        :
                        <button
                            onClick={handleUserInfoSubmit}
                            className={`flex gap-2 items-center justify-center bg-primary text-white px-3 py-2 rounded-md ${!agreed || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!agreed}
                        >
                            {loading && <Oval
                                visible={true}
                                height="14"
                                width="14"
                                color="#ffffff"
                                secondaryColor="#ffffff"
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass="flex items-center justify-center"
                            />}
                            <p>{loading ? "Submitting..." : "Submit"}</p>
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}
