'use client'

import Image from "next/image";

import ImportIcon from "@/assets/import.svg"
import UploadOverlay from "@/components/UploadOverlay";
import { useEffect, useState } from "react";
import { DBSingleApplicant } from "@/types/applicationTypes";
import { useParams, useSearchParams } from "next/navigation";
import { getApplicantData } from "@/data/jobsData";
import { useError } from "@/context/ErrorContext";
import { getAccessToken } from "@/data/cookies";

export default function ApplicantResume() {
    const [applicant, setApplicant] = useState<DBSingleApplicant>()
    const { setError } = useError();
    const [isUploadOverlayOpen, setIsUploadOverlayOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File>()
    const params = useParams<{ applicantId: string }>()
    const searchParams = useSearchParams();
    const applicantId = params.applicantId;
    const jobId = searchParams.get("jobId");

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
            setError(`Error Fetching Applicant Info: ${error.message}`);
        }
    }

    useEffect(() => {
        fetchApplicantInfo()
    }, [applicantId]);

    const closeUploadOverlay = () => {
        setIsUploadOverlayOpen(false)
    }

    const openUploadOverlay = () => {
        setIsUploadOverlayOpen(true)
    }

    const handleAddFile = (file: File) => {
        setFile(file)
        closeUploadOverlay();
    }

    return (
        <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-full py-8 rounded-lg">
            {applicant?.coverLetterUrl ?
                <a href={applicant.coverLetterUrl} className="text-xl text-primary underline font-bold animate-bounce cursor-pointer">Download {applicant.firstName}&apos;s Cover Letter</a>
                :
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-bold">There isn&apos;t a cover letter file for {applicant?.firstName}.</p>
                    <button onClick={openUploadOverlay} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-sm font-bold rounded-md">
                        <Image src={ImportIcon} height={14} width={14} alt={"search"} />
                        <p>Import Applicant Cover Letter</p>
                    </button>
                    <p className="text-xs text-grey">Accepted file types: .pdf, .docx, .doc</p>
                </div>}
            {isUploadOverlayOpen && (
                <UploadOverlay onAddFile={handleAddFile} onClose={closeUploadOverlay} />
            )}
        </div>
    )
}