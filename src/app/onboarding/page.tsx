'use client'; // Enable client-side rendering

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, parseJwt } from '@/data/cookies';
import LoadingPage from '@/components/Dashboard/LoadingPage';
import { useOnboardingLogout } from '@/data/onboarding';
import { MdLogout } from 'react-icons/md';
import { Onboarding } from '@/components/Onboarding/Onboarding';
import { QualificationDocuments } from '@/components/Documents/QualificationDocuments';
import { documentTypeMapping, qualificationDocumentsSteps } from '@/data/constants';
import { getQualificationDocument } from '@/data/qualificationDocuments';
import { useError } from '@/context/ErrorContext';

const OnboardingStepsPage: React.FC = () => {
    const [step, setStep] = useState(1)
    const [documentStatus, setDocumentStatus] = useState<string>('NOT_STARTED');
    const handleLogout = useOnboardingLogout();
    const { setError } = useError();
    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const fetchDocumentStatuses = async () => {
        try {
            const token = getAccessToken();
            if (!token) return;

            let overallStatus = 'NOT_STARTED';
            for (const step of qualificationDocumentsSteps) {
                const mappedType = documentTypeMapping[step];
                if (mappedType) {
                    const response = await getQualificationDocument(mappedType, token);
                    overallStatus = response.overallDocumentStatus || 'NOT_STARTED';

                    // Exit early if a step is 'NOT_STARTED'
                    if (overallStatus !== 'ON_TRACK' && overallStatus !== 'COMPLETED') {
                        setDocumentStatus(overallStatus);
                        return;
                    }
                }
            }

            setDocumentStatus(overallStatus);
        } catch (error: any) {
            setError(error.message || 'Failed to fetch document statuses.');
        }
    };

    useEffect(() => {
        fetchDocumentStatuses()
    }, [])

    useEffect(() => {
        if (documentStatus === "COMPLETED") {
            setStep(2)
        }

        setLoading(false)
    }, [documentStatus])


    useEffect(() => {
        const accessToken = getAccessToken();

        // If there is no accessToken or it's invalid, redirect to the sign-in page
        if (accessToken) {
            const tokenPayload = parseJwt(accessToken);

            if (!tokenPayload) {
                throw new Error("Invalid token. Please try again.");
            }

            if (tokenPayload.role === 'Admin' || tokenPayload.role === 'User') {
                router.push("/dashboard/jobs")
            } else {
                router.push("/onboarding");
            }

        } else {
            router.push("/onboarding/sign-in");
        }

    }, [router]);

    if (loading) {
        return (
            <LoadingPage loading={loading} />
        );
    }

    const handleNextStep = () => {
        setStep(2)
    }

    return (
        <main className="flex flex-col w-full gap-8 min-h-screen items-center justify-center py-16 px-4 sm:px-8">

            {step === 1 &&
                <QualificationDocuments handleNextStep={handleNextStep} />
            }

            {step === 2 &&
                <Onboarding />
            }

            {/* Logout Button */}
            <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 text-red-500 hover:text-red-900">
                <MdLogout className="text-red-500 hover:text-red-900" size={20} />
                Logout
            </button>
        </main>

    );
};

export default OnboardingStepsPage;
