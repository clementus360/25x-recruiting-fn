import React, { useState } from 'react';

interface UserInfoFormProps {
  onSubmit: (formData: Record<string, string>) => void;
  onClose: () => void
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    firstName: '',
    lastName: '',
    preferredName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    ssn: '',
    confirmSsn: '',
    gender: '',
    driversLicense: '',
    driversLicenseExpiry: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-6xl">
      <div className="grid grid-cols-2 gap-4">
        {/* Personal Information Inputs */}
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="preferredName" placeholder="Preferred Name" value={formData.preferredName} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="streetLine1" placeholder="Street Line 1" value={formData.streetLine1} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="streetLine2" placeholder="Street Line 2" value={formData.streetLine2} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="city" placeholder="City/Town" value={formData.city} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="state" placeholder="State/Province/Region" value={formData.state} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="phoneNumber" placeholder="Primary Phone Number" value={formData.phoneNumber} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="dateOfBirth" type="date" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="ssn" placeholder="Social Security Number" value={formData.ssn} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="confirmSsn" placeholder="Confirm Social Security Number" value={formData.confirmSsn} onChange={handleChange} className="border p-2 rounded-md" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded-md">
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input name="driversLicense" placeholder="Driver's License Number" value={formData.driversLicense} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="driversLicenseExpiry" type="date" placeholder="Driver's License Expiry" value={formData.driversLicenseExpiry} onChange={handleChange} className="border p-2 rounded-md" />
      </div>
      <div className='flex w-full justify-between'>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md mt-2">Next</button>
      </div>
    </form>
  );
};

export default UserInfoForm;
