import { OnboardingEmergencyContacts } from '@/types/onboardingTypes';
import React, { useState, useEffect } from 'react';
import { Oval } from 'react-loader-spinner';

interface EmergencyContactFormProps {
  emergencyContacts: OnboardingEmergencyContacts,
  onSave: (formData: OnboardingEmergencyContacts) => void;
  onEdit: (formData: OnboardingEmergencyContacts) => void;
  onNext: () => void;
  onClose: () => void;
  loading: boolean;
}

const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({ emergencyContacts, onSave, onEdit, onNext, onClose, loading }) => {
  const [formData, setFormData] = useState<OnboardingEmergencyContacts>(emergencyContacts);
  const [initialData, setInitialData] = useState<OnboardingEmergencyContacts>(emergencyContacts);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    primaryPhone: "",
    secondaryPhone: "",
    relationship: ""
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    primaryPhone: false,
    secondaryPhone: false,
    relationship: false
  });

  useEffect(() => {
    validate();
  }, [formData]);

  useEffect(() => {
    setFormData(emergencyContacts)
    setInitialData(emergencyContacts)
    validate()
  }, [emergencyContacts])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';

    if (!formData.primaryPhone) {
      newErrors.primaryPhone = 'Primary Phone Number is required';
    } else if (!/^\d+$/.test(formData.primaryPhone)) {
      newErrors.primaryPhone = 'Invalid phone number format';
    }

    if (!formData.relationship) newErrors.relationship = 'Relationship is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const isEmptyForm = Object.keys(initialData).every(key => !initialData[key as keyof OnboardingEmergencyContacts]);

      if (isEmptyForm) {
        onSave(formData);
      } else {
        const isSameAsInitial = Object.keys(formData).every(key => formData[key as keyof OnboardingEmergencyContacts] === initialData[key as keyof OnboardingEmergencyContacts]);
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-6xl">
      <div className="grid grid-cols-2 gap-4">
        {/* Emergency Contact Inputs */}
        <div className="flex flex-col">
          <label htmlFor="firstName">
            <p className='text-sm font-semibold'>First Name</p>
          </label>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {showError('firstName') && <span className="text-red-500 text-sm">{errors.firstName}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastName">
            <p className='text-sm font-semibold'>Last Name</p>
          </label>
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {showError('lastName') && <span className="text-red-500 text-sm">{errors.lastName}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="primaryPhone">
            <p className='text-sm font-semibold'>Primary Phone Number</p>
          </label>
          <input
            name="primaryPhone"
            placeholder="Primary Phone Number"
            value={formData.primaryPhone}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.primaryPhone ? 'border-red-500' : ''}`}
          />
          {showError('primaryPhone') && <span className="text-red-500 text-sm">{errors.primaryPhone}</span>}
        </div>

        <div className="flex flex-col">
          <label htmlFor="secondaryPhone">
            <p className='text-sm font-semibold'>Secondary Phone Number</p>
          </label>
          <input
            name="secondaryPhone"
            placeholder="Secondary Phone Number"
            value={formData.secondaryPhone}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>

        <div className="flex flex-col">
        <label htmlFor="relationship">
            <p className='text-sm font-semibold'>Relationship to You</p>
          </label>
          <input
            name="relationship"
            placeholder="Relationship to You"
            value={formData.relationship}
            onChange={handleChange}
            className={`border p-2 rounded-md ${errors.relationship ? 'border-red-500' : ''}`}
          />
          {showError('relationship') && <span className="text-red-500 text-sm">{errors.relationship}</span>}
        </div>
      </div>

      <div className='flex w-full justify-between'>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`flex gap-2 items-center justify-center bg-primary text-white px-4 py-2 rounded-md mt-2 ${Object.keys(errors).length || loading ? 'opacity-50' : ''}`}
          disabled={Object.keys(errors).length > 0}
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
          <p>{loading ? "Saving..." : "Next"}</p>
        </button>
      </div>
    </form>
  );
};

export default EmergencyContactForm;
