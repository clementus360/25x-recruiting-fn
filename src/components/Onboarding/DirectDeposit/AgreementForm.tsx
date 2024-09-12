"use client";

import React, { useState } from 'react';

interface AgreementFormProps {
    onClose: () => void;
    onAgree: () => void; // Callback when the user agrees
}

const AgreementForm: React.FC<AgreementFormProps> = ({ onClose, onAgree }) => {
    const [isAgreed, setIsAgreed] = useState<boolean | null>(null);

    const handleAgree = () => {
        if (isAgreed) {
            onAgree(); // Proceed if agreed
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4 max-w-4xl mx-auto">
            {/* Agreement Text */}
            <div className="border p-4 text-sm text-gray-600 w-full">
                <p>
                    You have been authorized to complete online documents in connection with either your employment or contractor agreement and receive legal notices electronically. During this process, you will be asked to "sign" one or more online documents with an electronic signature. Please read the following carefully regarding the electronic signature/notice process.
                </p>
            </div>

            {/* Agreement Options */}
            <div className="flex gap-4 mt-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="agreement"
                        value="agree"
                        checked={isAgreed === true}
                        onChange={() => setIsAgreed(true)}
                        className="mr-2"
                    />
                    I Agree
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="agreement"
                        value="disagree"
                        checked={isAgreed === false}
                        onChange={() => setIsAgreed(false)}
                        className="mr-2"
                    />
                    I Do Not Agree
                </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAgree}
                    disabled={isAgreed === null}
                    className={`px-4 py-2 rounded-md ${isAgreed === null
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-500 text-white'
                        }`}
                >
                    Continue
                </button>
            </div>

            {/* Warning if user disagrees */}
            {isAgreed === false && (
                <div className="text-red-500 mt-4">
                    You must agree to continue with the onboarding process.
                </div>
            )}
        </div>
    );
};

export default AgreementForm;
