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
import { getAccessToken } from "@/data/cookies";

export default function CandidateCard({
    candidate,
    handleLoad
}: {
    candidate: DBCandidate;
    handleLoad: () => void;
}) {
    const [isNotesOverlayOpen, setIsNotesOverlayOpen] = useState<boolean>(false);
    const [notes, setNotes] = useState<UserComment[]>();
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const { companyInfo } = useCompany();
    const [loadNotes, setLoadNotes] = useState(false)

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = getAccessToken();
                if (!token) {
                    return;
                }

                const data = await getCommentsForApplicant(candidate.id, token);
                setNotes(data);
            } catch (error: any) {
                setError(error.message || `An error occured while loading applicant notes`);
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
        handleLoad()
    };

    const handleMoveApplicant = (applicantId: number, job: string) => {
        console.log(`Applicant ${applicantId} moved to ${job}`);
    };

    return (
        <div className="w-10/12 lg:w-full flex flex-col lg:flex-row gap-4 lg:gap-0 justify-between lg:items-center bg-gray-50 px-4 py-6 lg:pr-24 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex gap-8 items-center">
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

            <div className="flex flex-row-reverse self-start lg:self-center lg:flex-row gap-16 items-center justify-between">
                <div className="relative">
                    <button onClick={toggleNotesOverlay}>
                        <Image src={NoteIcon} alt="note" className="w-5 h-5" />
                        <p>{candidate.applicantComments?.length}</p>
                    </button>
                    {isNotesOverlayOpen && (
                        <NotesOverlay
                            isNotesOverlayOpen={isNotesOverlayOpen}
                            applicantId={candidate.id}
                            onClose={handleCloseNotesOverlay}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
