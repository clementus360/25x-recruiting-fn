import React, { useEffect, useState } from 'react';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { getAccessToken } from '@/data/cookies';
import dynamic from 'next/dynamic';
import { submitAdditionalDocument } from '@/data/onboarding';

const DocumentSignature = dynamic(() => import('./AdditionalDocuments/DocumentSignature'), { ssr: false });

interface PersonalInformationProcessProps {
    onClose: () => void;
}

const TestsAndCertificationsProcess: React.FC<PersonalInformationProcessProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [step, setStep] = useState<number>(1);

    const [load, setLoad] = useState(false)

    const handleLoad = () => {
        setLoad(!load)
    }

    const handleSubmitDocument = async (documentType: string) => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) return;

            await submitAdditionalDocument(documentType, token);
            setSuccess(`${documentType.replace('_', ' ').toLowerCase()} submitted successfully`);

            if (step < 5) {
                setStep((prev) => prev + 1)
            } else {
                onClose()
            }

            handleLoad()

        } catch (err: any) {
            if (err.message.trim() === "Document already submitted") {
                setStep(step + 1)
            }
            setError(err.message || `Failed to submit the ${documentType.replace('_', ' ').toLowerCase()}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        console.log(step)
        if (step < 5) {
            setStep(step + 1)
        } else {
            onClose()
        }

        handleLoad()
    }

    return (
        <div className="flex flex-col items-center gap-4 w-full px-8">

            {step === 1 && (
                <DocumentSignature
                    type="HIV_AND_AIDS_TEST"
                    onClose={onClose}
                    onBack={() => onClose()}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('HIV_AND_AIDS_TEST')} // Final submission
                    step={1}
                    title='HIV AND AIDS Test'
                    loading={loading}
                />
            )}

            {step === 2 && (
                <DocumentSignature
                    type="ALZHEIMER_DISEASE_TEST"
                    onClose={onClose}
                    onBack={() => setStep(1)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('ALZHEIMER_DISEASE_TEST')}
                    step={2}
                    title="Alzheimer Disease"
                    loading={loading}
                />
            )}

            {step === 3 && (
                <DocumentSignature
                    type="HOME_HEALTH_AIDE_COMPETENCY_TEST"
                    onClose={onClose}
                    onBack={() => setStep(2)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('HOME_HEALTH_AIDE_COMPETENCY_TEST')}
                    step={3}
                    title="Home Health Aide Competency Test"
                    loading={loading}
                />
            )}

            {step === 4 && (
                <DocumentSignature
                    type="POST_TEST"
                    onClose={onClose}
                    onBack={() => setStep(3)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('POST_TEST')}
                    step={4}
                    title="Post Test"
                    loading={loading}
                />
            )}

            {step === 5 && (
                <DocumentSignature
                    type="CULTURE_INDEX_SURVEY"
                    onClose={onClose}
                    onBack={() => setStep(4)}
                    onNext={handleNextStep}
                    handleSubmit={() => handleSubmitDocument('CULTURE_INDEX_SURVEY')}
                    step={5}
                    title="Culture Index Survey"
                    loading={loading}
                />
            )}

        </div>
    );
};

export default TestsAndCertificationsProcess;
