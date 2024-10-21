import React, { useEffect, useState } from 'react';
import ProfessionalHistoryForm from './AdditionalDocuments/ProfessionalHistory';
import ProfessionalHistoryReview from './AdditionalDocuments/ProfessionalHistoryReview'; // Import the review component
import ElectronicSignature from './AdditionalDocuments/DocumentSignature';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { ReferencesAndEmployment } from '@/types/onboardingTypes';
import { getAccessToken } from '@/data/cookies';
import { editReferencesAndEmployment, getReferencesAndEmployment, saveReferencesAndEmployment, submitAdditionalDocument, submitReferencesAndEmployment } from '@/data/onboarding';
import dynamic from 'next/dynamic';

const DocumentSignature = dynamic(() => import('./AdditionalDocuments/DocumentSignature'), { ssr: false });
const FilePreview = dynamic(() => import('./FilePreview'), { ssr: false });

interface PersonalInformationProcessProps {
    onClose: () => void;
}

const AdditionalDocumentsProcess: React.FC<PersonalInformationProcessProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [step, setStep] = useState<number>(1);
    const [professionalHistoryPdf, setProfessionalHistoryPdf] = useState('')
    const [professionalHistoryStatus, setProfessionalHistoryStatus] = useState('')
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
        thirdReasonForLeave: ''
    });

    const [load, setLoad] = useState(false)

    const handleLoad = () => {
        setLoad(!load)
    }

    const getProfessionalHistory = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const professionalHistoryInformation = await getReferencesAndEmployment(token)

            setProfessionalHistory(professionalHistoryInformation.directDepositInfo)
            setProfessionalHistoryPdf(professionalHistoryInformation.documentUrl)
            setProfessionalHistoryStatus(professionalHistoryInformation.documentStatus)

            if (step === 1 && professionalHistoryInformation.documentStatus === "COMPLETED") {
                setStep(2)
            }

        } catch (err: any) {
            if (err.message === "User doesn not  have a document. Please start the process") {
            } else {
                setError(err.message || "Failed to get references and employment information");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProfessionalHistory()
    }, [load])

    useEffect(() => {

    }, [])

    const handleSubmitDocument = async (documentType: string) => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) return;

            await submitAdditionalDocument(documentType, token);
            setSuccess(`${documentType.replace('_', ' ').toLowerCase()} submitted successfully`);

            handleLoad()

            if (step < 17) {
                console.log(step)
                setStep((prev) => prev+1)
            } else {
                onClose()
            }

        } catch (err: any) {
            if (err.message.trim() === "Document already submitted") {
                setStep(step + 1)
            }
            setError(err.message || `Failed to submit the ${documentType.replace('_', ' ').toLowerCase()}`);
        }
    };

    const handleProfessionalHistorySave = async (data: ReferencesAndEmployment) => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await saveReferencesAndEmployment(data, token)

            setProfessionalHistory(data)

            setSuccess("Direct deposit saved")
            handleLoad()
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to get Additional Info");
        } finally {
            setLoading(false);
        } // Move to user info preview step
    };

    const handleProfessionalHistoryEdit = async (data: ReferencesAndEmployment) => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await editReferencesAndEmployment(data, token)

            setProfessionalHistory(data)
            setSuccess("Additional Info updated")
            handleLoad()
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to get Additional Info");
        } finally {
            setLoading(false);
        } // Move to user info preview step
    };

    const handleNextStep = () => {
        console.log(step)
        if (step < 17) {
        setStep(step + 1)
        } else {
            onClose()
        }
    }

    const handleProfessionalHistorySubmit = async () => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await submitReferencesAndEmployment(professionalHistory, token)

            setSuccess("Additional Info submitted successfully");
            setStep(4)
        } catch (err: any) {
            setError(err.message || "Failed to save Additional Info");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStep = (step: number) => {
        setStep(step);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full px-8">
            {step === 1 && (
                // Step 1: Professional History Form
                <ProfessionalHistoryForm
                    professionalHistory={professionalHistory}
                    onSave={handleProfessionalHistorySave}
                    onEdit={handleProfessionalHistoryEdit}
                    onNext={handleNextStep}
                    onClose={onClose}
                    loading={loading}
                />
            )}

            {step === 2 && (
                <ProfessionalHistoryReview
                    onClose={onClose}
                    handleProfessionalHistorySubmit={handleProfessionalHistorySubmit}
                    handleChangeStep={handleChangeStep}
                    documentStatus={professionalHistoryStatus}
                    onNext={() => handleChangeStep(4)}
                    loading={loading}
                />
            )}

            {step === 3 && (
                <FilePreview onClose={onClose} handleChangeStep={() => handleChangeStep(2)} pdfUrl={professionalHistoryPdf} />
            )}

            {step === 4 && (
                <DocumentSignature
                    type="ELECTRONIC_SIGNATURE_AGGREMENT"
                    onClose={onClose}
                    onBack={() => setStep(2)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('ELECTRONIC_SIGNATURE_AGGREMENT')} // Final submission
                    step={3}
                    title='Electronic Signature Agreement'
                    loading={loading}
                />
            )}

            {step === 5 && (
                <DocumentSignature
                    type="CONFIDENTIALITY_AND_NONCOMPETE_AGGEREMENT"
                    onClose={onClose}
                    onBack={() => setStep(4)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('CONFIDENTIALITY_AND_NONCOMPETE_AGGEREMENT')}
                    step={4}
                    title="Confidentiality and Non-Compete Agreement"
                    loading={loading}
                />
            )}

            {step === 6 && (
                <DocumentSignature
                    type="CONFLICT_OF_INTEREST"
                    onClose={onClose}
                    onBack={() => setStep(5)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('CONFLICT_OF_INTEREST')}
                    step={5}
                    title="Conflict of Interest"
                    loading={loading}
                />
            )}

            {step === 7 && (
                <DocumentSignature
                    type="CORPORATE_COMPLIANCE"
                    onClose={onClose}
                    onBack={() => setStep(6)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('CORPORATE_COMPLIANCE')}
                    step={6}
                    title="Corporate Compliance"
                    loading={loading}
                />
            )}

            {step === 8 && (
                <DocumentSignature
                    type="ORIENTATION_CHECKLIST"
                    onClose={onClose}
                    onBack={() => setStep(7)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('ORIENTATION_CHECKLIST')}
                    step={7}
                    title="Orientation Checklist"
                    loading={loading}
                />
            )}

            {step === 9 && (
                <DocumentSignature
                    type="PPE_AND_INFECTION_CONTROL_ACKNOWLEDGMENT"
                    onClose={onClose}
                    onBack={() => setStep(8)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('PPE_AND_INFECTION_CONTROL_ACKNOWLEDGMENT')}
                    step={8}
                    title="PPE and Infection Control Acknowledgment"
                    loading={loading}
                />
            )}

            {step === 10 && (
                <DocumentSignature
                    type="JOB_ACCEPTANCE"
                    onClose={onClose}
                    onBack={() => setStep(9)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('JOB_ACCEPTANCE')}
                    step={9}
                    title="Job Acceptance"
                    loading={loading}
                />
            )}

            {step === 11 && (
                <DocumentSignature
                    type="RECEIPT_OF_EMPLOYEE_HANDBOOK"
                    onClose={onClose}
                    onBack={() => setStep(10)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('RECEIPT_OF_EMPLOYEE_HANDBOOK')}
                    step={10}
                    title="Receipt of Employee Handbook"
                    loading={loading}
                />
            )}

            {step === 12 && (
                <DocumentSignature
                    type="FIELD_EMPLOYEE_STANDARDS_AND_PROCEDURES"
                    onClose={onClose}
                    onBack={() => setStep(11)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('FIELD_EMPLOYEE_STANDARDS_AND_PROCEDURES')}
                    step={11}
                    title="Field Employee Standards and Procedures"
                    loading={loading}
                />
            )}

            {step === 13 && (
                <DocumentSignature
                    type="EMPLOYEE_SAFETY_FORM"
                    onClose={onClose}
                    onBack={() => setStep(12)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('EMPLOYEE_SAFETY_FORM')}
                    step={12}
                    title="Employee Safety Form"
                    loading={loading}
                />
            )}

            {step === 14 && (
                <DocumentSignature
                    type="HHA_DUTIES"
                    onClose={onClose}
                    onBack={() => setStep(13)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('HHA_DUTIES')}
                    step={13}
                    title="HHA Duties"
                    loading={loading}
                />
            )}

            {step === 15 && (
                <DocumentSignature
                    type="MASK_POLICY"
                    onClose={onClose}
                    onBack={() => setStep(14)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('MASK_POLICY')}
                    step={14}
                    title="Mask Policy"
                    loading={loading}
                />
            )}

            {step === 16 && (
                <DocumentSignature
                    type="PRIVACY_POLICY"
                    onClose={onClose}
                    onBack={() => setStep(15)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('PRIVACY_POLICY')}
                    step={15}
                    title="Privacy Policy"
                    loading={loading}
                />
            )}

            {step === 17 && (
                <DocumentSignature
                    type="HEPATITS_VACCINE_REQUIREMENT"
                    onClose={onClose}
                    onBack={() => setStep(16)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('HEPATITS_VACCINE_REQUIREMENT')}
                    step={16}
                    title="Hepatitis Vaccine Requirement"
                    loading={loading}
                />
            )}
        </div>
    );
};

export default AdditionalDocumentsProcess;
