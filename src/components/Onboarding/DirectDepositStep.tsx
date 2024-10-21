'use client';

import React, { useEffect, useState } from 'react';
import DirectDepositForm from './DirectDeposit/DirectDepositForm';
import AgreementForm from './DirectDeposit/AgreementForm';
import { DirectDeposit } from '@/types/onboardingTypes';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { getAccessToken } from '@/data/cookies';
import { editDirectDeposit, getDirectDeposit, saveDirectDeposit, submitDirectDeposit } from '@/data/onboarding';
import dynamic from 'next/dynamic';

const FilePreview = dynamic(() => import('./FilePreview'), { ssr: false });

const DirectDepositProcess = ({ onClose }: { onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { setError } = useError();
  const { setSuccess } = useSuccess();
  const [step, setStep] = useState<number>(1);
  const [directDepositPdf, setDirectDepositPdf] = useState('')
  const [directDepositStatus, setDirectDepositStatus] = useState('')
  const [directDeposit, setDirectDeposit] = useState<DirectDeposit>({
    financialInstitution: '',
    routingNumber: '',
    accountNumber: '',
    allocateFundsMethod: '',
    accountType: ''
  });
  const [load, setLoad] = useState(false)

  const handleLoad = () => {
    setLoad(!load)
  }

  const handleChangeStep = (step: number) => {
    setStep(step)
  }

  const getDirectDepositInfo = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        return;
      }

      const directDepositInformation = await getDirectDeposit(token)

      setDirectDeposit(directDepositInformation.directDepositInfo)
      setDirectDepositPdf(directDepositInformation.documentUrl)
      setDirectDepositStatus(directDepositInformation.documentStatus)

      if (step === 1 && directDepositInformation.documentStatus === "COMPLETED") {
        setStep(2)
      }

    } catch (err: any) {
      if (err.message === "User doesn not  have a document. Please start the process") {
      } else {
        setError(err.message || "Failed to get direct deposit information");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getDirectDepositInfo()
  }, [load])

  const handleDirectDepositSave = async (data: DirectDeposit) => {
    setLoading(true)
    try {
      const token = getAccessToken();
      if (!token) {
        return;
      }

      await saveDirectDeposit(data, token)

      setDirectDeposit(data)

      setSuccess("Direct deposit saved")
      handleLoad()
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to get direct deposit");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDepositEdit = async (data: DirectDeposit) => {
    setLoading(true)
    try {
      const token = getAccessToken();
      if (!token) {
        return;
      }

      await editDirectDeposit(data, token)

      setDirectDeposit(data)
      setSuccess("Direct deposit updated")
      handleLoad()
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to get direct deposit");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDepositNext = () => {
    setStep(2)
  }

  const handleDirectDepositSubmit = async () => {
    setLoading(true)
    try {
      const token = getAccessToken();
      if (!token) {
        return;
      }

      await submitDirectDeposit(directDeposit, token)

      setSuccess("Direct deposit submitted successfully");
      handleLoad()
      onClose()
    } catch (err: any) {
      setError(err.message || "Failed to save Direct deposit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {step === 1 && (
        <DirectDepositForm
          directDeposit={directDeposit}
          onSave={handleDirectDepositSave}
          onEdit={handleDirectDepositEdit}
          onNext={handleDirectDepositNext}
          onClose={onClose}
          loading={loading}
        />
      )}

      {step === 2 && (
        <AgreementForm
          onClose={onClose}
          documentStatus={directDepositStatus}
          handleDirectDepositSubmit={handleDirectDepositSubmit}
          handleChangeStep={handleChangeStep}
          onNext={() => {
            onClose()
            handleLoad()
          }}
          loading={loading}
        />
      )}

      {step === 3 && (
        <FilePreview onClose={onClose} handleChangeStep={() => handleChangeStep(2)} pdfUrl={directDepositPdf} />
      )}
    </div>
  );
};

export default DirectDepositProcess;
