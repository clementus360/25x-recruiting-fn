'use client'

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { AddJobSteps } from "@/data/constants";

const JobDetails = dynamic(() => import("@/components/Dashboard/Jobs/AddJob/JobDetails"), { ssr: false })
const JobDescription = dynamic(() => import("@/components/Dashboard/Jobs/AddJob/JobDescription"), { ssr: false })
const JobPreview = dynamic(() => import("@/components/Dashboard/Jobs/AddJob/JobPreview"), { ssr: false })

import { FormDataProvider } from "@/context/FormDataContext";

export default function AddJob() {
    const [currentStep, setCurrentStep] = useState(1)
    const [activeSteps, setActiveSteps] = useState(0);
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleActiveSteps = (steps: number) => {
        setActiveSteps(steps)
    }

    const handleChangeStep = (step: number) => {
        setCurrentStep(step)
    }

    if (!isClient) {
        return
    }

    return (
        <FormDataProvider>
            <div className="flex flex-col justify-between gap-8 w-full lg:pl-24 lg:pr-16">
                {/* Page contents will appear here */}

                <section className="relative flex gap-4 items-center justify-center">
                    {AddJobSteps.map((step, idx) => (
                        <>
                            <div key={idx} className="flex flex-col gap-2 items-center justify-center">
                                <button disabled={idx > activeSteps} onClick={() => {
                                    handleChangeStep(step.id)
                                }}
                                    className={`text-xl disabled:border-grey disabled:text-grey ${currentStep === step.id ? `bg-primary text-white` : 'border-2 border-primary'} w-12 aspect-square rounded-full`}
                                >
                                    {step.id}
                                </button>
                                <p>{step.title}</p>
                            </div>
                            {idx < AddJobSteps.length - 1 && <div className="mb-8 w-16 h-[0.1rem] bg-grey"></div>}
                        </>
                    ))}
                </section>

                {currentStep === 1 &&
                    <JobDetails handleActiveSteps={handleActiveSteps}  handleChangeStep={handleChangeStep}/>
                }
                {currentStep === 2 &&
                    <JobDescription handleActiveSteps={handleActiveSteps} handleChangeStep={handleChangeStep} />
                }
                {currentStep === 3 &&
                    <JobPreview />
                }
            </div>
        </FormDataProvider>
    );
}
