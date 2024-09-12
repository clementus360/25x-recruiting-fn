'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { Applicant } from "@/types/applicationTypes";
import NoteIcon from "@/assets/note.svg";
import PhoneIcon from "@/assets/phone.svg";
import EmailIcon from "@/assets/email.svg";
import LocationIcon from "@/assets/location.svg";
import { NotesOverlay } from "../NotesOverlay";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { JobCardData, UserComment } from "@/types/jobTypes";
import { getCommentsForApplicant, getJobs } from "@/data/jobsData";
import { useCompany } from "@/context/CompanyContext";
import { DBCandidate } from "@/types/candidateTypes";

export default function CandidateCard({
    candidate,
    selectedRows,
    selectedJob,
    handleSelectRow,
    handleLoad
}: {
    candidate: DBCandidate;
    selectedRows: number[];
    selectedJob: string;
    handleSelectRow: (candidateId: number) => void;
    handleLoad: (load: boolean) => void;
}) {
    const [jobs, setJobs] = useState<JobCardData[]>([]);
    const [isNotesOverlayOpen, setIsNotesOverlayOpen] = useState<boolean>(false);
    const [notes, setNotes] = useState<UserComment[]>();
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const { companyInfo } = useCompany();
    const [loadNotes, setLoadNotes] = useState(false)

    useEffect(() => {
        const fetchJobs = async () => {
          setError("");

          try {
            const companyId = companyInfo?.id; // Replace with the actual company ID
            const token = localStorage.getItem("accessToken"); // Replace with the actual token
    
            if (!companyId || !token) {
              return;
            }
    
            const jobsData = await getJobs(companyId, token, 1);
            setJobs(jobsData.jobs);
          } catch (err) {
            setError("Failed to load jobs");
          }
        };
    
        fetchJobs();
      }, [companyInfo]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    return;
                }

                const data = await getCommentsForApplicant(candidate.id, token);
                setNotes(data);
            } catch (error: any) {
                setError(`Error fetching applicant notes: ${error.message}`);
            }

            setLoadNotes(false)
        };

        if (isNotesOverlayOpen) {
            fetchNotes();
        }
    }, [isNotesOverlayOpen, loadNotes]);

    const handleLoadNotes = () => {
        setLoadNotes(true)
    }

    const toggleNotesOverlay = () => {
        setIsNotesOverlayOpen(!isNotesOverlayOpen);
    };

    const handleCloseNotesOverlay = () => {
        setIsNotesOverlayOpen(false);
    };

    const handleMoveApplicant = (applicantId: number, job: string) => {
        console.log(`Applicant ${applicantId} moved to ${job}`);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between lg:items-center bg-lightBlue px-4 py-6 rounded-lg">
            <div className="flex gap-8 items-center">
                <input
                    type="checkbox"
                    checked={selectedRows.includes(candidate.id)}
                    onChange={() => handleSelectRow(candidate.id)}
                />
                <p className="px-6 py-4 align-middle whitespace-nowrap text-lg font-bold text-gray-900">
                    {candidate.name}
                </p>
            </div>

            <div className="flex flex-col gap-4 lg:gap-4 items-start">
                <div className="flex flex-col lg:flex-row lg:justify-between whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="flex items-center gap-2">
                            <Image src={PhoneIcon} alt="phone" className="w-3 h-3" />
                            <p>{candidate.phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src={EmailIcon} alt="email" className="w-3 h-3" />
                            <p>{candidate.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Image src={LocationIcon} alt="location" className="w-3 h-3" />
                            <p>{candidate.city}, {candidate.state}</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-bold text-md text-gray-700">
                        {candidate.companyName}
                    </p>
                    <div className="bg-black w-1 h-1 aspect-square rounded-full"></div>
                    <p className="text-sm text-gray-500 font-bold">
                        Applied, <span className="font-normal">{candidate.createdDate}</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-row-reverse lg:flex-row gap-16 items-center justify-between">
                <div className="relative">
                    <button onClick={toggleNotesOverlay}>
                        <Image src={NoteIcon} alt="note" className="w-5 h-5" />
                    </button>
                    {isNotesOverlayOpen && (
                        <NotesOverlay
                            notes={notes}
                            applicantId={candidate.id}
                            onClose={handleCloseNotesOverlay}
                            handleLoadNotes={handleLoadNotes}
                        />
                    )}
                </div>

                <div className="flex gap-2">
                    <select
                        value={selectedJob}
                        onChange={(e) => handleMoveApplicant(candidate.id, e.target.value)}
                        className="bg-primary hover:bg-opacity-90 w-24 truncate px-2 py-2 text-white text-xs font-semibold rounded-md"
                    >
                        <option value="" disabled>Move to</option>
                        {jobs.map((job, index) => (
                            <option key={index} value={job.title}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
