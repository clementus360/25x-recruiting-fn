import React, { useState } from 'react';

interface EmergencyContactFormProps {
  onSubmit: (formData: Record<string, string>) => void;
  onClose: () => void
}

const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    firstName: '',
    lastName: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    relationship: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        {/* Emergency Contact Inputs */}
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="primaryPhoneNumber" placeholder="Primary Phone Number" value={formData.primaryPhoneNumber} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="secondaryPhoneNumber" placeholder="Secondary Phone Number" value={formData.secondaryPhoneNumber} onChange={handleChange} className="border p-2 rounded-md" />
        <input name="relationship" placeholder="Relationship to You" value={formData.relationship} onChange={handleChange} className="border p-2 rounded-md" />
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

export default EmergencyContactForm;
