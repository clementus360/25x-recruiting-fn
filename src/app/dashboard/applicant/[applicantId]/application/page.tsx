'use client'

import { useCompany } from "@/context/CompanyContext"
import { useError } from "@/context/ErrorContext"
import { getAccessToken } from "@/data/cookies"
import { getApplicantData, getSingleJob } from "@/data/jobsData"
import { SpecificSingleApplicant } from "@/types/applicationTypes"
import { Job } from "@/types/jobTypes"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ApplicantApplication() {
    const [applicant, setApplicant] = useState<SpecificSingleApplicant>()
    const [job, setJob] = useState<Job>()
    const { setError } = useError();
    const params = useParams<{ applicantId: string }>()
    const searchParams = useSearchParams();
    const { companyInfo } = useCompany();

    const jobId = searchParams.get("jobId");
    const applicantId = params.applicantId;

    const fetchApplicantInfo = async () => {
        try {
            const token = getAccessToken();

            if (!token) {
                setError("User is not authenticated");
                return;
            }

            if (!jobId) {
                return
            }

            const data = await getApplicantData(applicantId, token);

            setApplicant(data);
        } catch (error: any) {
            setError(error.message || `Error Fetching Applicant Info`);
        }
    }

    useEffect(() => {
        fetchApplicantInfo()
    }, [applicantId]);

    const fetchJobInfo = async () => {
        try {
            const companyId = companyInfo?.id;
            const token = getAccessToken();

            if (!token) {
                setError("User is not authenticated");
                return;
            }

            if (!companyId) {
                return
            }

            if (!jobId) {
                return
            }

            const data = await getSingleJob(companyId, jobId, token);

            setJob(data);
        } catch (error: any) {
            setError(error.message || `Error Fetching Job Info`);
        }
    };

    useEffect(() => {
        fetchJobInfo();
    }, [companyInfo, jobId, applicantId]);

    return (
        <div className="bg-white rounded-md w-full">
            <h2 className="text-lg md:text-xl mb-2 md:mb-4 font-bold">
                Position Applying For: {job?.title}
            </h2>
            <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <tbody>
                    {/** First row */}
                    <tr>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">First Name:</span>
                                <span className="text-base md:text-lg">{applicant?.firstName}</span>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Last Name:</span>
                                <span className="text-base md:text-lg">{applicant?.lastName}</span>
                            </div>
                        </td>
                    </tr>

                    {/** Second row */}
                    <tr>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Email:</span>
                                <span className="text-base md:text-lg">{applicant?.email}</span>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Phone:</span>
                                <span className="text-base md:text-lg">{applicant?.phone}</span>
                            </div>
                        </td>
                    </tr>

                    {/** Third row */}
                    <tr>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Address:</span>
                                <span className="text-base md:text-lg">{applicant?.address}</span>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">City:</span>
                                <span className="text-base md:text-lg">{applicant?.city}</span>
                            </div>
                        </td>
                    </tr>

                    {/** Fourth row */}
                    <tr>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">State:</span>
                                <span className="text-base md:text-lg">{applicant?.state}</span>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Zip Code:</span>
                                <span className="text-base md:text-lg">{applicant?.zipCode}</span>
                            </div>
                        </td>
                    </tr>

                    {/** Fifth row */}
                    <tr>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Country:</span>
                                <span className="text-base md:text-lg">{applicant?.country}</span>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Referred By:</span>
                                <span className="text-base md:text-lg">{applicant?.referredBy}</span>
                            </div>
                        </td>
                    </tr>

                    {/** Sixth row */}
                    <tr>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Resume:</span>
                                <a href={applicant?.resume} className="text-blue-500 underline text-sm md:text-base" target="_blank" rel="noopener noreferrer">
                                    View Resume
                                </a>
                            </div>
                        </td>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Cover Letter:</span>
                                <a href={applicant?.coverLetter} className="text-blue-500 underline text-sm md:text-base" target="_blank" rel="noopener noreferrer">
                                    View Cover Letter
                                </a>
                            </div>
                        </td>
                    </tr>

                    {/** Seventh row */}
                    <tr>
                        <td className="border border-gray-300 p-2 md:p-4">
                            <div className="flex flex-col">
                                <span className="text-xs md:text-sm font-medium text-gray-500">Status:</span>
                                <span className="text-base md:text-lg">{applicant?.status}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}