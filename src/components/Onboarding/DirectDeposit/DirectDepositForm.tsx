'use client';

import React, { useState, useEffect } from 'react';
import Select from '@/components/Select'; // Adjust the path
import { DirectDeposit } from '@/types/onboardingTypes';

interface DirectDepositFormProps {
  directDeposit: DirectDeposit,
  onSave: (formData: DirectDeposit) => void;
  onEdit: (formData: DirectDeposit) => void;
  onNext: () => void;
  onClose: () => void;
}

const DirectDepositForm: React.FC<DirectDepositFormProps> = ({ directDeposit, onSave, onEdit, onNext, onClose }) => {
  const [formData, setFormData] = useState<DirectDeposit>(directDeposit);
  const [initialData, setInitialData] = useState<DirectDeposit>(directDeposit);
  const [errors, setErrors] = useState({
    financialInstitution: '',
    routingNumber: '',
    accountNumber: '',
    allocateFundsMethod: '',
    accountType: ''
  });
  const [touched, setTouched] = useState({
    financialInstitution: false,
    routingNumber: false,
    accountNumber: false,
    allocateFundsMethod: false,
    accountType: false
  });

  useEffect(() => {
    validate();
  }, [formData]);

  useEffect(() => {
    setFormData(directDeposit)
    setInitialData(directDeposit)
    validate()
  }, [directDeposit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.financialInstitution) newErrors.financialInstitution = 'Financial Institution is required';
    if (!formData.routingNumber) {
      newErrors.routingNumber = 'Routing Number is required';
    } else if (!/^\d+$/.test(formData.routingNumber)) {
      newErrors.routingNumber = 'Invalid Routing Number format';
    }
    if (!formData.accountNumber) newErrors.accountNumber = 'Account Number is required';
    if (!formData.allocateFundsMethod) newErrors.fundAllocation = 'Fund Allocation is required';
    if (!formData.accountType) newErrors.accountType = 'Account Type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      const isEmptyForm = Object.keys(initialData).every(key => !initialData[key as keyof DirectDeposit]);

      if (isEmptyForm) {
        onSave(formData);
      } else {
        const isSameAsInitial = Object.keys(formData).every(key => formData[key as keyof DirectDeposit] === initialData[key as keyof DirectDeposit]);
        if (isSameAsInitial) {
          onNext();
        } else {
          onEdit(formData);
        }
      }
    }
  };

  const showError = (field: keyof typeof touched) => touched[field] && errors[field];

  const fundAllocationOptions = [
    { value: "FullAmount", label: "Full Amount" },
    { value: "PercentageOfNetPay", label: "Percentage of Net Pay" },
    { value: "RemainingBalance", label: "Remaining Balance" },
    { value: "SpecificDollarAmount", label: "Specific Dollar Amount" },
  ];

  const accountTypeOptions = [
    { value: "Checking", label: "Checking" },
    { value: "Savings", label: "Savings" },
  ];

  return (
    <form className="flex flex-col gap-12 w-full max-w-6xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="financialInstitution">
            <p className='text-sm font-semibold'>Financial Institution</p>
          </label>
          <input
            name="financialInstitution"
            placeholder="Financial Institution"
            value={formData?.financialInstitution}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.financialInstitution ? 'border-red-500' : ''}`}
          />
          {showError('financialInstitution') && <span className="text-red-500 text-sm">{errors.financialInstitution}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="routingNumber">
            <p className='text-sm font-semibold'>Routing Number</p>
          </label>
          <input
            name="routingNumber"
            placeholder="Routing Number"
            value={formData?.routingNumber}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.routingNumber ? 'border-red-500' : ''}`}
          />
          {showError('routingNumber') && <span className="text-red-500 text-sm">{errors.routingNumber}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="accountNumber">
            <p className='text-sm font-semibold'>Account Number</p>
          </label>
          <input
            name="accountNumber"
            placeholder="Account Number"
            value={formData?.accountNumber}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.accountNumber ? 'border-red-500' : ''}`}
          />
          {showError('accountNumber') && <span className="text-red-500 text-sm">{errors.accountNumber}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="fundAllocationOptions">
            <p className='text-sm font-semibold'>Funds Allocation</p>
          </label>
          <Select
            options={fundAllocationOptions}
            value={formData.allocateFundsMethod}
            onChange={(value) => handleSelectChange("allocateFundsMethod", value)}
            placeholder='How would you like to allocate funds?'
            className={`border h-full p-2 rounded-md ${errors.allocateFundsMethod ? 'border-red-500' : ''}`}
          />
          {showError('allocateFundsMethod') && <span className="text-red-500 text-sm">{errors.allocateFundsMethod}</span>}
        </div>

        <div className="flex flex-col">
        <label htmlFor="accountTypeOptions">
            <p className='text-sm font-semibold'>Account Type</p>
          </label>
          <Select
            options={accountTypeOptions}
            value={formData?.accountType}
            placeholder='Account type'
            onChange={(value) => handleSelectChange("accountType", value)}
            className={`border p-2 rounded-md ${errors.accountType ? 'border-red-500' : ''}`}
          />
          {showError('accountType') && <span className="text-red-500 text-sm">{errors.accountType}</span>}
        </div>
      </div>

      <div className='border p-4 rounded-md'>
        <p className='text-gray-600'>
          <strong className='text-black'>By electronically signing this form, I have read and understand the
            following statements:</strong> <br /><br />
          I understand that I must submit a new direct deposit authorization form if I
          change banks and/or accounts.<br /><br />
          I authorize [Company Name] to deposit my wages/salary to the financial
          institution(s) and account(s) named above <br /><br />
          I also authorize my financial institutions) and [Company Name] to make
          appropriate adjustment/s if an incorrect deposit is made. <br /><br />
          [Company Name] is authorized to terminate this agreement without notice if legally obligated to withhold any part of my salary. This authorization remains in effect until I notify the [Company Name] in writing and I
          understand I must give reasonable advance notice.
        </p>
      </div>

      <div className="flex w-full justify-between">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          className={`bg-primary text-white px-4 py-2 rounded-md mt-2 ${Object.keys(errors).length ? 'opacity-50' : ''}`}
          disabled={Object.keys(errors).length > 0}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default DirectDepositForm;
