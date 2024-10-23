'use client';

import React, { useEffect, useState } from 'react';
import DirectDepositForm from './DirectDeposit/DirectDepositForm';
import AgreementForm from './DirectDeposit/AgreementForm';
import { DirectDeposit, TaxWithholding } from '@/types/onboardingTypes';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { getAccessToken } from '@/data/cookies';
import { editDirectDeposit, editTaxWithholding, getDirectDeposit, getTaxWithholding, saveDirectDeposit, saveTaxWithholding, submitDirectDeposit, submitTaxWithholding } from '@/data/onboarding';
import dynamic from 'next/dynamic';
import TaxWithholdingForm from './TaxWithholding/TaxWithholdingForm';
import TaxWithholdingReview from './TaxWithholding/TaxWithholdingReview';

const FilePreview = dynamic(() => import('./FilePreview'), { ssr: false });

const TaxWithholdingProcess = ({ onClose }: { onClose: () => void }) => {
    const [loading, setLoading] = useState(false);
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [step, setStep] = useState<number>(1);
    const [taxWithholdingPdf, setTaxWithholdingPdf] = useState('')
    const [taxWithholdingStatus, setTaxWithholdingStatus] = useState('')
    const [taxWithholding, setTaxWithholding] = useState<TaxWithholding>({
        homeAddress: '',
        homeAddressLineTwo: '',
        city: '',
        state: '',
        zipCode: '',
        socialSecurityNumber: ''
    });
    const [load, setLoad] = useState(false)

    const handleLoad = () => {
        setLoad(!load)
    }

    const handleChangeStep = (step: number) => {
        setStep(step)
    }

    const getTaxWithholdingInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const taxWithholdingInformation = await getTaxWithholding(token)

            setTaxWithholding(taxWithholdingInformation.taxWithholdInfo)
            setTaxWithholdingPdf(taxWithholdingInformation.documentUrl)
            setTaxWithholdingStatus(taxWithholdingInformation.documentStatus)

            if (step === 1 && taxWithholdingInformation.documentStatus === "COMPLETED") {
                setStep(2)
            }

        } catch (err: any) {
            if (err.message === "User doesn not  have a document. Please start the process") {
            } else {
                setError(err.message || "Failed to get tax withholding information");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTaxWithholdingInfo()
    }, [load])

    const handleTaxWithholdingSave = async (data: TaxWithholding) => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await saveTaxWithholding(data, token)

            setTaxWithholding(data)

            setSuccess("Tax withholding saved")
            handleLoad()
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to get tax withholding");
        } finally {
            setLoading(false);
        }
    };

    const handleTaxWithholdingEdit = async (data: TaxWithholding) => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await editTaxWithholding(data, token)

            setTaxWithholding(data)
            setSuccess("Tax withholding updated")
            handleLoad()
            setStep(2);
        } catch (err: any) {
            setError(err.message || "Failed to get Tax withholding");
        } finally {
            setLoading(false);
        }
    };

    const handleTaxWithholdingNext = () => {
        setStep(2)
    }

    const handleTaxWithholdingSubmit = async () => {
        setLoading(true)
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await submitTaxWithholding(taxWithholding, token)

            setSuccess("Tax withholding submitted successfully");
            handleLoad()
            onClose()
        } catch (err: any) {
            setError(err.message || "Failed to save Tax withholding");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            {step === 1 && (
                <TaxWithholdingForm
                    taxWithholding={taxWithholding}
                    onSave={handleTaxWithholdingSave}
                    onEdit={handleTaxWithholdingEdit}
                    onNext={handleTaxWithholdingNext}
                    onClose={onClose}
                    loading={loading}
                />
            )}

            {step === 2 && (
                <TaxWithholdingReview
                    onClose={onClose}
                    documentStatus={taxWithholdingStatus}
                    handleTaxWithholdingSubmit={handleTaxWithholdingSubmit}
                    handleChangeStep={handleChangeStep}
                    onNext={() => {
                        onClose()
                        handleLoad()
                    }}
                    loading={loading}
                />
            )}

            {step === 3 && (
                <FilePreview onClose={onClose} handleChangeStep={() => handleChangeStep(2)} pdfUrl={taxWithholdingPdf} />
            )}
        </div>
    );
};

export default TaxWithholdingProcess;
