'use client'

import { useEffect, useState, useMemo } from "react";
import 'react-quill/dist/quill.snow.css';
import { useFormData } from '@/context/FormDataContext'; // Import the context hook
import dynamic from "next/dynamic";

export default function JobDescription({ handleChangeStep, handleActiveSteps }: { handleChangeStep: (step: number) => void, handleActiveSteps: (steps: number) => void }) {
    const { formData, setFormData } = useFormData()!;
    const [error, setError] = useState<string | null>(null); // State for validation error
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill'), { ssr: false }), []);
    const [changed, setChanged] = useState(false);

    const handleDescriptionChange = (value: string) => {
        setFormData((prev: any) => ({ ...prev, description: value })); // Update context state
        setError(null); // Reset error when user starts typing
        if (value.trim().replace(/<\/?p>/g, "") === "<br>") {
            handleActiveSteps(1)
        } else {
            handleActiveSteps(2)
        }

        setChanged(true)
    };

    useEffect(() => {
        if (formData.description.trim().replace(/<\/?p>/g, "") === "<br>" || formData.description.trim() === "") {
            handleActiveSteps(1)
        } else {
            handleActiveSteps(2)
        }
    }, [])

    const handleSave = () => {
        // Validation: Ensure description is not empty
        console.log(formData.description)
        if (formData.description.trim().replace(/<\/?p>/g, "") === "<br>") {
            setError("Description cannot be empty.");
            return;
        }

        // Proceed to next step
        handleChangeStep(3)
    };

    const handlePrevious = () => {
        handleChangeStep(1)
    }

    return (
        <>
            <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Job Description</h2>
                    <p className="text-grey">Detailed description of the job</p>
                </div>
                <ReactQuill
                    theme="snow"
                    value={formData.description} // Use context state value
                    onChange={handleDescriptionChange}
                    style={{ height: '10rem', marginBottom: '3rem' }}
                />
                {error && changed && <span className="text-red-500 text-sm">{error}</span>}
            </section>

            <section className="flex items-end justify-end">
                <div className="flex gap-4">
                    <button onClick={handlePrevious} className="flex gap-2 items-center border-2 border-primary px-4 py-2 hover:border-[0.1rem] text-primary text-sm font-bold rounded-md">
                        <p>Previous Step</p>
                    </button>
                    <button
                        className="flex gap-2 items-center bg-primary border-2 border-primary px-4 py-2 hover:bg-opacity-90 text-white text-sm font-bold rounded-md"
                        onClick={handleSave}
                    >
                        <p>Save & Preview</p>
                    </button>
                </div>
            </section>
        </>
    );
}
