import { useState } from "react";
import Image from "next/image";
import NoteIcon from "@/assets/note.svg";
import DisplayRating from "@/components/DisplayRating";
import { NotesOverlay } from "@/components/Dashboard/NotesOverlay";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { Category, ScreeningRowProps } from "@/types/ScreeningTypes";
import { JobCardData } from "@/types/jobTypes";
import Select from "@/components/Select";
import { moveApplicantToJob, moveApplicantToList } from "@/data/screeningData"; // Import the API function
import { getAccessToken } from "@/data/cookies";
import { fortMyersScreeningCategories, sarasotaScreeningCategories } from "@/data/constants";
import { useSearchParams } from "next/navigation";

export const ScreeningRow: React.FC<ScreeningRowProps> = ({
    applicant,
    page,
    selectedRows,
    handleSelectRow,
    handleLoad,
    jobs,
}) => {
    const [isNotesOverlayOpen, setIsNotesOverlayOpen] = useState<boolean>(false);
    const [selectedJobId, setSelectedJobId] = useState<string>(""); // State to track the selected job
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const searchParams = useSearchParams();
    const location = searchParams.get("location");

    // Toggle notes overlay
    const toggleNotesOverlay = () => {
        setIsNotesOverlayOpen(!isNotesOverlayOpen);
    };

    // Close notes overlay and refresh data
    const handleCloseNotesOverlay = () => {
        setIsNotesOverlayOpen(false);
        handleLoad();
    };

    // Handle moving applicant to a selected job
    const handleMoveApplicant = async (jobId: string) => {
        try {
            const token = getAccessToken();
            if (!token) {
                setError("User is not authenticated");
                return;
            }

            // Move the single applicant to the selected job
            const responseMessage = await moveApplicantToJob(jobId, [applicant.applicantId], token);

            // Show success message
            setSuccess(responseMessage);

            // Optionally, refresh the page or update UI
            handleLoad();
        } catch (error: any) {
            setError(error.message || "An error occurred while moving the applicant");
        }
    };

    // Handle moving applicant to a selected list
    const handleChangeApplicant = async (category: string) => {
        try {
            const token = getAccessToken();
            if (!token) {
                setError("User is not authenticated");
                return;
            }

            // Move the single applicant to the selected job
            const responseMessage = await moveApplicantToList(category, [applicant.applicantId], token);

            // Show success message
            setSuccess(responseMessage);

            // Optionally, refresh the page or update UI
            handleLoad();
        } catch (error: any) {
            setError(error.message || "An error occurred while moving the applicant");
        }
    };

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
                    {applicant.applicantName}
                </td>
                <td className="px-6 py-4 align-middle whitespace-nowrap text-sm font-light text-gray-500">
                    {applicant.createdDate}
                </td>
                <td className="px-6 py-4 align-middle whitespace-nowrap text-sm font-light text-gray-500">
                    {applicant.source}
                </td>
                <td className="px-6 py-4 align-middle whitespace-nowrap text-sm text-gray-500">
                    <div className="flex justify-center">
                        <DisplayRating
                            applicantId={applicant.applicantId}
                            rating={applicant.numOfRatings}
                            handleLoadRatings={handleLoad}
                        />
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex justify-center gap-2">
                        <button onClick={toggleNotesOverlay}>
                            <Image src={NoteIcon} alt={"note"} className="min-w-5 min-h-5" />
                        </button>
                        <p>{applicant.applicantComments?.length}</p>
                    </div>
                    {isNotesOverlayOpen && (
                        <NotesOverlay
                            isNotesOverlayOpen={isNotesOverlayOpen}
                            applicantId={applicant.applicantId}
                            onClose={handleCloseNotesOverlay}
                        />
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Select
                        options={jobs.map((job: JobCardData) => ({
                            value: job.id.toString(),
                            label: job.title,
                        }))}
                        value={selectedJobId}
                        placeholder="Move to"
                        onChange={(value) => {
                            setSelectedJobId(value); // Set the selected job ID
                            handleMoveApplicant(value); // Move the applicant when a job is selected
                        }}
                        className="bg-primary text-white rounded-lg py-2"
                    />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Select
                        options={location === "FortMyers" ? fortMyersScreeningCategories.map((category: Category) => ({
                            value: category.value,
                            label: category.name,
                        }))
                            :
                            sarasotaScreeningCategories.map((category: Category) => ({
                                value: category.value,
                                label: category.name,
                            }))
                        }
                        value={selectedJobId}
                        placeholder="Change list"
                        onChange={(value) => {
                            setSelectedJobId(value); // Set the selected job ID
                            handleChangeApplicant(value); // Move the applicant when a job is selected
                        }}
                        className="bg-primary text-white rounded-lg py-2"
                    />
                </td>
            </tr>
        </>
    );
};
