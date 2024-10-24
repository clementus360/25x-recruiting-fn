'use client'

import Image from "next/image";

import ImportIcon from "@/assets/import.svg"
import UploadOverlay from "@/components/UploadOverlay";
import { useEffect, useState } from "react";
import { DBSingleApplicant } from "@/types/applicationTypes";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getApplicantData } from "@/data/jobsData";
import { useError } from "@/context/ErrorContext";
import { getAccessToken } from "@/data/cookies";
import { saveResume, uploadResume } from "@/data/appplicant";
import { useSuccess } from "@/context/SuccessContext";
import UploadPDFOverlay from "@/components/UploadPDFOverlay";

export default function ApplicantResume() {
    const [loading, setLoading] = useState<boolean>(false);
    const { setSuccess } = useSuccess()
    const [applicant, setApplicant] = useState<DBSingleApplicant>()
    const { setError } = useError();
    const [isUploadOverlayOpen, setIsUploadOverlayOpen] = useState<boolean>(false);
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
            setError(error.message || `Error Fetching Applicant Info`);
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

    const handleAddResume = async (file: File) => {
    
        setLoading(true);
        setError("");
        setSuccess("");
    
        try {
            const token = getAccessToken();
            if (!token) {
                throw new Error("User is not authenticated");
            }

            if (!applicant) {
                throw new Error("Applicant not found");
            }
    
            // Check the file type
            if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
                throw new Error("Please upload a valid PDF or DOCX resume.");
            }
    
            const resumeUrl = await uploadResume(file, file.name);
            if (!resumeUrl) {
                throw new Error("Failed to upload resume.");
            }
    
            await saveResume(resumeUrl, applicant?.id.toString(), token);

            await fetchApplicantInfo();

            setSuccess("Resume uploaded and saved successfully!");

            closeUploadOverlay();
    
        } catch (error: any) {
            setError(error.message || "An error occurred while uploading the resume.");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-full py-8 rounded-lg">
            {applicant?.resume ?
                <a href={applicant.resume} target="_blank" className="text-xl text-primary underline font-bold animate-bounce cursor-pointer">Download {applicant.firstName}&apos;s Resume</a>
                :
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-bold">There isn&apos;t a Resume on file for {applicant?.firstName}.</p>
                    <button onClick={openUploadOverlay} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-sm font-bold rounded-md">
                        <Image src={ImportIcon} height={14} width={14} alt={"search"} />
                        <p>Import Applicant Resume</p>
                    </button>
                    <p className="text-xs text-grey">Accepted file types: .pdf, .docx, .doc</p>
                </div>
            }
            {isUploadOverlayOpen && (
                <UploadPDFOverlay loading={loading} onAddFile={handleAddResume} onClose={closeUploadOverlay} />
            )}
        </div>
    )
}