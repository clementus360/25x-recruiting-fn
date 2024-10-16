import Image from "next/image";

import PlusIcon from "@/assets/plus.svg"
import { Job } from "@/types/jobTypes";
import { useCompany } from "@/context/CompanyContext";
import Select from "@/components/Select";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/data/cookies";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { updateJob } from "@/data/jobsData";

export default function JobHeader({ job }: { job: Job }) {
    const [status, setStatus] = useState(job.status)
    const [visibility, setVisibility] = useState(job.visibility)
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const { companyInfo } = useCompany();

    const handleStatusChange = async (value: string) => {
        setStatus(value)

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            if (!companyInfo?.id) {
                return
            }

            const newStatus = {
                status: value
            }

            await updateJob(companyInfo?.id, job.id.toString(), newStatus, token)
            setSuccess("Job status updated successfully")
        } catch (error: any) {
            setError(`Error updating job status`);
        }
    }

    const handleVisibilityChange = async (value: string) => {
        setVisibility(value)

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            if (!companyInfo?.id) {
                return
            }

            const newVisibility = {
                visibility: value
            }

            await updateJob(companyInfo?.id, job.id.toString(), newVisibility, token)
            setSuccess("Job visibility updated successfully")
        } catch (error: any) {
            setError(`Error updating job visibility`);
        }
    }

    return (
        <section className="flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between px-4 lg:px-0">
            <div className="flex flex-col gap-6 lg:gap-2">
                <div>
                    <h2 className="text-accent font-light">{companyInfo?.companyName} / Jobs</h2>
                    <h1 className="text-4xl font-bold">{job.title}</h1>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-2 lg:gap-8">
                    <p className=" text-grey font-light">{job.city}, {job.state}</p>

                    <div className="flex gap-4">
                        <div className="flex gap-1 items-center">
                            <label className="font-bold" htmlFor="status">Status:</label>

                            <Select
                                options={[
                                    { value: "OPENED", label: "Open" },
                                    { value: "CLOSED", label: "Closed" }
                                ]}
                                value={status}
                                onChange={(value: any) => handleStatusChange(value)}
                                className="w-full h-full bg-lightBlue border-none"
                            />
                        </div>


                        <div className="flex gap-1 items-center">
                            <label className=" font-bold" htmlFor="status">Visibility:</label>

                            <Select
                                options={[
                                    { value: "INTERNAL", label: "Internal" },
                                    { value: "PUBLIC", label: "Public" }
                                ]}
                                value={visibility}
                                onChange={(value: any) => handleVisibilityChange(value)}
                                className="w-full h-full bg-lightBlue border-none"
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-max items-center lg:self-center lg:justify-self-end">
                {/* <button className="flex gap-2 items-center bg-primary h-max w-max px-4 py-2 text-white text-sm font-bold rounded-md">
                    <Image src={PlusIcon} height={14} width={14} alt={"search"} />
                    <p>Import Candidates CSV</p>
                </button> */}
            </div>
        </section>
    )
}