'use client';

import { useEffect, useState } from 'react';
import SignatureSection from '../ESignature/SignatureSection';
import { useError } from '@/context/ErrorContext';
import { TaxWithholding } from '@/types/onboardingTypes'; // Adjust the path as necessary
import { getAccessToken } from '@/data/cookies';
import { getTaxWithholding } from '@/data/onboarding';
import { Oval } from 'react-loader-spinner';

interface TaxWithholdingReviewProps {
    handleChangeStep: (step: number) => void;
    onNext: () => void;
    documentStatus: string;
    handleTaxWithholdingSubmit: () => void;
    onClose: () => void;
    loading: boolean;
}

const TaxWithholdingReview: React.FC<TaxWithholdingReviewProps> = ({
    onNext,
    documentStatus,
    handleChangeStep,
    handleTaxWithholdingSubmit,
    onClose,
    loading
}) => {
    const { setError } = useError();
    const [agreed, setAgreed] = useState<boolean>(false);
    const [taxWithholding, setTaxWithholding] = useState<TaxWithholding>({
        homeAddress: '',
        homeAddressLineTwo: '',
        city: '',
        state: '',
        zipCode: '',
        socialSecurityNumber: ''
    });

    const getTaxWithholdingInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const taxWithholdingInformation = await getTaxWithholding(token);
            setTaxWithholding(taxWithholdingInformation.taxWithholdInfo);
        } catch (err: any) {
            setError(err.message || "Failed to get tax withholding information");
        }
    };

    useEffect(() => {
        getTaxWithholdingInfo();
    }, []);

    const handleAgreed = (value: boolean) => setAgreed(value);

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Review Tax Withholding Information</h2>

            <div className="border px-4 py-8 rounded-md divide-y divide-gray-300">
                <div className="flex flex-col gap-12">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Home Address:</strong>
                            <p className="text-gray-700">{taxWithholding?.homeAddress}</p>
                        </div>
                        <div>
                            <strong>Home Address Line Two:</strong>
                            <p className="text-gray-700">{taxWithholding?.homeAddressLineTwo}</p>
                        </div>
                        <div>
                            <strong>City:</strong>
                            <p className="text-gray-700">{taxWithholding?.city}</p>
                        </div>
                        <div>
                            <strong>State:</strong>
                            <p className="text-gray-700">{taxWithholding?.state}</p>
                        </div>
                        <div>
                            <strong>Zip Code:</strong>
                            <p className="text-gray-700">{taxWithholding?.zipCode}</p>
                        </div>
                        <div>
                            <strong>Social Security Number:</strong>
                            <p className="text-gray-700">{taxWithholding?.socialSecurityNumber}</p>
                        </div>
                    </div>

                    <button className='border-[0.1rem] border-primary py-2 rounded-md' onClick={() => handleChangeStep(3)}>Preview document</button>
                </div>
            </div>

            {/* Agreement Section */}
            <div className="border p-4 rounded-md bg-lightBlue">
                <p className='text-gray-600'>
                    <strong className='text-black'>By electronically signing this form, I have read and understand the following statements:</strong> <br /><br />
                    I understand that I must submit a new tax withholding authorization form if I change my address or personal information.<br /><br />
                    I authorize [Company Name] to withhold taxes according to the information provided above.<br /><br />
                    I also authorize my financial institution(s) and [Company Name] to make appropriate adjustments if an incorrect withholding is made.
                </p>
            </div>

            {documentStatus !== "COMPLETED" && (
                <div className="border p-4 rounded-md bg-lightBlue">
                    <SignatureSection
                        isAgreed={agreed}
                        setIsAgreed={handleAgreed}
                    />
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Cancel
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => handleChangeStep(1)}
                        className="bg-gray-300 text-black px-4 py-2 rounded-md"
                    >
                        Edit
                    </button>

                    {documentStatus === "COMPLETED" ? (
                        <button
                            onClick={onNext}
                            className={`bg-primary text-white px-3 py-2 rounded-md`}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleTaxWithholdingSubmit}
                            className={`flex gap-2 items-center justify-center bg-primary text-white px-3 py-2 rounded-md ${!agreed || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!agreed}
                        >
                            {loading && <Oval
                                visible={true}
                                height="14"
                                width="14"
                                color="#ffffff"
                                secondaryColor="#ffffff"
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass="flex items-center justify-center"
                            />}
                            <p>{loading ? "Submitting..." : "Submit"}</p>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaxWithholdingReview;
