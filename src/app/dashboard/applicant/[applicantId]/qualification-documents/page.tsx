'use client'

import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { getAccessToken } from "@/data/cookies";
import { getApplicantData } from "@/data/jobsData";
import { startCollectingDocuments } from "@/data/onboarding";
import { DBSingleApplicant } from "@/types/applicationTypes";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplicantQualificationDocuments() {
    const [applicant, setApplicant] = useState<DBSingleApplicant>()
    const [load, setLoad] = useState(false)
    const { setError } = useError();
    const { success, setSuccess } = useSuccess();
    const params = useParams<{ applicantId: string }>()
    const { companyInfo } = useCompany();
    const searchParams = useSearchParams();
    const applicantId = params.applicantId;
    const jobId = searchParams.get("jobId");

    const handleLoad = () => {
        setLoad(!load)
    }

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

    const handleStartCollectingDocuments = async () => {
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

            await startCollectingDocuments(Number(companyId), Number(applicantId), token)

            setSuccess("Document collection started successfully")
        } catch (error: any) {
            console.log(error)
            setError(error.message || "Failed to start document collection");
        }
    }

    useEffect(() => {
        fetchApplicantInfo()
    }, [applicantId, load]);

    useEffect(() => {
        if (success==="Candidate hired successfully") {
            handleLoad()
        }
    }, [success])

    return (
        <div className="flex items-center justify-center w-full min-h-80">
            {applicant?.status === "HIRED" ?
                <div className="flex flex-col items-center gap-2">
                    <p className="text-grey text-center">This candidate doesn&apos;t have any documents yet. <br /> Click the button below to start collecting documents.</p>
                    <button onClick={handleStartCollectingDocuments} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-6 py-2 text-white text-sm font-bold rounded-md">
                        <p>Start Collecting Documents</p>
                    </button>
                </div> :
                <p className="text-grey text-center">Hire candidate to start collecting documents.</p>

            }
        </div>
    )
}