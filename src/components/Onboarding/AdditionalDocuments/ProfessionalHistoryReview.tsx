import React, { useEffect, useState } from 'react';
import SignatureSection from '../ESignature/SignatureSection';
import { useError } from '@/context/ErrorContext';
import { getAccessToken } from '@/data/cookies';
import { getReferencesAndEmployment } from '@/data/onboarding';
import { ReferencesAndEmployment } from '@/types/onboardingTypes';

interface ProfessionalHistoryReviewProps {
    onClose: () => void;
    onNext: () => void;
    handleProfessionalHistorySubmit: () => void;
    handleChangeStep: (step: number) => void;
    documentStatus: string
}

const ProfessionalHistoryReview: React.FC<ProfessionalHistoryReviewProps> = ({
    onClose,
    onNext,
    handleProfessionalHistorySubmit,
    handleChangeStep,
    documentStatus
}) => {
    const { setError } = useError();
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState<boolean>(false);
    const [professionalHistory, setProfessionalHistory] = useState<ReferencesAndEmployment>({
        primaryName: '',
        primaryEmployer: '',
        primaryPhone: '',
        primaryRelationship: '',
        secondaryName: '',
        secondaryEmployer: '',
        secondaryPhone: '',
        secondaryRelationship: '',
        primaryJobTitle: '',
        primaryCompanyName: '',
        primaryStartDate: '',
        primaryEndDate: '',
        primaryStartingSalary: '',
        primaryEndingSalary: '',
        primarySupervisorName: '',
        primaryWorkPhone: '',
        primaryReasonForLeave: '',
        secondaryJobTitle: '',
        secondaryCompanyName: '',
        secondaryStartDate: '',
        secondaryEndDate: '',
        secondaryStartingSalary: '',
        secondaryEndingSalary: '',
        secondarySupervisorName: '',
        secondaryWorkPhone: '',
        secondaryReasonForLeave: '',
        thirdJobTitle: '',
        thirdCompanyName: '',
        thirdStartDate: '',
        thirdEndDate: '',
        thirdStartingSalary: '',
        thirdEndingSalary: '',
        thirdSupervisorName: '',
        thirdWorkPhone: '',
        thirdReasonForLeave: '',
    });



    const getProfessionalHistoryInfo = async () => {
        try {
            setLoading(true);
            const token = getAccessToken();
            if (!token) {
                return;
            }
            const professionalHistoryData = await getReferencesAndEmployment(token);
            setProfessionalHistory(professionalHistoryData.directDepositInfo);
        } catch (err: any) {
            setError(err.message || "Failed to get professional history");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getProfessionalHistoryInfo();
    }, []);

    const handleAgreed = (value: boolean) => setAgreed(value);

    return (
        <div className="flex flex-col gap-6 w-full">
            <h2 className="text-xl font-semibold mb-3">Step 2: Review Professional History Information</h2>

            {/* Review References */}
            <div className="border px-4 py-8 rounded-md divide-y divide-gray-300">
                <h3 className="text-lg font-medium mb-4">References</h3>
                <div className="grid grid-cols-2 gap-4 py-8 px-4">
                    <div><strong>Primary Name:</strong> <p className="text-grey">{professionalHistory.primaryName}</p></div>
                    <div><strong>Primary Employer:</strong> <p className="text-grey">{professionalHistory.primaryEmployer}</p></div>
                    <div><strong>Primary Phone:</strong> <p className="text-grey">{professionalHistory.primaryPhone}</p></div>
                    <div><strong>Primary Relationship:</strong> <p className="text-grey">{professionalHistory.primaryRelationship}</p></div>
                    <div><strong>Secondary Name:</strong> <p className="text-grey">{professionalHistory.secondaryName}</p></div>
                    <div><strong>Secondary Employer:</strong> <p className="text-grey">{professionalHistory.secondaryEmployer}</p></div>
                    <div><strong>Secondary Phone:</strong> <p className="text-grey">{professionalHistory.secondaryPhone}</p></div>
                    <div><strong>Secondary Relationship:</strong> <p className="text-grey">{professionalHistory.secondaryRelationship}</p></div>
                </div>
            </div>

            {/* Review Work History */}
            <div className="border px-4 py-8 rounded-md divide-y divide-gray-300">
                <h3 className="text-lg font-medium mb-4">Work History</h3>
                {[{
                    jobTitle: professionalHistory.primaryJobTitle,
                    companyName: professionalHistory.primaryCompanyName,
                    startDate: professionalHistory.primaryStartDate,
                    endDate: professionalHistory.primaryEndDate,
                    startingSalary: professionalHistory.primaryStartingSalary,
                    endingSalary: professionalHistory.primaryEndingSalary,
                    supervisorName: professionalHistory.primarySupervisorName,
                    workPhone: professionalHistory.primaryWorkPhone,
                    reasonForLeaving: professionalHistory.primaryReasonForLeave,
                },
                {
                    jobTitle: professionalHistory.secondaryJobTitle,
                    companyName: professionalHistory.secondaryCompanyName,
                    startDate: professionalHistory.secondaryStartDate,
                    endDate: professionalHistory.secondaryEndDate,
                    startingSalary: professionalHistory.secondaryStartingSalary,
                    endingSalary: professionalHistory.secondaryEndingSalary,
                    supervisorName: professionalHistory.secondarySupervisorName,
                    workPhone: professionalHistory.secondaryWorkPhone,
                    reasonForLeaving: professionalHistory.secondaryReasonForLeave,
                },
                {
                    jobTitle: professionalHistory.thirdJobTitle,
                    companyName: professionalHistory.thirdCompanyName,
                    startDate: professionalHistory.thirdStartDate,
                    endDate: professionalHistory.thirdEndDate,
                    startingSalary: professionalHistory.thirdStartingSalary,
                    endingSalary: professionalHistory.thirdEndingSalary,
                    supervisorName: professionalHistory.thirdSupervisorName,
                    workPhone: professionalHistory.thirdWorkPhone,
                    reasonForLeaving: professionalHistory.thirdReasonForLeave,
                }].map((work, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 py-8 px-4">
                        <div><strong>Job Title:</strong> <p className="text-grey">{work.jobTitle}</p></div>
                        <div><strong>Company Name:</strong> <p className="text-grey">{work.companyName}</p></div>
                        <div><strong>Start Date:</strong> <p className="text-grey">{work.startDate}</p></div>
                        <div><strong>End Date:</strong> <p className="text-grey">{work.endDate}</p></div>
                        <div><strong>Starting Salary:</strong> <p className="text-grey">{work.startingSalary}</p></div>
                        <div><strong>Ending Salary:</strong> <p className="text-grey">{work.endingSalary}</p></div>
                        <div><strong>Supervisor Name:</strong> <p className="text-grey">{work.supervisorName}</p></div>
                        <div><strong>Work Phone:</strong> <p className="text-grey">{work.workPhone}</p></div>
                        <div><strong>Reason for Leaving:</strong> <p className="text-grey">{work.reasonForLeaving}</p></div>
                    </div>
                ))}
            </div>

            <button className=' border-[0.1rem] border-primary py-2 rounded-md' onClick={() => handleChangeStep(3)}>Preview document</button>


            {/* Signature Section */}
            {documentStatus != "COMPLETED" &&
                <div className="border p-4 rounded-md bg-lightBlue">
                    <SignatureSection
                        isAgreed={agreed}
                        setIsAgreed={handleAgreed}
                    />
                </div>
            }

            {/* Buttons for navigation */}
            <div className="flex justify-between">
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
                            onClick={handleProfessionalHistorySubmit}
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
};

export default ProfessionalHistoryReview;
