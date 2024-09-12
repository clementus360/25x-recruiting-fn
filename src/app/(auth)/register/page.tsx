'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import 'react-phone-number-input/style.css';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { useError } from "@/context/ErrorContext";
import { registerCompany } from "@/data/auth";
import { Oval } from "react-loader-spinner";
import { useSuccess } from "@/context/SuccessContext";

export default function SignUp() {
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    fname: '',
    lname: '',
    jobTitle: '',
    company: '',
    employees: '',
    industry: ''
  });
  const { error, setError } = useError();
  const { setSuccess } = useSuccess();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [changed, setChanged] = useState(false)

  const validateForm = (data: typeof formData) => {
    const newErrors: { [key: string]: string } = {};

    if (!data.fname.trim()) newErrors.fname = "First name is required.";
    if (!data.lname.trim()) newErrors.lname = "Last name is required.";
    if (!data.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email format is invalid.";
    }
    if (!data.phone || !isValidPhoneNumber(data.phone)) {
      newErrors.phone = "A valid phone number is required.";
    }
    if (!data.jobTitle.trim()) newErrors.jobTitle = "Job title is required.";
    if (!data.company.trim()) newErrors.company = "Company name is required.";
    if (!data.employees.trim()) newErrors.employees = "Number of employees is required.";
    if (!data.industry.trim()) newErrors.industry = "Industry is required.";

    setErrors(newErrors);

    // Return whether the form is valid
    return Object.keys(newErrors).length === 0;
  };

  // Validate on formData change
  useEffect(() => {
    if (changed) {
      validateForm(formData);
    }
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!changed) {
      setChanged(true)
    }

    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData((prev) => ({
      ...prev,
      phone: value || '',
    }));
  };

  const handleRegisterCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(formData)) {
      setLoading(true); // Start loading
      try {
        await registerCompany(formData);
        setError("");
        setSuccess("Company Registered Successsfully") // Clear error message on successful submission
        setFormData({
          phone: '',
          email: '',
          fname: '',
          lname: '',
          jobTitle: '',
          company: '',
          employees: '',
          industry: ''
        })
      } catch (err: any) {
        setError(err.message ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      setError("Please fix the errors and try again.");
    }
  };

  useEffect(() => {
    const isFormValid = validateForm(formData);

    if (!isFormValid || loading) {
        setDisabled(true);
    } else {
        setDisabled(false);
    }
}, [formData, loading]);

  return (
    <main className="flex min-h-screen flex-col justify-between py-16 pl-24 pr-16">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Register Company</h1>
        </div>


        <form onSubmit={handleRegisterCompany} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="fname" className="text-sm font-semibold">First Name</label>
              <input
                onChange={handleInputChange}
                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                type="text"
                name="fname"
                id="fname"
                value={formData.fname}
                placeholder="Enter your first name"
              />
              {errors.fname && <span className="text-red-500 text-xs">{errors.fname}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="lname" className="text-sm font-semibold">Last Name</label>
              <input
                onChange={handleInputChange}
                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                type="text"
                name="lname"
                id="lname"
                value={formData.lname}
                placeholder="Enter your last name"
              />
              {errors.lname && <span className="text-red-500 text-xs">{errors.lname}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-sm font-semibold">Phone Number</label>
            <PhoneInput
              placeholder="Enter phone number"
              className="bg-white px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
            />
            {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold">Business Email</label>
            <input
              onChange={handleInputChange}
              className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
              type="email"
              name="email"
              id="email"
              value={formData.email}
              placeholder="example@gmail.com"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="jobTitle" className="text-sm font-semibold">Job Title</label>
            <input
              onChange={handleInputChange}
              className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
              type="text"
              name="jobTitle"
              id="jobTitle"
              value={formData.jobTitle}
              placeholder="Enter your job"
            />
            {errors.jobTitle && <span className="text-red-500 text-xs">{errors.jobTitle}</span>}
          </div>

          <div className="grid grid-cols-[3fr_1fr] gap-4">
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="company" className="text-sm font-semibold">Company</label>
              <input
                onChange={handleInputChange}
                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                type="text"
                name="company"
                id="company"
                value={formData.company}
                placeholder="Company name"
              />
              {errors.company && <span className="text-red-500 text-xs">{errors.company}</span>}
            </div>

            <div className="w-full flex flex-col gap-1">
              <label htmlFor="employees" className="text-sm font-semibold">Employees</label>
              <input
                onChange={handleInputChange}
                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                type="number"
                name="employees"
                id="employees"
                min={0}
                value={formData.employees}
                placeholder="Number of employees"
              />
              {errors.employees && <span className="text-red-500 text-xs">{errors.employees}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="industry" className="text-sm font-semibold">Industry</label>
            <select
              onChange={handleInputChange}
              className="px-2 py-2 h-12 border-grey border-[0.02rem] rounded-[0.2rem]"
              name="industry"
              id="industry"
              value={formData.industry}
            >
              <option value="">Select the industry</option>
              <option value="Automotive">Automotive</option>
              <option value="Facilities Based Care">Facilities Based Care</option>
              <option value="Senoir Care">Senoir Care</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Other Business">Other Business</option>
            </select>
            {errors.industry && <span className="text-red-500 text-xs">{errors.industry}</span>}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              className="flex gap-2 items-center justify-center bg-primary disabled:bg-grey hover:bg-opacity-80 cursor-pointer text-white font-semibold py-4 w-full rounded-lg"
              type="submit"
              disabled={disabled}
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
              <p>{loading ? "Submitting..." : "Request Verification"}</p>
            </button>
            <p className="text-sm font-light text-grey">
              Already have an account? <Link href={"/sign-in"}><span className="font-bold text-primary">Sign In</span></Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
