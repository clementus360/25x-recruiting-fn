'use client'

import Image from "next/image";
import NoteIcon from "@/assets/note.svg";
import PhoneIcon from "@/assets/phone.svg";
import EmailIcon from "@/assets/email.svg";
import LocationIcon from "@/assets/location.svg";

import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { getApplicantData, getCommentsForApplicant, getSingleJob, HireOrDeclineCandidate } from "@/data/jobsData";
import { DBSingleApplicant } from "@/types/applicationTypes";
import { Job, UserComment } from "@/types/jobTypes";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NotesOverlay } from "@/components/Dashboard/NotesOverlay";
import DisplayRating from "@/components/DisplayRating";
import ApplicantNavigation from "@/components/Dashboard/Applicant/ApplicantNavigation";
import DeclineReasonOverlay from "@/components/Dashboard/Jobs/Job/DeclineReasonOverlay";
import { useSuccess } from "@/context/SuccessContext";
import { getAccessToken } from "@/data/cookies";

export default function ApplicantLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [job, setJob] = useState<Job>()
    const [applicant, setApplicant] = useState<DBSingleApplicant>()
    const [isNotesOverlayOpen, setIsNotesOverlayOpen] = useState<boolean>(false);
    const params = useParams<{ applicantId: string }>()
    const searchParams = useSearchParams();
    const { companyInfo } = useCompany();
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [load, setLoad] = useState(false)
    const [loadNotes, setLoadNotes] = useState(false)
    const [notes, setNotes] = useState<UserComment[]>();
    const [isDeclineOverlayOpen, setIsDeclineOverlayOpen] = useState<boolean>(false);

    const applicantId = params.applicantId;
    const jobId = searchParams.get("jobId");

    const handleLoad = () => {
        setLoad(!load)
    }

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
            setError(`Error Fetching Job Info: ${error.message}`);
        }
    };

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

    const fetchNotes = async () => {
        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const data = await getCommentsForApplicant(Number(applicantId), token);
            setNotes(data);
        } catch (error: any) {
            setError(`Error fetching applicants: ${error.message}`);
        }

        setLoadNotes(false)
    };

    const handleMoveToCandidates = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!applicant) {
            return
        }

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await HireOrDeclineCandidate(applicant.id, Number(jobId), 1, token, "AdvanceToCandidate", " ");
            setSuccess("Applicant Moved to candidate successfully")
            handleLoad();
        } catch (error: any) {
            setError(`Error moving applicant to candidates`);
        }
    };


    const handleDeclineCandidate = async (reason: string) => {

        if (!applicant) {
            return
        }

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            await HireOrDeclineCandidate(applicant.id, Number(jobId), 1, token, "Decline", reason);

            setSuccess("Applicant denied successfully")
            handleLoad();
        } catch (error: any) {
            setError(`Error declining applicant: ${error.message}`);
        } finally {
            setIsDeclineOverlayOpen(false);
        }
    };

    const handleHireCandidate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const companyId = companyInfo?.id;

        if (!applicant) {
            return
        }

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            if (!companyId) {
                return
            }

            await HireOrDeclineCandidate(applicant.id, Number(jobId), 1, token, "Hire", " ");
            setSuccess("Candidate hired successfully", Number(companyId), applicant.id)
            handleLoad()
        } catch (error: any) {
            setError(`Error moving candidate to hires`);
        }
    }

    useEffect(() => {
        fetchNotes();
    }, [isNotesOverlayOpen, loadNotes]);

    useEffect(() => {
        fetchJobInfo();
    }, [companyInfo, jobId, applicantId]);

    useEffect(() => {
        fetchApplicantInfo()
    }, [applicantId, load]);

    const toggleNotesOverlay = () => {
        setIsNotesOverlayOpen(!isNotesOverlayOpen);
    };

    const handleCloseNotesOverlay = () => {
        setIsNotesOverlayOpen(false);
    };

    const handleOpenDeclineOverlay = () => {
        setIsDeclineOverlayOpen(true);
    };

    const handleCloseDeclineOverlay = () => {
        setIsDeclineOverlayOpen(false);
    };

    const displayStatus = (status: string | undefined) => {
        if (status === "APPLICANT") {
            return "Applicants"
        } else if (status === "CANDIDATE") {
            return "Candidates"
        } else if (status === "HIRED") {
            return "Hired"
        } else if (status === "DECLINED") {
            return "Declined"
        } else {
            return ""
        }
    }

    return (
        <div className="flex flex-col justify-between gap-8 py-8 w-full lg:pl-24 lg:pr-16">
            <section className="relative flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-grey">{job?.title} / {displayStatus(applicant?.status)}</p>

                    <div className="flex items-center gap-8">
                        <p className="text-3xl font-semibold text-gray-800">{applicant?.firstName} {applicant?.lastName}</p>
                        <div>
                            <div className="flex gap-2">
                                <button onClick={toggleNotesOverlay}>
                                    <Image src={NoteIcon} alt={"note"} className="min-w-4 min-h-4" />
                                </button>
                                <p>{notes?.length}</p>
                            </div>
                            {isNotesOverlayOpen && (
                                <NotesOverlay
                                    isNotesOverlayOpen={isNotesOverlayOpen}
                                    applicantId={Number(applicantId)}
                                    onClose={handleCloseNotesOverlay}
                                />
                            )}
                        </div>
                        {applicant &&
                            <DisplayRating
                                applicantId={applicant.id}
                                rating={applicant.rating}
                                handleLoadRatings={() => { }}
                            />
                        }
                    </div>

                    <div className="w-full flex justify-between">
                        <div className="flex flex-col lg:flex-row lg:gap-6">
                            <div className="flex items-center gap-2">
                                <Image src={PhoneIcon} alt="phone" className="w-3 h-3" />
                                <p className=" text-grey">{applicant?.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={EmailIcon} alt="email" className="w-3 h-3" />
                                <p className=" text-grey">{applicant?.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src={LocationIcon} alt="location" className="w-3 h-3" />
                                <p className=" text-grey">{applicant?.city}, {applicant?.state}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {applicant?.status === "APPLICANT" &&
                                <>
                                    <button onClick={handleOpenDeclineOverlay} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                                        Decline
                                    </button>
                                    <button onClick={handleMoveToCandidates} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                                        Move To Candidates
                                    </button>
                                </>
                            }
                            {applicant?.status === "CANDIDATE" &&
                                <>
                                    <button onClick={handleOpenDeclineOverlay} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                                        Decline
                                    </button>
                                    <button onClick={handleHireCandidate} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                                        Move To Hires
                                    </button>
                                </>
                            }
                            {(applicant?.status === "DECLINED" || applicant?.status === "HIRED") &&
                                <>
                                    <button onClick={handleMoveToCandidates} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                                        Move To Candidates
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </div>

                {isDeclineOverlayOpen && (
                    <DeclineReasonOverlay
                        onClose={handleCloseDeclineOverlay}
                        onSubmit={handleDeclineCandidate}
                    />
                )}
            </section>

            <section className="flex flex-col gap-8 pb-8 bg-white w-full rounded-md drop-shadow-sm">
                {jobId && <ApplicantNavigation applicantId={applicantId} jobId={jobId} />}

                <div className="px-8 h-max">
                    {/* Page contents will appear here */}
                    {children}
                </div>
            </section>
        </div>
    )
}