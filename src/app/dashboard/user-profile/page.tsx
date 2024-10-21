'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useError } from '@/context/ErrorContext';
import { UpdateUserProfile } from '@/data/users';
import { getAccessToken } from '@/data/cookies';
import { useSuccess } from '@/context/SuccessContext';

export default function UserProfile() {
  const { userInfo, userInfoLoading } = useUser(); // Fetch user information from context
  const { setError } = useError();
  const { setSuccess } = useSuccess();

  // Initial and form states
  const [formData, setFormData] = useState<{
    firstName: string,
    lastName: string,
    title: string,
    email: string,
    oldPassword?: string | '',
    newPassword?: string | '',
  }>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });

  const [initialData, setInitialData] = useState<{
    firstName: string,
    lastName: string,
    title: string,
    email: string,
    oldPassword?: string | '',
    newPassword?: string | '',
  }>({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    oldPassword: '',
    newPassword: '',
  });

  const [oldPassword, setOldPassword] = useState(''); // Old password for authorization

  useEffect(() => {
    if (userInfo) {
      const fetchedData = {
        firstName: userInfo?.firstName || '',
        lastName: userInfo?.lastName || '',
        title: userInfo?.roleName || '',
        email: userInfo?.email || '',
        newPassword: ''
      };
      setFormData(fetchedData);
      setInitialData(fetchedData);
    }
  }, [userInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = getAccessToken();

    if (!accessToken) {
      return setError('User not authenticated.');
    }

    // Compare formData with initialData to identify changed fields
    const updatedFields: Partial<typeof formData> = {};
    for (const key in formData) {
      if (formData[key as keyof typeof formData] !== initialData[key as keyof typeof formData]) {
        updatedFields[key as keyof typeof formData] = formData[key as keyof typeof formData];
      }
    }

    // Add oldPassword for authorization if any fields have changed
    if (Object.keys(updatedFields).length > 0) {
      updatedFields['oldPassword'] = oldPassword;
    } else {
      return setError('No changes were made.');
    }

    console.log(updatedFields)

    try {
      // Send the updated fields to the backend
      await UpdateUserProfile(updatedFields, accessToken);
      setSuccess('User profile updated successfully');

      setInitialData({ ...formData });

    } catch (err: any) {
      setError(err.message || `Error updating user profile`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col gap-16 py-16 w-full px-4 lg:px-40">
      <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
        <h1 className="text-3xl font-bold">User Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <label className="flex flex-col w-full gap-1">
            <p>First Name</p>
            <input
              className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p>Last Name</p>
            <input
              className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p>Title</p>
            <input
              className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p>Email</p>
            <input
              className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          {/* Separate input for old password */}
          <label className="flex flex-col w-full gap-1">
            <p>Old Password (for authorization)</p>
            <input
              className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
          </label>

          <label className="flex flex-col w-full gap-1">
            <p>New Password</p>
            <input
              className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </label>

          <button
            type="submit"
            className="flex gap-2 items-center bg-primary h-max w-max px-8 py-4 text-white text-sm font-semibold rounded-md"
          >
            Save Information
          </button>
        </form>
      </section>
    </main>
  );
}
