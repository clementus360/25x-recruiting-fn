import React, { useEffect, useState } from 'react';
import UserInfoForm from './PersonalInformation/UserInformationForm';
import EmergencyContactForm from './PersonalInformation/EmergencyContact';
import UserInformationReview from './PersonalInformation/UserInformationReview';
import EmergencyContactReview from './PersonalInformation/EmergencyContactReview';
import { OnboardingEmergencyContacts, OnboardingPersonalInfo } from '@/types/onboardingTypes';
import { getAccessToken } from '@/data/cookies';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { editEmergencyContacts, editPersonalInfo, getEmergencyContacts, getPersonalInfo, saveEmergencyContacts, savePersonalInfo, submitEmergencyContacts, submitPersonalInfo } from '@/data/onboarding';
import dynamic from 'next/dynamic';

const FilePreview = dynamic(() => import('./FilePreview'), { ssr: false });


interface PersonalInformationProcessProps {
    onClose: () => void
}

const PersonalInformationProcess: React.FC<PersonalInformationProcessProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [step, setStep] = useState<number>(1);
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
    const [userInfoPdf, setUserInfoPdf] = useState('')
    const [userInfoStatus, setUserInfoStatus] = useState('')
    const [emergencyContactsPdf, setEmergencyContactsPdf] = useState('')
    const [emergencyContactsStatus, setEmergencyContactsStatus] = useState('')
    const [emergencyContacts, setEmergencyContacts] = useState<OnboardingEmergencyContacts>({
        firstName: '',
        lastName: '',
        primaryPhone: '',
        secondaryPhone: '',
        relationship: ''
    });
    const [load, setLoad] = useState(false)

    const handleLoad = () => {
        setLoad(!load)
    }

    const getUserInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const userInformation = await getPersonalInfo(token)

            setUserInfo(userInformation.personalInfo)
            setUserInfoPdf(userInformation.documentUrl)
            setUserInfoStatus(userInformation.documentStatus)

            if (step === 1 && userInformation.documentStatus === "COMPLETED") {
                setStep(2)
            }

        } catch (err: any) {
            if (err.message === "User doesn not  have a document. Please start the process") {
            } else {
                setError(err.message || "Failed to get personal information");
            }
        } finally {
            setLoading(false);
        }
    }

    const getEmergencyContactsInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const emergencyContactsInformation = await getEmergencyContacts(token)

            setEmergencyContacts(emergencyContactsInformation.emergencyContactsInfo)
            setEmergencyContactsPdf(emergencyContactsInformation.documentUrl)
            setEmergencyContactsStatus(emergencyContactsInformation.documentStatus)

            if (step === 3 && emergencyContactsInformation.documentStatus === "COMPLETED") {
                setStep(4)
            }

        } catch (err: any) {
            if (err.message === "User doesn not  have a document. Please start the process") {
            } else {
                setError(err.message || "Failed to get emergency contacts");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserInfo()
        getEmergencyContactsInfo()
    }, [load])

    const handleChangeStep = (step: number) => {
        setStep(step)
    }

    const handleUserInfoSave = async (data: OnboardingPersonalInfo) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await savePersonalInfo(data, token)

            setUserInfo(data)

            setSuccess("User Information saved")
            handleLoad()
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to get personal information");
        } finally {
            setLoading(false);
        } // Move to user info preview step
    };

    const handleUserInfoEdit = async (data: OnboardingPersonalInfo) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await editPersonalInfo(data, token)

            setUserInfo(data)
            setSuccess("User Information updated")
            handleLoad()
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to get personal information");
        } finally {
            setLoading(false);
        } // Move to user info preview step
    };

    const handleUserInfoNext = () => {
        setStep(2)
    }

    const handleUserInfoSubmit = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await submitPersonalInfo(userInfo, token)

            setSuccess("personal information submitted successfully");
            setStep(3)
            handleLoad()
        } catch (err: any) {
            setError(err.message || "Failed to save personal information");
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencyContactSave = async (data: OnboardingEmergencyContacts) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await saveEmergencyContacts(data, token)

            setEmergencyContacts(data)

            setSuccess("Emergency contacts saved")
            handleLoad()
            setStep(4);
        } catch (err: any) {
            setError(err.message || "Failed to get emergency contacts");
        } finally {
            setLoading(false);
        } // Move to user info preview step
    };

    const handleEmergencyContactEdit = async (data: OnboardingEmergencyContacts) => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await editEmergencyContacts(data, token)

            setEmergencyContacts(data)
            setSuccess("Emergency contacts updated")
            handleLoad()
            setStep(4);
        } catch (err: any) {
            setError(err.message || "Failed to get emergency contacts");
        } finally {
            setLoading(false);
        } // Move to user info preview step
    };

    const handleEmergencyContactNext = () => {
        setStep(4);
    };

    const handleEmergencyContactSubmit = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await submitEmergencyContacts(emergencyContacts, token)

            setSuccess("Emergency contacts submitted successfully");
            handleLoad()
            onClose()
        } catch (err: any) {
            setError(err.message || "Failed to save emergency contacts");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full px-8">
            {step === 1 && (
                <div className='w-full'>
                    <h2 className="text-lg font-semibold mb-4">Step 1: User Information</h2>
                    <UserInfoForm
                        userInfo={userInfo}
                        onSave={handleUserInfoSave}
                        onEdit={handleUserInfoEdit}
                        onNext={handleUserInfoNext}
                        onClose={onClose}
                    />
                </div>
            )}

            {step === 2 && (
                <UserInformationReview
                    onClose={onClose}
                    documentStatus={userInfoStatus}
                    handleUserInfoSubmit={handleUserInfoSubmit}
                    handleChangeStep={handleChangeStep}
                    onNext={() => {
                        handleChangeStep(3)
                        handleLoad()
                    }}
                />
            )}

            {step === 3 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">Step 3: Emergency Contact Information</h2>
                    <EmergencyContactForm
                        emergencyContacts={emergencyContacts}
                        onSave={handleEmergencyContactSave}
                        onEdit={handleEmergencyContactEdit}
                        onNext={handleEmergencyContactNext}
                        onClose={onClose}
                    />
                </div>
            )}

            {step === 4 && (
                <EmergencyContactReview
                    onClose={onClose}
                    documentStatus={emergencyContactsStatus}
                    handleEmergencyContactSubmit={handleEmergencyContactSubmit}
                    handleChangeStep={handleChangeStep}
                    onNext={() => onClose()}
                />
            )}

            {step === 6 && (
                <FilePreview onClose={onClose} handleChangeStep={() => handleChangeStep(2)} pdfUrl={userInfoPdf} />
            )}

            {step === 7 && (
                <FilePreview onClose={onClose} handleChangeStep={() => handleChangeStep(4)} pdfUrl={emergencyContactsPdf} />
            )}
        </div>
    );
};

export default PersonalInformationProcess;
