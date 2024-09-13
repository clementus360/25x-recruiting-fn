'use client'

import { useParams} from "next/navigation";
import JobHeader from "@/components/Dashboard/Jobs/Job/JobHeader";
import JobNavigation from "@/components/Dashboard/Jobs/Job/JobNavigation";
import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { getSingleJob } from "@/data/jobsData";
import { Job } from "@/types/jobTypes";

export default function JobLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { companyInfo } = useCompany(); 
    
    const params = useParams<{ job: string }>()
    const { error, setError } = useError();
    const jobId = params.job

    const [job, setJob] = useState<Job>()

    useEffect(() => {
        const fetchJobInfo = async () => {
          try {
            const companyId = companyInfo?.id;
            const token = localStorage.getItem("accessToken");
    
            if (!token) {
              setError("User is not authenticated");
              return;
            }

            if (!companyId) {
                return
            }
    
            const data = await getSingleJob(companyId, jobId, token);
    
            setJob(data);
          } catch (error: any) {
            setError(`An error occured while loading job data`);
          }
        };
    
        fetchJobInfo();
      }, [companyInfo]);

    return (
        <div className="flex flex-col gap-12 h-max">
            
            {job && <JobHeader job={job} />}

            <section className="flex flex-col gap-8 pb-8 bg-white w-full rounded-md drop-shadow-sm">

                <JobNavigation jobId={params.job} />

                <div className="px-8 h-max">
                    {/* Page contents will appear here */}
                    {children}
                </div>
            </section>
        </div>
    );
}
