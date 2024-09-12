'use client';

import React, { useState } from 'react';
import Select from '@/components/Select'; // Adjust the path

interface DirectDepositFormProps {
  onClose: () => void;
  onSubmit: (formData: Record<string, string>) => void; // Add onSubmit prop
}

const DirectDepositForm: React.FC<DirectDepositFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    financialInstitution: '',
    routingNumber: '',
    accountNumber: '',
    fundAllocation: '',
    accountType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData); // Call the onSubmit prop with form data
  };

  const fundAllocationOptions = [
    { value: "", label: "How would you like to allocate funds?" },
    { value: "Full Amount", label: "Full Amount" },
    { value: "Percentage", label: "Percentage" },
    { value: "Fixed Amount", label: "Fixed Amount" },
  ];

  const accountTypeOptions = [
    { value: "", label: "Select Account Type" },
    { value: "Checking", label: "Checking" },
    { value: "Savings", label: "Savings" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-6xl">
      <div className="grid grid-cols-2 gap-4">
        <input 
          name="financialInstitution" 
          placeholder="Financial Institution" 
          value={formData.financialInstitution} 
          onChange={handleChange} 
          className="border p-2 rounded-md" 
        />
        <input 
          name="routingNumber" 
          placeholder="Routing Number" 
          value={formData.routingNumber} 
          onChange={handleChange} 
          className="border p-2 rounded-md" 
        />
        <input 
          name="accountNumber" 
          placeholder="Account Number" 
          value={formData.accountNumber} 
          onChange={handleChange} 
          className="border p-2 rounded-md" 
        />
        <Select 
          options={fundAllocationOptions}
          value={formData.fundAllocation}
          onChange={(value) => handleSelectChange("fundAllocation", value)}
          className="border p-2 rounded-md"
        />
        <Select 
          options={accountTypeOptions}
          value={formData.accountType}
          onChange={(value) => handleSelectChange("accountType", value)}
          className="border p-2 rounded-md"
        />
      </div>

      <div className='flex w-full justify-between'>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md mt-2">
          Submit
        </button>
      </div>
    </form>
  );
};

export default DirectDepositForm;
