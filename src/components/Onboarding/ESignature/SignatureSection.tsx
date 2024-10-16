"use client"

import LoadingPage from '@/components/Dashboard/LoadingPage';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { getAccessToken } from '@/data/cookies';
import { getSignature } from '@/data/onboarding';
import React, { useEffect, useState } from 'react'

export default function SignatureSection({ isAgreed, setIsAgreed }: { isAgreed: boolean, setIsAgreed: (value: boolean) => void }) {
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [signature, setSignature] = useState("")
    const [loading, setLoading] = useState(false);

    const handleGetSignature = async () => {
        setLoading(true);

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const signatureUrl = await getSignature(token)

            setSignature(signatureUrl.hiredCandidateSignature)
        } catch (err: any) {
            setError(err.message || "Failed to load signature");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetSignature()
    }, [])

    return (
        <div className='flex flex-col items-center justify-center gap-2'>
            <div>
                <p className='text-sm'>
                    I understand that by clicking on &apos;I Agree&apos; and clicking on the submit button, that I am electronically signing the above document. I understand that my electronic signature will be binding as though I had physically signed these documents by hand. I agree that
                    a printout of this agreement may be accepted with the same authority as the original.
                    By clicking &apos;I Agree&apos;, I understand that my previous electronic signature will be applied
                </p>
            </div>
            {/* Agreement Selection */}
            <div className="flex gap-2">
                <div>
                    <label className="mr-2">
                        <input
                            type="radio"
                            name="agreement"
                            value="agree"
                            checked={isAgreed === true}
                            onChange={() => setIsAgreed(true)}
                            className="mr-1"
                        />
                        I Agree
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="agreement"
                            value="disagree"
                            checked={isAgreed === false}
                            onChange={() => setIsAgreed(false)}
                            className="mr-1"
                        />
                        I Do Not Agree
                    </label>
                </div>
            </div>

            {isAgreed === true &&
                <div className='w-full flex items-center justify-center'>
                    <img src={signature} alt="signature" className='flex items-center justify-center' />
                </div>
            }
        </div>
    )
}
