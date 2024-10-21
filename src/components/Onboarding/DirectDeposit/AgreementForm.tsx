'use client';

import { useEffect, useState } from 'react';
import SignatureSection from '../ESignature/SignatureSection';
import { useError } from '@/context/ErrorContext';
import { DirectDeposit } from '@/types/onboardingTypes';
import { getAccessToken } from '@/data/cookies';
import { getDirectDeposit } from '@/data/onboarding';
import { Oval } from 'react-loader-spinner';

interface ReviewFormProps {
    handleChangeStep: (step: number) => void;
    onNext: () => void,
    documentStatus: string,
    handleDirectDepositSubmit: () => void;
    onClose: () => void;
    loading: boolean
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onNext, documentStatus, handleChangeStep, handleDirectDepositSubmit, onClose, loading }) => {
    const { setError } = useError();
    const [agreed, setAgreed] = useState<boolean>(false);
    const [directDeposit, setDirectDeposit] = useState<DirectDeposit>({
        financialInstitution: '',
        routingNumber: '',
        accountNumber: '',
        allocateFundsMethod: '',
        accountType: ''
    });

    const getDirectDepositInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const directDepositInformation = await getDirectDeposit(token)

            setDirectDeposit(directDepositInformation.directDepositInfo)

        } catch (err: any) {
            setError(err.message || "Failed to get direct deposit information");
        }
    }

    useEffect(() => {
        getDirectDepositInfo()
    }, [])

    const handleAgreed = (value: boolean) => setAgreed(value);

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-3">Review Direct Deposit Information</h2>

            <div className="border px-4 py-8 rounded-md divide-y divide-gray-300">
                <div className="flex flex-col gap-12">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <strong>Financial Institution:</strong>
                            <p className="text-gray-700">{directDeposit.financialInstitution}</p>
                        </div>
                        <div>
                            <strong>Routing Number:</strong>
                            <p className="text-gray-700">{directDeposit.routingNumber}</p>
                        </div>
                        <div>
                            <strong>Account Number:</strong>
                            <p className="text-gray-700">{directDeposit.accountNumber}</p>
                        </div>
                        <div>
                            <strong>Fund Allocation:</strong>
                            <p className="text-gray-700">{directDeposit.allocateFundsMethod}</p>
                        </div>
                        <div>
                            <strong>Account Type:</strong>
                            <p className="text-gray-700">{directDeposit.accountType}</p>
                        </div>
                    </div>

                    <button className=' border-[0.1rem] border-primary py-2 rounded-md' onClick={() => handleChangeStep(3)}>Preview document</button>

                </div>
            </div>

            {/* Agreement Section */}
            <div className="border p-4 rounded-md bg-lightBlue">
                <p className='text-gray-600'>
                    <strong className='text-black'>By electronically signing this form, I have read and understand the
                        following statements:</strong> <br /><br />
                    I understand that I must submit a new direct deposit authorization form if I
                    change banks and/or accounts.<br /><br />
                    I authorize [Company Name] to deposit my wages/salary to the financial
                    institution(s) and account(s) named above.<br /><br />
                    I also authorize my financial institution(s) and [Company Name] to make
                    appropriate adjustments if an incorrect deposit is made. <br /><br />
                    [Company Name] is authorized to terminate this agreement without notice if legally obligated to withhold any part of my salary.
                </p>
            </div>

            {documentStatus != "COMPLETED" &&
                <div className="border p-4 rounded-md bg-lightBlue">
                    <SignatureSection
                        isAgreed={agreed}
                        setIsAgreed={handleAgreed}
                    />
                </div>
            }

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

                    {documentStatus === "COMPLETED" ?
                        <button
                            onClick={onNext}
                            className={`bg-primary text-white px-3 py-2 rounded-md`}
                        >
                            Next
                        </button>
                        :
                        <button
                            onClick={handleDirectDepositSubmit}
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
                    }
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
