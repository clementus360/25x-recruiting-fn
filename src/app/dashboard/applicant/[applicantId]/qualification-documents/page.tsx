'use client';

import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { documentTypeMapping, qualificationDocumentsSteps } from "@/data/constants";
import { getAccessToken } from "@/data/cookies";
import { getApplicantData } from "@/data/jobsData";
import { startCollectingDocuments } from "@/data/onboarding";
import { getApplicantQualificationDocument } from "@/data/qualificationDocuments";
import { DBSingleApplicant } from "@/types/applicationTypes";
import { QualificationDocument } from "@/types/documentTypes";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";

export default function ApplicantQualificationDocuments() {
    const [applicant, setApplicant] = useState<DBSingleApplicant>();
    const [documentStatus, setDocumentStatus] = useState<string>('NOT_STARTED');
    const [documents, setDocuments] = useState<QualificationDocument[]>([]);
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const params = useParams<{ applicantId: string }>();
    const { companyInfo } = useCompany();
    const searchParams = useSearchParams();
    const applicantId = params.applicantId;
    const jobId = searchParams.get("jobId");

    const fetchDocumentStatuses = async () => {
        try {
            const token = getAccessToken();
            const onboardingId = applicant?.onboardingId;

            if (!token) return;
            if (!onboardingId) return;

            const response = await getApplicantQualificationDocument(onboardingId.toString(), token);
            setDocuments(response.qualificationDocumentsInfo);
            setDocumentStatus(response.overallDocumentStatus || 'NOT_STARTED');
        } catch (error: any) {
            setError(error.message || 'Failed to fetch document statuses.');
        }
    };

    const fetchApplicantInfo = async () => {
        try {
            const token = getAccessToken();
            if (!token || !jobId) return;
            const data = await getApplicantData(applicantId, token);
            setApplicant(data);
        } catch (error: any) {
            setError(error.message || `Error Fetching Applicant Info`);
        }
    };

    const handleStartCollectingDocuments = async () => {
        try {
            const companyId = companyInfo?.id;
            const token = getAccessToken();
            if (!token || !companyId) return;

            await startCollectingDocuments(Number(companyId), Number(applicantId), token);
            setSuccess("Document collection started successfully");
        } catch (error: any) {
            setError(error.message || "Failed to start document collection");
        }
    };

    useEffect(() => {
        fetchApplicantInfo();
    }, [applicantId]);

    useEffect(() => {
        if (applicant && applicant.onboardingId) {
            fetchDocumentStatuses();
        }
    }, [applicant]);

    return (
        <div className="flex flex-col  py-12 w-full min-h-80">
            {applicant?.status === "HIRED" ? (
                applicant.onboardingId ? (
                    <>
                        <h5 className="flex items-center gap-4 font-bold uppercase py-8">Qualification Documents
                            {documentStatus === "COMPLETED" ?
                                <div className={`flex gap-2 text-green-500`}>
                                    <FaCheckCircle /> Completed
                                </div>
                                :
                                <div className={`flex gap-2 items-center text-yellow-500`}>
                                    <FaClock /> Pending
                                </div>
                            }
                        </h5>
                        <ul className="flex flex-wrap items-center gap-x-2">

                            {qualificationDocumentsSteps.map((step, idx) => {
                                const mappedType = documentTypeMapping[step];
                                const document = documents.find(doc => doc.documentType === mappedType);

                                return (
                                    <>
                                        <li
                                            key={idx}
                                            className={`border-gray-300 pb-2`}
                                        >
                                            <div className="flex items-center flex-wrap gap-2">
                                                {document ? (
                                                    <a href={document.documentUrl} target="_blank" download>
                                                        <div className="flex items-center text-sm space-x-2 py-1 px-2 rounded-lg w-full sm:w-auto">
                                                            <FaCheckCircle className={`${document.status === "COMPLETED" ? 'text-green-500' : 'text-red-400'}`} />
                                                            <span className="text-green-500">{idx + 1}. {step}</span>
                                                        </div>
                                                    </a>
                                                ) : (
                                                    <div className="flex items-center text-sm space-x-2 py-1 px-2 rounded-lg w-full sm:w-auto">
                                                        <FaClock className={`text-yellow-500`} />
                                                        <span className="text-yellow-500">{idx + 1}. {step}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                        <div className="h-1 w-1 bg-grey rounded-full"></div>
                                    </>
                                );
                            })}
                        </ul>
                    </>
                )
                    :
                    (<div className="flex flex-col items-center gap-2">
                        <p className="text-grey text-center">This candidate doesn&apos;t have any documents yet. <br /> Click the button below to start collecting documents.</p>
                        <button onClick={handleStartCollectingDocuments} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-6 py-2 text-white text-sm font-bold rounded-md">
                            <p>Start Collecting Documents</p>
                        </button>
                    </div>)
            ) : (
                <div className="flex flex-col items-center text-center gap-4">
                    <p className="text-grey">
                        This applicant must be hired before you can start collecting documents.
                    </p>
                </div>
            )}
        </div>
    );
}
