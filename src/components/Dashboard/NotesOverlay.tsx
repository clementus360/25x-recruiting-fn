'use client';
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { addCommentToApplicant, deleteComment } from "@/data/jobsData";
import { UserComment } from "@/types/jobTypes";
import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

export const NotesOverlay = ({
  notes,
  applicantId,
  onClose,
  handleLoadNotes,
}: {
  notes: UserComment[] | undefined;
  applicantId: number;
  onClose: () => void;
  handleLoadNotes: () => void;
}) => {
  const [newNote, setNewNote] = useState<string>("");
  const { setError } = useError();
  const { setSuccess } = useSuccess();

  const handleAddNote = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      if (!newNote.trim()) {
        setError("Comment is required");
        return;
      }

      await addCommentToApplicant(applicantId, token, newNote);

      setSuccess("Comment added successfully");
      handleLoadNotes();
    } catch (error: any) {
      setError(`Error fetching comments: ${error.message}`);
    }
  };

  const handleDeleteNote = async (commentId: string) => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("User is not authenticated");
        return;
      }

      await deleteComment(applicantId, token, commentId);

      setSuccess("Comment deleted successfully");
      handleLoadNotes();
    } catch (error: any) {
      setError(`Error deleting comment: ${error.message}`);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -left-40 mt-2 z-50 bg-white p-4 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg lg:w-96">
        <h4 className="font-bold text-lg mb-4">Applicant Comments</h4>

        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="border border-gray-300 p-2 rounded-md text-sm w-full"
            placeholder="Add a note"
          />
          <button
            onClick={handleAddNote}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
          >
            Add
          </button>
        </div>

        <ul className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
          {notes && notes.length > 0 ? (
            notes.map((note, idx) => (
              <li
                key={idx}
                className="relative flex flex-col items-start bg-lightViolet px-4 py-2 rounded-md text-sm"
              >
                <div className="grid grid-cols-[20fr_1fr] gap-2 justify-between">
                  <p className="text-lg text-black text-wrap text-left hyphens-auto overflow-clip">{note.comment}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id.toString())}
                    className="self-start text-red-500 hover:text-red-700"
                    aria-label="Delete Note"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="flex gap-2 items-center justify-start mt-2">
                  <p className="text-xs font-semibold">{note.names}</p>
                  <div className="bg-black w-1 h-1 rounded-full"></div>
                  <p className="text-xs text-gray-500 mb-1">{note.createdDate}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-red-500">No notes found</p>
          )}
        </ul>

        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm w-full sm:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
};
