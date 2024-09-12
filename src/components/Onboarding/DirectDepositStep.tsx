"use client";

import React, { useState } from 'react';
import DirectDepositForm from './DirectDeposit/DirectDepositForm';
import AgreementForm from './DirectDeposit/AgreementForm';

const OnboardingFlow= ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState<'directDeposit' | 'agreement'>('directDeposit');
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleDirectDepositSubmit = (data: Record<string, string>) => {
    // Save the form data and move to the next step
    setFormData(data);
    setCurrentStep('agreement');
  };

  const handleAgree = () => {
    // Logic to handle what happens after the user agrees
    console.log('User agreed to the terms.');
    // Perform further actions such as saving data or moving to the next process.
  };

  return (
    <div className="flex flex-col items-center p-4">
      {currentStep === 'directDeposit' && (
        <DirectDepositForm onClose={onClose} onSubmit={handleDirectDepositSubmit} />
      )}

      {currentStep === 'agreement' && (
        <AgreementForm onClose={onClose} onAgree={handleAgree} />
      )}
    </div>
  );
};

export default OnboardingFlow;
