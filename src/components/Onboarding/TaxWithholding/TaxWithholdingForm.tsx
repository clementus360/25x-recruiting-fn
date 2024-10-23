'use client';

import React, { useState, useEffect } from 'react';
import { TaxWithholding } from '@/types/onboardingTypes'; // Adjust the path
import { Oval } from 'react-loader-spinner';

interface TaxWithholdingFormProps {
  taxWithholding: TaxWithholding;
  onSave: (formData: TaxWithholding) => void;
  onEdit: (formData: TaxWithholding) => void;
  onNext: () => void;
  onClose: () => void;
  loading: boolean;
}

const TaxWithholdingForm: React.FC<TaxWithholdingFormProps> = ({
  taxWithholding,
  onSave,
  onEdit,
  onNext,
  onClose,
  loading,
}) => {
  const [formData, setFormData] = useState<TaxWithholding>(taxWithholding);
  const [initialData, setInitialData] = useState<TaxWithholding>(taxWithholding);
  const [errors, setErrors] = useState({
    homeAddress: '',
    homeAddressLineTwo: '',
    city: '',
    state: '',
    zipCode: '',
    socialSecurityNumber: '',
  });
  const [touched, setTouched] = useState({
    homeAddress: false,
    homeAddressLineTwo: false,
    city: false,
    state: false,
    zipCode: false,
    socialSecurityNumber: false,
  });

  useEffect(() => {
    validate();
  }, [formData]);

  useEffect(() => {
    setFormData(taxWithholding);
    setInitialData(taxWithholding);
    validate();
  }, [taxWithholding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.homeAddress) newErrors.homeAddress = 'Home Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) {
      newErrors.zipCode = 'Zip Code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid Zip Code format';
    }
    if (!formData.socialSecurityNumber) {
      newErrors.socialSecurityNumber = 'Social Security Number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const isEmptyForm = Object.keys(initialData).every(
        (key) => !initialData[key as keyof TaxWithholding]
      );

      if (isEmptyForm) {
        onSave(formData);
      } else {
        const isSameAsInitial = Object.keys(formData).every(
          (key) => formData[key as keyof TaxWithholding] === initialData[key as keyof TaxWithholding]
        );
        if (isSameAsInitial) {
          onNext();
        } else {
          onEdit(formData);
        }
      }
    }
  };

  const showError = (field: keyof typeof touched) => touched[field] && errors[field];

  return (
    <form className="flex flex-col gap-12 w-full max-w-6xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label htmlFor="homeAddress">
            <p className="text-sm font-semibold">Home Address</p>
          </label>
          <input
            name="homeAddress"
            placeholder="Home Address"
            value={formData?.homeAddress}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.homeAddress ? 'border-red-500' : ''}`}
          />
          {showError('homeAddress') && <span className="text-red-500 text-sm">{errors.homeAddress}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="homeAddressLineTwo">
            <p className="text-sm font-semibold">Home Address Line Two (optional)</p>
          </label>
          <input
            name="homeAddressLineTwo"
            placeholder="Home Address Line Two"
            value={formData?.homeAddressLineTwo}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.homeAddressLineTwo ? 'border-red-500' : ''}`}
          />
          {showError('homeAddressLineTwo') && <span className="text-red-500 text-sm">{errors.homeAddressLineTwo}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="city">
            <p className="text-sm font-semibold">City</p>
          </label>
          <input
            name="city"
            placeholder="City"
            value={formData?.city}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.city ? 'border-red-500' : ''}`}
          />
          {showError('city') && <span className="text-red-500 text-sm">{errors.city}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="state">
            <p className="text-sm font-semibold">State</p>
          </label>
          <input
            name="state"
            placeholder="State"
            value={formData?.state}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.state ? 'border-red-500' : ''}`}
          />
          {showError('state') && <span className="text-red-500 text-sm">{errors.state}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="zipCode">
            <p className="text-sm font-semibold">Zip Code</p>
          </label>
          <input
            name="zipCode"
            placeholder="Zip Code"
            value={formData?.zipCode}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.zipCode ? 'border-red-500' : ''}`}
          />
          {showError('zipCode') && <span className="text-red-500 text-sm">{errors.zipCode}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="socialSecurityNumber">
            <p className="text-sm font-semibold">Social Security Number</p>
          </label>
          <input
            name="socialSecurityNumber"
            placeholder="SSN (XXX-XX-XXXX)"
            value={formData?.socialSecurityNumber}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.socialSecurityNumber ? 'border-red-500' : ''}`}
          />
          {showError('socialSecurityNumber') && <span className="text-red-500 text-sm">{errors.socialSecurityNumber}</span>}
        </div>
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
          className={`flex gap-2 items-center justify-center bg-primary text-white px-4 py-2 rounded-md mt-2 ${Object.keys(errors).length || loading ? 'opacity-50' : ''}`}
          disabled={Object.keys(errors).length > 0}
        >
          {loading && (
            <Oval
              visible={true}
              height="14"
              width="14"
              color="#ffffff"
              secondaryColor="#ffffff"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass="flex items-center justify-center"
            />
          )}
          <p>{loading ? "Saving..." : "Next"}</p>
        </button>
      </div>
    </form>
  );
};

export default TaxWithholdingForm;
