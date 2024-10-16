import Select from '@/components/Select';
import { OnboardingPersonalInfo, OnboardingPersonalInfoForm } from '@/types/onboardingTypes';
import React, { useEffect, useState } from 'react';

interface UserInfoFormProps {
  userInfo: OnboardingPersonalInfo,
  onSave: (formData: OnboardingPersonalInfo) => void;
  onEdit: (formData: OnboardingPersonalInfo) => void;
  onNext: () => void;
  onClose: () => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ userInfo, onSave, onEdit, onNext, onClose }) => {
  const [confirmSsn, setConfirmSsn] = useState("")
  const [initialData, setInitialData] = useState<OnboardingPersonalInfo>(userInfo);
  const [formData, setFormData] = useState<OnboardingPersonalInfo>(userInfo);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    preferedName: '',
    streeLine1: '',
    streetLine2: '',
    city: '',
    postalCode: '',
    country: '',
    state: '',
    primaryPhone: '',
    email: '',
    dob: '',
    ssn: '',
    confirmSsn: '',
    gender: '',
    driverLicenseNumber: '',
    driverLicenseExpiration: ''
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    preferedName: false,
    streeLine1: false,
    streetLine2: false,
    city: false,
    postalCode: false,
    country: false,
    state: false,
    primaryPhone: false,
    email: false,
    dob: false,
    ssn: false,
    confirmSsn: false,
    gender: false,
    driverLicenseNumber: false,
    driverLicenseExpiration: false
  });

  useEffect(() => {
    validate()
  }, [formData, confirmSsn])

  useEffect(() => {
    setFormData(userInfo)
    setInitialData(userInfo)
    validate()
  }, [userInfo])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If a field has been modified, mark it as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value
      }

      return newFormData
    })
  }

  const validate = () => {
    const newErrors: any = {};

    // Example validation for required fields
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.primaryPhone) newErrors.primaryPhone = 'Phone Number is required';
    if (!formData.ssn) newErrors.ssn = 'SSN is required';
    else if (formData.ssn !== confirmSsn) newErrors.confirmSsn = 'SSNs do not match';

    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.driverLicenseNumber) newErrors.driverLicenseNumber = 'Driver\'s License Number is required';
    if (!formData.driverLicenseExpiration) newErrors.driverLicenseExpiration = 'Driver\'s License Expiry is required';

    if (!formData.streeLine1) newErrors.streeLine1 = 'Street Line 1 is required';
    if (!formData.streetLine2) newErrors.streetLine2 = 'Street Line 2 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal Code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const isEmptyForm = Object.keys(initialData).every(key => !initialData[key as keyof OnboardingPersonalInfo]);

      if (isEmptyForm) {
        onSave(formData);
      } else {
        const isSameAsInitial = Object.keys(formData).every(key => formData[key as keyof OnboardingPersonalInfo] === initialData[key as keyof OnboardingPersonalInfo]);
        if (isSameAsInitial) {
          onNext();
        } else {
          onEdit(formData);
        }
      }
    }
  };

  // Check if a field has been touched, then show its error
  const showError = (field: keyof typeof touched) => touched[field] && errors[field];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-4 w-full">
        <div className='flex flex-col'>
          <label htmlFor="firstName">
            <p className='text-sm font-semibold'>First Name</p>
          </label>
          <input
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.firstName ? 'border-red-500' : ''}`}
          />
          {showError('firstName') && errors?.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="lastName">
            <p className='text-sm font-semibold'>Last Name</p>
          </label>
          <input
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.lastName ? 'border-red-500' : ''}`}
          />
          {showError('lastName') && errors?.lastName && <span className="text-red-500 text-sm">{errors?.lastName}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="preferedName">
            <p className='text-sm font-semibold'>Preferred Name</p>
          </label>
          <input
            name="preferedName"
            placeholder="Preferred Name"
            value={formData?.preferedName}
            onChange={handleChange}
            className="border px-2 py-1 rounded-md w-full bg-lightBlue"
          />
        </div>

        <div className="flex gap-4 justify-between">
          <div className='flex flex-col'>
            <label htmlFor="streeLine1">
              <p className='text-sm font-semibold'>Street Line 1</p>
            </label>
            <input
              name="streeLine1"
              placeholder="Street Line 1"
              value={formData.streeLine1}
              onChange={handleChange}
              className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.streeLine1 ? 'border-red-500' : ''}`}
            />
            {showError('streeLine1') && errors?.streeLine1 && <span className="text-red-500 text-sm">{errors?.streeLine1}</span>}
          </div>
          <div className='flex flex-col'>
            <label htmlFor="streetLine2">
              <p className='text-sm font-semibold'>Street Line 2</p>
            </label>
            <input
              name="streetLine2"
              placeholder="Street Line 2"
              value={formData.streetLine2}
              onChange={handleChange}
              className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.streetLine2 ? 'border-red-500' : ''}`}
            />
            {showError('streetLine2') && errors?.streetLine2 && <span className="text-red-500 text-sm">{errors?.streetLine2}</span>}

          </div>
        </div>

        <div className="flex gap-4 justify-between">
          <div className='flex flex-col'>
            <label htmlFor="city">
              <p className='text-sm font-semibold'>City/Town</p>
            </label>
            <input
              name="city"
              placeholder="City/Town"
              value={formData.city}
              onChange={handleChange}
              className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.city ? 'border-red-500' : ''}`}
            />
            {showError('city') && errors?.city && <span className="text-red-500 text-sm">{errors.city}</span>}
          </div>

          <div className='flex flex-col'>
            <label htmlFor="postalCode">
              <p className='text-sm font-semibold'>Postal Code</p>
            </label>
            <input
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleChange}
              className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.postalCode ? 'border-red-500' : ''}`}
            />
            {showError('postalCode') && errors?.postalCode && <span className="text-red-500 text-sm">{errors?.postalCode}</span>}
          </div>

          <div className='flex flex-col'>
            <label htmlFor="streetLine2">
              <p className='text-sm font-semibold'>Street Line 2</p>
            </label>
            <input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.country ? 'border-red-500' : ''}`}
            />
            {showError('country') && errors?.country && <span className="text-red-500 text-sm">{errors?.country}</span>}
          </div>
        </div>

        <div className='flex flex-col'>
          <label htmlFor="state">
            <p className='text-sm font-semibold'>State/Province/Region</p>
          </label>
          <input
            name="state"
            placeholder="State/Province/Region"
            value={formData.state}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.state ? 'border-red-500' : ''}`}
          />
          {showError('state') && errors?.state && <span className="text-red-500 text-sm">{errors?.state}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="primaryPhone">
            <p className='text-sm font-semibold'>Primary Phone Number</p>
          </label>
          <input
            name="primaryPhone"
            placeholder="Primary Phone Number"
            value={formData.primaryPhone}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.primaryPhone ? 'border-red-500' : ''}`}
          />
          {showError('primaryPhone') && errors?.primaryPhone && <span className="text-red-500 text-sm">{errors?.primaryPhone}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="email">
            <p className='text-sm font-semibold'>Email Address</p>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.email ? 'border-red-500' : ''}`}
          />
          {showError('email') && errors?.email && <span className="text-red-500 text-sm">{errors?.email}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="dob">
            <p className='text-sm font-semibold'>Date of Birth</p>
          </label>
          <input
            name="dob"
            type="date"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.dob ? 'border-red-500' : ''}`}
          />
          {showError('dob') && errors?.dob && <span className="text-red-500 text-sm">{errors?.dob}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="ssn">
            <p className='text-sm font-semibold'>Social Security Number</p>
          </label>
          <input
            name="ssn"
            placeholder="Social Security Number"
            value={formData.ssn}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.ssn ? 'border-red-500' : ''}`}
          />
          {showError('ssn') && errors?.ssn && <span className="text-red-500 text-sm">{errors?.ssn}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="confirmSsn">
            <p className='text-sm font-semibold'>Confirm Social Security Number</p>
          </label>
          <input
            name="confirmSsn"
            placeholder="Confirm Social Security Number"
            value={confirmSsn}
            onChange={(e) => {
              setConfirmSsn(e.target.value)
            }}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.confirmSsn ? 'border-red-500' : ''}`}
          />
          {showError('confirmSsn') && errors?.confirmSsn && <span className="text-red-500 text-sm">{errors?.confirmSsn}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="gender">
            <p className='text-sm font-semibold'>Gender</p>
          </label>
          <Select
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
            ]}
            value={formData.gender}
            onChange={(value) => handleSelectChange("gender", value)}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.gender ? 'border-red-500' : ''}`}
          />
          {showError('gender') && errors?.gender && <span className="text-red-500 text-sm">{errors?.gender}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="driverLicenseNumber">
            <p className='text-sm font-semibold'>Driver&apos;s License Number</p>
          </label>
          <input
            name="driverLicenseNumber"
            placeholder="Driver's License Number"
            value={formData.driverLicenseNumber}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.driverLicenseNumber ? 'border-red-500' : ''}`}
          />
          {showError('driverLicenseNumber') && errors?.driverLicenseNumber && <span className="text-red-500 text-sm">{errors?.driverLicenseNumber}</span>}
        </div>

        <div className='flex flex-col'>
          <label htmlFor="driverLicenseExpiration">
            <p className='text-sm font-semibold'>Driver&apos;s License Expiry Date</p>
          </label>
          <input
            name="driverLicenseExpiration"
            type="date"
            placeholder="Driver's License Expiry"
            value={formData.driverLicenseExpiration}
            onChange={handleChange}
            className={`border px-2 py-1 rounded-md w-full bg-lightBlue ${errors?.driverLicenseExpiration ? 'border-red-500' : ''}`}
          />
          {showError('driverLicenseExpiration') && errors?.driverLicenseExpiration && <span className="text-red-500 text-sm">{errors?.driverLicenseExpiration}</span>}
        </div>
      </div>

      <div className="flex w-full justify-between">
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">
          Cancel
        </button>
        <button
          type="submit"
          className={`bg-primary text-white px-4 py-2 rounded-md mt-2 ${Object.keys(errors).length ? 'opacity-50' : ''}`}
          disabled={Object.keys(errors).length > 0}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;
