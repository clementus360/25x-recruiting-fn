'use client'; // Enable client-side rendering

import React, { useEffect, useState } from 'react';
import StepCard from '@/components/Onboarding/StepCard';
import { onboardingSteps } from '@/data/constants'; // Importing steps from constants
import OverlayModal from '@/components/Onboarding/StepOverlay';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/data/cookies';
import LoadingPage from '@/components/Dashboard/LoadingPage';
import { useOnboardingLogout } from '@/data/onboarding';
import { MdLogout } from 'react-icons/md';

const OnboardingStepsPage: React.FC = () => {
    const handleLogout = useOnboardingLogout();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState("")

    const handleCardClick = (stepName: string) => {
        setStep(stepName)
        console.log(`Clicked on step: ${stepName}`);
    };

    const handleCloseOverlay = () => {
        setStep("")
    }

    useEffect(() => {
        const accessToken = getAccessToken();

        // If there is no accessToken or it's invalid, redirect to the sign-in page
        if (accessToken) {
            router.push("/onboarding");
            setIsLoading(false)
        } else {
            router.push("/onboarding/sign-in");
        }

    }, [router]);

    if (isLoading) {
        return (
            <LoadingPage loading={isLoading} />
        );
    }

    return (
        <main className="flex flex-col w-full gap-8 min-h-screen items-center justify-center py-16 px-4 sm:px-8">
            <div className="w-max">
                <div className="mb-6 text-center sm:text-center">
                    <h2 className="text-3xl sm:text-4xl font-semibold">Onboarding Steps</h2>
                    <p className="text-sm text-gray-500">
                        Please complete each step to finish your onboarding process.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center w-max p-6 bg-white rounded-lg shadow-lg">
                {/* Responsive Step Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {onboardingSteps.map((stepName, index) => (
                        <StepCard
                            key={index}
                            step={stepName}
                            onClick={() => handleCardClick(stepName)}
                        />
                    ))}
                </div>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 text-red-500 hover:text-red-900">
                <MdLogout className="text-red-500 hover:text-red-900" size={20} />
                Logout
            </button>

            {/* Overlay Modal for Steps */}
            {step && (
                <OverlayModal
                    step={step}
                    onClose={handleCloseOverlay}
                />
            )}
        </main>

    );
};

export default OnboardingStepsPage;
