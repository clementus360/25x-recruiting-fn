import Image from "next/image";
import NoteIcon from "@/assets/note.svg";

import { NotesOverlay } from "@/components/Dashboard/NotesOverlay";
import DisplayRating from "@/components/DisplayRating";
import { useError } from "@/context/ErrorContext";
import { getCommentsForApplicant, HireOrDeclineCandidate } from "@/data/jobsData";
import { ApplicantRowProps } from "@/types/applicationTypes";
import { UserComment } from "@/types/jobTypes";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSuccess } from "@/context/SuccessContext";
import Link from "next/link";

export const HireRow: React.FC<ApplicantRowProps> = ({
    applicant,
    selectedRows,
    page,
    handleSelectRow,
    handleLoad
}) => {
    const [isNotesOverlayOpen, setIsNotesOverlayOpen] = useState<boolean>(false);
    const [notes, setNotes] = useState<UserComment[]>();
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const params = useParams<{ job: string }>();
    const jobId = params.job;
    const [loadNotes, setLoadNotes] = useState(false)

    const handleHireCandidate = async (e: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                return;
            }

            await HireOrDeclineCandidate(applicant.applicantId, Number(jobId), page, token, "AdvanceToCandidate", " ");
            setSuccess("Candidate hired successfully");
            handleLoad(true);
        } catch (error: any) {
            setError(`Error Moving Applicant To Candidates: ${error.message}`);
        }
    };

    const handleLoadNotes = () => {
        setLoadNotes(true)
    }

    const toggleNotesOverlay = () => {
        setIsNotesOverlayOpen(!isNotesOverlayOpen);
    };

    const handleCloseNotesOverlay = () => {
        setIsNotesOverlayOpen(false);
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    return;
                }

                const data = await getCommentsForApplicant(applicant.applicantId, token);
                setNotes(data);
            } catch (error: any) {
                setError(`Error fetching applicants: ${error.message}`);
            }
            handleLoad(false);
        };

        fetchNotes();
    }, [isNotesOverlayOpen, loadNotes]);

    return (
        <>
            <tr key={applicant.applicantId}>
                <td className="px-6 py-4 align-middle whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(applicant.applicantId)}
                        onChange={() => handleSelectRow(applicant.applicantId)}
                    />
                </td>
                <td className="px-6 py-4 align-middle whitespace-nowrap text-sm font-bold text-accent">
                    <Link href={`/dashboard/applicant/${applicant.applicantId}/resume?jobId=${jobId}`}>{applicant.applicantName}</Link>
                </td>
                <td className="px-6 py-4 align-middle whitespace-nowrap text-sm font-light text-gray-500">
                    {applicant.createdDate}
                </td>
                <td className="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-500">
                    {applicant.applicantName}
                </td>
                <td className="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-500">
                    <DisplayRating
                        applicantId={applicant.applicantId}
                        rating={applicant.numOfRatings}
                        handleLoadRatings={handleLoad}
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-4">
                        <button onClick={toggleNotesOverlay}>
                            <Image src={NoteIcon} alt={"note"} className="min-w-5 min-h-5" />
                        </button>
                    </div>
                    {isNotesOverlayOpen && (
                        <NotesOverlay
                            notes={notes}
                            applicantId={applicant.applicantId}
                            onClose={handleCloseNotesOverlay}
                            handleLoadNotes={handleLoadNotes}
                        />
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                        <button onClick={handleHireCandidate} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">
                            Move To Candidates
                        </button>
                    </div>
                </td>
            </tr>
        </>
    );
};
