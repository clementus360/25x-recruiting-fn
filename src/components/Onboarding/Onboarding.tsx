import React, { useState } from 'react'
import StepCard from './StepCard'
import { onboardingSteps } from '@/data/constants'
import OverlayModal from './StepOverlay'

export const Onboarding = () => {
    const [step, setStep] = useState("")
    const [load, setLoad] = useState(false)

    const handleLoad = () => {
        setLoad(!load)
    }

    const handleCardClick = (stepName: string) => {
        setStep(stepName)
        console.log(`Clicked on step: ${stepName}`);
    };

    const handleCloseOverlay = () => {
        setStep("")
    }

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
                {/* Responsive Step Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                    {onboardingSteps.map((stepName, index) => (
                        <StepCard
                            key={index}
                            step={stepName}
                            status={"ON_TRACK"}
                            progress={"1/2"}
                            onClick={() => handleCardClick(stepName)}
                        />
                    ))}
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
    )
}
