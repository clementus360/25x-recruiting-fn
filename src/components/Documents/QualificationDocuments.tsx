import React, { useEffect, useState } from 'react'
import { documentTypeMapping, qualificationDocumentsSteps } from '@/data/constants'
import OverlayModal from './StepOverlay'
import StepCard from './StepCard'
import { FaArrowRight } from 'react-icons/fa'
import { getAccessToken } from '@/data/cookies'
import { getQualificationDocument } from '@/data/qualificationDocuments'
import { useError } from '@/context/ErrorContext'

type DocumentStatus = 'COMPLETED' | 'ON_TRACK' | 'NOT_STARTED';

export const QualificationDocuments = ({ handleNextStep }: { handleNextStep: () => void }) => {
    const [load, setLoad] = useState<boolean>(false)
    const [step, setStep] = useState("");
    const [overallStatus, setOverallStatus] = useState<DocumentStatus | null>(null);
    const [statuses, setStatuses] = useState<{ [key: string]: DocumentStatus }>({});
    const { setError } = useError();

    const handleLoad = () => {
        setLoad(!load)
    }

    useEffect(() => {
        const fetchDocumentStatuses = async () => {
            try {
                const token = getAccessToken();
                if (!token) throw new Error('Authorization token not available');

                const newStatuses: { [key: string]: DocumentStatus } = {};

                for (const stepName of qualificationDocumentsSteps) {
                    const mappedDocType = documentTypeMapping[stepName];
                    if (mappedDocType) {
                        try {
                            const response = await getQualificationDocument(mappedDocType, token);
                            const overallStatus = response.overallDocumentStatus as DocumentStatus;
                            // Use overall document status or fall back to NOT_STARTED
                            newStatuses[stepName] = overallStatus || 'NOT_STARTED';
                            setOverallStatus(overallStatus)

                            // If detailed info exists, override statuses for specific documents
                            response.qualificationDocumentsInfo?.forEach((doc: any) => {
                                if (doc.documentType === mappedDocType) {
                                    newStatuses[stepName] = doc.status as DocumentStatus;
                                }
                            });
                        } catch (error) {
                            newStatuses[stepName] = 'NOT_STARTED'; // Default status if there's an error
                        }
                    }
                }
                setStatuses(newStatuses);
            } catch (error: any) {
                setError(error.message || 'Failed to retrieve document statuses.');
            }
        };

        fetchDocumentStatuses();
    }, [setError, load]);

    const handleCardClick = (stepName: string) => {
        setStep(stepName);
    };

    const handleCloseOverlay = () => {
        setStep("");
        handleLoad()
    };

    return (
        <div className='flex items-center flex-col'>
            <div className="w-max">
                <div className="mb-6 text-center sm:text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold">Qualification Documents</h2>
                    <p className="text-sm text-gray-500">
                        Please upload required qualification documents
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center w-max p-6 bg-white rounded-lg shadow-lg">
                {/* Responsive Step Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {qualificationDocumentsSteps.map((stepName, index) => (
                        <StepCard
                            key={index}
                            step={stepName}
                            status={statuses[stepName] || 'NOT_STARTED'}
                            onClick={() => handleCardClick(stepName)}
                        />
                    ))}

                    {overallStatus === "COMPLETED" &&
                        <button
                            onClick={handleNextStep}
                            className="inline-flex self-end lg:col-start-4 items-center justify-center text-white bg-primary hover:bg-primary-dark transition-all font-medium py-4 px-3 rounded-md w-auto min-w-[150px] h-max max-w-[200px]"
                        >
                            <span className="text-sm">Next Step</span>
                            <FaArrowRight className="ml-2 text-lg" />
                        </button>
                    }
                </div>
            </div>

            {/* Overlay Modal for Steps */}
            {step && (
                <OverlayModal
                    step={step}
                    onClose={handleCloseOverlay}
                />
            )}
        </div>
    );
};
