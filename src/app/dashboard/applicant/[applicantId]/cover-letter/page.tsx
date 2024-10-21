'use client'

import Image from "next/image";

import ImportIcon from "@/assets/import.svg"
import UploadOverlay from "@/components/UploadOverlay";
import { useEffect, useState } from "react";
import { DBSingleApplicant, SpecificSingleApplicant } from "@/types/applicationTypes";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getApplicantData } from "@/data/jobsData";
import { useError } from "@/context/ErrorContext";
import { getAccessToken } from "@/data/cookies";
import UploadPDFOverlay from "@/components/UploadPDFOverlay";
import { saveCoverLetter, uploadCoverLetter } from "@/data/appplicant";
import { useSuccess } from "@/context/SuccessContext";

export default function ApplicantResume() {
    const [loading, setLoading] = useState<boolean>(false);
    const { setSuccess } = useSuccess()
    const [applicant, setApplicant] = useState<SpecificSingleApplicant>()
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

            console.log(data)

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

    const handleAddCoverLetter = async (file: File) => {

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

            const resumeUrl = await uploadCoverLetter(file, file.name);
            if (!resumeUrl) {
                throw new Error("Failed to upload resume.");
            }

            await saveCoverLetter(resumeUrl, applicant?.id.toString(), token);

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
            {applicant?.coverLetter ?
                <a href={applicant.coverLetter} target="_blank" className="text-xl text-primary underline font-bold animate-bounce cursor-pointer">Download {applicant.firstName}&apos;s Cover Letter</a>
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
                <UploadPDFOverlay loading={loading} onAddFile={handleAddCoverLetter} onClose={closeUploadOverlay} />
            )}
        </div>
    )
}