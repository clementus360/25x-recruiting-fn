import React, { useEffect, useState } from 'react'
import StepCard from './StepCard'
import OverlayModal from './StepOverlay'
import { getAccessToken, parseJwt } from '@/data/cookies'
import { useError } from '@/context/ErrorContext'
import { getSingleOnboardingCandidate } from '@/data/onboarding'

// Type definitions
type DocumentStatus = "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "DISABLED"
type StepName = keyof typeof stepMapping
type Document = {
    documentStatus: DocumentStatus;
    [key: string]: any;
}

interface OnboardingDocument {
    documentStatus: DocumentStatus;
    documents?: Document | Document[];
}

interface OnboardingData {
    signature: { documents: Document };
    personalInfo: { documents: Document[] };
    directDeposit: Document;
    additionalDocuments: { documents: Document[] };
    testAndCertifications: { documents: Document[] };
    taxWithholding: { documents: Document[] };
    employmentEligibility: Document;
}

const stepMapping = {
    "E-Signature": "signature",
    "Personal Information": "personalInfo",
    "Direct Deposit": "directDeposit",
    "Additional Documents": "additionalDocuments",
    "Test/Certifications": "testAndCertifications",
    "Tax Withholding": "taxWithholding",
    "Employment Eligibility": "employmentEligibility"
} as const;

const onboardingSteps = [
    "E-Signature",
    "Personal Information",
    "Direct Deposit",
    "Additional Documents",
    "Test/Certifications",
    "Tax Withholding",
    "Employment Eligibility",
] as const;

export const Onboarding = () => {
    const { setError } = useError();
    const [step, setStep] = useState<string>("")
    const [load, setLoad] = useState<boolean>(false)
    const [onboardingInfo, setOnboardingInfo] = useState<OnboardingData[]>([])

    const isEmpty = (obj: any): boolean => Object.keys(obj).length === 0;

    const handleLoad = (): void => {
        setLoad(!load)
    }

    const handleCardClick = (stepName: string): void => {
        setStep(stepName)
        console.log(`Clicked on step: ${stepName}`);
    };

    const handleCloseOverlay = (): void => {
        setStep("")
        handleLoad()
    }

    const getOnboadingInformation = async (): Promise<void> => {
        try {
            const token = getAccessToken();
            if (!token) {
                setError("User is not authenticated");
                return;
            }
            const tokenPayload = parseJwt(token);
            const onboardingId = tokenPayload.id

            const data = await getSingleOnboardingCandidate(onboardingId, token);
            setOnboardingInfo(data);

        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred while loading onboarding candidates');
        } finally {
            setLoad(false);
        }
    };

    const isDocumentCompleted = (doc: Document | undefined): boolean => {
        return doc !== undefined && !isEmpty(doc) && doc.documentStatus === "COMPLETED";
    };

    const getStepProgress = (stepName: StepName): string => {
        if (!onboardingInfo || onboardingInfo.length === 0) {
            return "0/0";
        }

        const stepData = onboardingInfo[0][stepMapping[stepName] as keyof OnboardingData] as OnboardingDocument;

        if (!stepData) {
            return "0/0";
        }

        if (stepName === "E-Signature") {
            if (!stepData.documents) return "0/1";
            return (stepData.documents as Document).documentStatus === "COMPLETED" ? "1/1" : "0/1";
        }

        if (stepName === "Direct Deposit") {
            return isEmpty(stepData) ? "0/1" : "1/1";
        }

        if (stepData.documents && Array.isArray(stepData.documents)) {
            const totalRequired = getRequiredDocumentsCount(stepName);
            const completedDocs = stepData.documents
                .slice(0, totalRequired)
                .filter(isDocumentCompleted).length;
            return `${completedDocs}/${totalRequired}`;
        }

        return isEmpty(stepData) ? "0/1" : "1/1";
    };

    const checkStatus = (stepName: StepName): DocumentStatus => {
        if (!onboardingInfo || onboardingInfo.length === 0) {
            return "NOT_STARTED";
        }

        const signatureData = onboardingInfo[0][stepMapping["E-Signature"] as keyof OnboardingData] as { documents: Document };
        const isSignatureCompleted = signatureData?.documents?.documentStatus === "COMPLETED";

        if (stepName === "E-Signature") {
            if (!signatureData?.documents) return "NOT_STARTED";
            return signatureData.documents.documentStatus === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS";
        }

        if (!isSignatureCompleted) {
            return "DISABLED";
        }

        const currentStepIndex = onboardingSteps.indexOf(stepName);

        for (let i = 1; i < currentStepIndex; i++) {
            const previousStep = onboardingSteps[i] as StepName;
            const previousStepData = onboardingInfo[0][stepMapping[previousStep] as keyof OnboardingData] as OnboardingDocument;

            if (!previousStepData) {
                return "DISABLED";
            }

            if (previousStepData.documents && Array.isArray(previousStepData.documents)) {
                const requiredDocs = getRequiredDocumentsCount(previousStep);
                const completedDocs = previousStepData.documents
                    .slice(0, requiredDocs)
                    .filter(isDocumentCompleted).length;

                if (completedDocs < requiredDocs) {
                    return "DISABLED";
                }
            }
        }

        const stepData = onboardingInfo[0][stepMapping[stepName] as keyof OnboardingData] as OnboardingDocument;

        if (!stepData) {
            return "NOT_STARTED";
        }

        if (stepData.documents && Array.isArray(stepData.documents)) {
            const requiredDocs = getRequiredDocumentsCount(stepName);
            const completedDocs = stepData.documents
                .slice(0, requiredDocs)
                .filter(isDocumentCompleted).length;

            if (completedDocs === 0) {
                return "NOT_STARTED";
            } else if (completedDocs === requiredDocs) {
                return "COMPLETED";
            } else {
                return "IN_PROGRESS";
            }
        }

        return isEmpty(stepData) ? "NOT_STARTED" : "COMPLETED";
    };

    const getRequiredDocumentsCount = (stepName: StepName): number => {
        switch (stepName) {
            case "Personal Information":
                return 2;
            case "Additional Documents":
                return 15;
            case "Test/Certifications":
                return 5;
            case "Tax Withholding":
                return 1;
            default:
                return 1;
        }
    };

    useEffect(() => {
        getOnboadingInformation()
    }, [load])

    return (
        <div className='flex items-center flex-col'>
            <div className="w-max">
                <div className="mb-6 text-center sm:text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold">Onboarding Steps</h2>
                    <p className="text-sm text-gray-500">
                        Please complete each step to finish your onboarding process.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center w-max p-6 bg-white rounded-lg shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {onboardingSteps.map((stepName, index) => (
                        <StepCard
                            key={index}
                            step={stepName}
                            status={checkStatus(stepName)}
                            progress={getStepProgress(stepName)}
                            onClick={() => handleCardClick(stepName)}
                        />
                    ))}
                </div>
            </div>

            {step && (
                <OverlayModal
                    step={step}
                    onClose={handleCloseOverlay}
                />
            )}
        </div>
    )
}