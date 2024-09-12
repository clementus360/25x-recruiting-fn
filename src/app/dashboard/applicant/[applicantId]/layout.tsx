'use client'

import Image from "next/image";
import NoteIcon from "@/assets/note.svg";
import PhoneIcon from "@/assets/phone.svg";
import EmailIcon from "@/assets/email.svg";
import LocationIcon from "@/assets/location.svg";

import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { getApplicantData, getCommentsForApplicant, getSingleJob } from "@/data/jobsData";
import { DBTestApplicant } from "@/types/applicationTypes";
import { Job, UserComment } from "@/types/jobTypes";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NotesOverlay } from "@/components/Dashboard/NotesOverlay";
import DisplayRating from "@/components/DisplayRating";
import ApplicantNavigation from "@/components/Dashboard/Applicant/ApplicantNavigation";

export default function ApplicantLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [job, setJob] = useState<Job>()
    const [applicant, setApplicant] = useState<DBTestApplicant>()
    const [isNotesOverlayOpen, setIsNotesOverlayOpen] = useState<boolean>(false);
    const params = useParams<{ applicantId: string }>()
    const searchParams = useSearchParams();
    const { companyInfo } = useCompany();
    const { setError } = useError();
    const [loadNotes, setLoadNotes] = useState(false)
    const [notes, setNotes] = useState<UserComment[]>();

    const applicantId = params.applicantId;
    const jobId = searchParams.get("jobId");

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

            if (!jobId) {
                return
            }

            const data = await getSingleJob(companyId, jobId, token);

            console.log("Data:", data)

            setJob(data);
        } catch (error: any) {
            setError(`Error Fetching Job Info: ${error.message}`);
        }
    };

    const fetchApplicantInfo = async () => {
        try {
            const token = localStorage.getItem("accessToken");

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
            const token = localStorage.getItem("accessToken");
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

    useEffect(() => {
        fetchNotes();
    }, [isNotesOverlayOpen, loadNotes]);

    const handleLoadNotes = () => {
        setLoadNotes(true)
    }

    useEffect(() => {
        fetchJobInfo();
    }, [companyInfo, jobId, applicantId]);

    useEffect(() => {
        fetchApplicantInfo()
    }, [applicantId]);

    const toggleNotesOverlay = () => {
        setIsNotesOverlayOpen(!isNotesOverlayOpen);
    };

    const handleCloseNotesOverlay = () => {
        setIsNotesOverlayOpen(false);
    };


    return (
        <div className="flex flex-col justify-between gap-8 py-8 w-full lg:pl-24 lg:pr-16">
            <section className="relative flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-grey">{job?.title} / Applicants</p>

                    <div className="flex items-center gap-8">
                        <p className="text-3xl font-semibold text-gray-800">{applicant?.applicantName}</p>
                        <div>
                            <div className="flex gap-2">
                                <button onClick={toggleNotesOverlay}>
                                    <Image src={NoteIcon} alt={"note"} className="min-w-4 min-h-4" />
                                </button>
                                <p>{notes?.length}</p>
                            </div>
                            {isNotesOverlayOpen && (
                                <NotesOverlay
                                    notes={notes}
                                    applicantId={Number(applicantId)}
                                    onClose={handleCloseNotesOverlay}
                                    handleLoadNotes={handleLoadNotes}
                                />
                            )}
                        </div>
                        {applicant &&
                            <DisplayRating
                                applicantId={applicant.applicantId}
                                rating={applicant.numOfRatings}
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
                            <button className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                                Decline
                            </button>
                            <button className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                                Move To Hires
                            </button>
                        </div>
                    </div>
                </div>
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