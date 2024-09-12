'use client'; // Enable client-side rendering

import React, { useState } from 'react';
import StepCard from '@/components/Onboarding/StepCard';
import { onboardingSteps } from '@/data/constants'; // Importing steps from constants
import OverlayModal from '@/components/Onboarding/StepOverlay';

const OnboardingStepsPage: React.FC = () => {
    const [step, setStep] = useState("")
    const handleCardClick = (stepName: string) => {
        setStep(stepName)
        console.log(`Clicked on step: ${stepName}`);
    };

    const handleCloseOverlay = () => {
        setStep("")
    }

    return (
        <main className="flex flex-col min-h-screen items-center justify-center py-16">
            <div className="w-full max-w-4xl">
                <div className="mb-6">
                    <h2 className="text-4xl font-semibold">Onboarding Steps</h2>
                    <p className="text-sm text-grey">Please complete each step to finish your onboarding process.</p>
                </div>
            </div>
            <div className="flex flex-col items-center w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg">
                {/* Step Cards */}
                <div className="grid grid-cols-4 gap-4">
                    {onboardingSteps.map((stepName, index) => (
                        <StepCard
                            key={index}
                            step={stepName} // Pass step name and an empty documents array
                            onClick={() => handleCardClick(stepName)} // Click handler (could be customized)
                        />
                    ))}
                </div>
            </div>

            {step &&
                <OverlayModal
                    step={step}
                    onClose={handleCloseOverlay}
                />
            }
        </main>
    );
};

export default OnboardingStepsPage;
