'use client';

import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { GetCompanyData, GetUsers, UpdateUserProfile } from "@/data/users";


export default function UserProfile() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [formData, setFormData] = useState({
    string: "", // User Name
    title: "",
    email: "",
    newPassword: "",
  });
  const [oldPassword, setOldPassword] = useState(""); // Separate state for authorization
  const { setError } = useError();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { companyInfo } = useCompany();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value); // Handle old password separately
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return
    }

    // Check if the old password is provided before submitting
    if (!oldPassword) {
      setError("Please enter the old password to authorize changes.");
      return;
    }

    UpdateUserProfile({
      ...formData,
      oldPassword: oldPassword,
    }, accessToken)

    console.log("Form Data:", formData);
    // Perform further actions here
  };

  const fetchUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!companyInfo || !accessToken) {
      return;
    }

    try {
      const result = await GetUsers(companyInfo?.id, accessToken);
      if (result) {
        setUsers(result);
      } else {
        setError("Failed to fetch Users.");
      }
    } catch (error) {
      setError("An error occurred while fetching Users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return;
    }

    try {
      const result = await GetCompanyData(accessToken);
      if (result) {
        setFormData((prevData) => ({
          ...prevData,
          username: result.username, // Set username
        }));
      } else {
        setError("Failed to fetch company data.");
      }
    } catch (error) {
      setError("An error occurred while fetching company data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanyInfo();
  }, [companyInfo]);

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    fetchUsers();
  };

  return (
    <main className="flex min-h-screen flex-col gap-16 py-16 w-full px-4 lg:px-40">
      <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">

        <h1 className="text-3xl font-bold">User Profile</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <label className="flex flex-col w-full gap-1">
            <p>Username</p>
            <input
              className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="username"
              placeholder="Username"
              value={formData.string}
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

          {/* Separate input for old password to check authorization */}
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
