import Image from "next/image";

import PlusIcon from "@/assets/plus.svg"
import { Job } from "@/types/jobTypes";
import { useCompany } from "@/context/CompanyContext";


export default function JobHeader({ job }: { job: Job }) {
    const { companyInfo } = useCompany();

    return (
        <section className="flex flex-col gap-8 lg:gap-0 lg:flex-row justify-between px-4 lg:px-0">
            <div className="flex flex-col gap-6 lg:gap-2">
                <div>
                    <h2 className="text-accent font-light">{companyInfo?.companyName} / Jobs</h2>
                    <h1 className="text-4xl font-bold">{job.title}</h1>
                </div>

                <div className="flex flex-col lg:flex-row justify-between gap-2 lg:gap-8">
                    <p className=" text-grey font-light">{job.city}, {job.state}</p>

                    <div className="flex gap-4">
                        <div className="flex gap-1 items-center">
                            <label className="font-bold" htmlFor="status">Status:</label>

                            <select defaultValue={job.status} className="bg-transparent text-grey font-light" name="status" id="status">
                                <option value="OPENED">Open</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>


                        <div className="flex gap-1 items-center">
                            <label className=" font-bold" htmlFor="status">Visibility:</label>

                            <select defaultValue={job.visibility} className="bg-transparent text-grey font-light" name="status" id="status">
                                <option value="INTERNAL">Internal</option>
                                <option value="PUBLIC">Public</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-max items-center lg:self-center lg:justify-self-end">
                <button className="flex gap-2 items-center bg-primary h-max w-max px-4 py-2 text-white text-sm font-bold rounded-md">
                    <Image src={PlusIcon} height={14} width={14} alt={"search"} />
                    <p>Import Candidates CSV</p>
                </button>
            </div>
        </section>
    )
}