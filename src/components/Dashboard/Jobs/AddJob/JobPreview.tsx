'use client'

import { useRouter } from 'next/navigation';
import { useFormData } from '@/context/FormDataContext';
import { FaUserTie, FaDollarSign, FaBuilding, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import { OpenNewJob } from '@/data/jobsData';
import { useCompany } from '@/context/CompanyContext';
import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/data/localStorage';

export default function JobPreview() {
    const { formData, setFormData } = useFormData()!; // Access the form data from context
    const router = useRouter();
    const { companyInfo } = useCompany()
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [loading, setLoading] = useState(false);

    // Use the custom hook to interact with localStorage
    const [accessToken] = useLocalStorage("accessToken", "");
    const [, , removeFormData] = useLocalStorage("formData", null); // Ignore the set value function
    const [, , removeFormDataTimestamp] = useLocalStorage("formDataTimestamp", null);

    const handleCancel = () => {
        // Reset the form data to the initial state
        setFormData({
            jobTitle: '',
            category: '',
            department: '',
            seats: 0,
            payRate: 0,
            payPeriod: '',
            payFrequency: '',
            managementRole: '',
            employmentType: '',
            hireType: '',
            hiringManager: '',
            search: '',
            isRemote: true,
            country: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            description: '',
            status: '',
            visibility: '',
        });

        // Clear local storage using the custom hook
        removeFormData();
        removeFormDataTimestamp();

        router.push('/dashboard/jobs/');
    };

    const handleOpenJob = async () => {
        const CompanyId = companyInfo?.id

        try {
            // Logic to invite/add user with formData
            if (CompanyId && accessToken) {
                await OpenNewJob(CompanyId, accessToken, formData);
            } else {
                setError("Could not find company id")
                return
            }

            handleCancel()
            setSuccess("Job added successfully.");
        } catch (err: any) {
            console.log(err)
            setError(`An error occurred while opening a new job`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
                <h2 className="text-lg font-bold mb-4">Job Preview</h2>

                {/* Basic Information Card */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <FaUserTie className="text-accent" />
                        <h3 className="text-md font-semibold">Basic Information</h3>
                    </div>
                    <p><strong>Job Title:</strong> {formData.jobTitle}</p>
                    <p><strong>Category:</strong> {formData.category}</p>
                    <p><strong>Department:</strong> {formData.department}</p>
                    <p><strong>Number of Seats:</strong> {formData.seats}</p>
                </div>

                {/* Pay Information Card */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <FaDollarSign className="text-accent" />
                        <h3 className="text-md font-semibold">Pay Information</h3>
                    </div>
                    <p><strong>Pay Rate:</strong> {formData.payRate}</p>
                    <p><strong>Pay Period:</strong> {formData.payPeriod}</p>
                    <p><strong>Pay Frequency:</strong> {formData.payFrequency}</p>
                </div>

                {/* Job Details Card */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <FaClipboardList className="text-accent" />
                        <h3 className="text-md font-semibold">Job Details</h3>
                    </div>
                    <p><strong>Management Role:</strong> {formData.managementRole}</p>
                    <p><strong>Employment Type:</strong> {formData.employmentType}</p>
                    <p><strong>Hire Type:</strong> {formData.hireType}</p>
                    <p><strong>Hiring Manager:</strong> {formData.hiringManager}</p>
                    <p><strong>Remote:</strong> {formData.isRemote ? 'Yes' : 'No'}</p>
                </div>

                {/* Location Information Card */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <FaMapMarkerAlt className="text-accent" />
                        <h3 className="text-md font-semibold">Location Information</h3>
                    </div>
                    <p><strong>Country:</strong> {formData.country}</p>
                    <p><strong>Address:</strong> {formData.address}</p>
                    <p><strong>City:</strong> {formData.city}</p>
                    <p><strong>State:</strong> {formData.state}</p>
                    <p><strong>ZIP:</strong> {formData.zip}</p>
                </div>

                {/* Job Description Card */}
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <FaBuilding className="text-accent" />
                        <h3 className="text-md font-semibold">Job Description</h3>
                    </div>
                    <div
                        className="border p-4 rounded-md bg-white"
                        dangerouslySetInnerHTML={{ __html: formData.description }}
                    />
                </div>
            </section>
            <section className="flex items-end justify-end">
                <div className="flex gap-4">
                    <button onClick={handleCancel} className="flex gap-2 items-center border-2 border-primary px-4 py-2 hover:border-[0.1rem] text-primary text-sm font-bold rounded-md">
                        <p>Cancel</p>
                    </button>
                    <button
                        onClick={handleOpenJob}
                        className="flex gap-2 items-center bg-primary disabled:bg-grey disabled:border-grey border-2 border-primary px-4 py-2 hover:bg-opacity-90 text-white text-sm font-bold rounded-md"
                    >
                        Save & Continue
                    </button>
                </div>
            </section>
        </>
    );
}
