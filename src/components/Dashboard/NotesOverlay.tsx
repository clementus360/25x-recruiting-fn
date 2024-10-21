'use client';
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { getAccessToken } from "@/data/cookies";
import { addCommentToApplicant, deleteComment, getCommentsForApplicant, editApplicantComment } from "@/data/jobsData";
import { UserComment } from "@/types/jobTypes";
import { useEffect, useState } from "react";
import { FiTrash2, FiEdit, FiSave, FiX } from "react-icons/fi";

export const NotesOverlay = ({
  isNotesOverlayOpen,
  applicantId,
  onClose,
}: {
  isNotesOverlayOpen: boolean;
  applicantId: number;
  onClose: () => void;
}) => {
  const [newNote, setNewNote] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedNote, setEditedNote] = useState<string>("");
  const { setError } = useError();
  const { setSuccess } = useSuccess();
  const [localNotes, setLocalNotes] = useState<UserComment[]>();
  const [loadNotes, setLoadNotes] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true)

  useEffect(() => {
    if (newNote.trim()) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [newNote])

  const fetchUserComments = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }
      const data = await getCommentsForApplicant(applicantId, token);
      setLocalNotes(data);
      setLoadNotes(true);
    } catch (error: any) {
      setError(error.message || `An error occurred while loading comments`);
    }
  };

  useEffect(() => {
    if (isNotesOverlayOpen) {
      fetchUserComments();
    }
  }, [isNotesOverlayOpen, loadNotes]);

  const handleAddNote = async () => {
    try {
      const token = getAccessToken();
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
      setNewNote("");
      setLoadNotes(!loadNotes);
    } catch (error: any) {
      setError(error.message || `An error occurred while adding comments`);
    }
  };

  const handleDeleteNote = async (commentId: string) => {
    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      await deleteComment(applicantId, token, commentId);
      setSuccess("Comment deleted successfully");
      setLoadNotes(!loadNotes);
    } catch (error: any) {
      setError(error.message || `An error occurred while deleting comment`);
    }
  };

  const handleEditNote = (note: UserComment) => {
    setEditingNoteId(note.id.toString());
    setEditedNote(note.comment);
  };

  const handleSaveEditedNote = async (noteId: string) => {
    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      if (!editedNote.trim()) {
        setError("Comment cannot be empty");
        return;
      }

      await editApplicantComment(applicantId, token, noteId, editedNote);
      setSuccess("Comment updated successfully");
      setEditingNoteId(null);
      setLoadNotes(!loadNotes);
    } catch (error: any) {
      setError(error.message || `An error occurred while saving comment`);
    }
  };

  if (!isNotesOverlayOpen) return null;

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the outside click handler
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-50 "
      onMouseDown={handleClickOutside}
    >
      <div
        className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-[80%] max-w-2xl h-max max-h-[65vh] overflow-auto"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FiX size={24} />
        </button>

        {/* Title */}
        <h4 className="font-bold text-lg sm:text-xl mb-4">Comments</h4>

        {/* Comment Input */}
        <form className="pb-4">
          <div className="flex py-2 px-4 mb-4 bg-gray-100 rounded-lg border border-gray-300">
            <label htmlFor="comment" className="sr-only">
              Your comment
            </label>
            <textarea
              id="comment"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none bg-gray-100"
              placeholder="Add a comment..."
              required
            />
          </div>
          <button
            type="button"
            onClick={handleAddNote}
            disabled={disabled}
            className="items-center py-2.5 px-4 text-xs font-medium text-center  text-white bg-primary disabled:cursor-not-allowed disabled:bg-grey rounded-md focus:ring-4 focus:ring-primary-200 hover:bg-primary-800"
          >
            Add Comment
          </button>
        </form>

        {/* Notes List */}
        <ul className="flex flex-col gap-2 mb-4">
          {localNotes && localNotes.length > 0 ? (
            localNotes.map((note, idx) => (
              <li
                key={idx}
                className="relative flex flex-col items-start bg-lightViolet px-4 py-2 rounded-md text-sm"
              >
                {editingNoteId === note.id.toString() ? (
                  <div className="flex flex-col w-full h-max">
                    <textarea
                      value={editedNote}
                      onChange={(e) => setEditedNote(e.target.value)}
                      className="border border-gray-300 p-2 rounded-md w-full text-black resize-none"
                      rows={3}
                    />
                    <button
                      onClick={() => handleSaveEditedNote(note.id.toString())}
                      className="flex items-center justify-center py-2 px-4 mt-2 bg-primary text-white disabled:cursor-not-allowed disabled:bg-grey cursor-pointer rounded-md hover:bg-opacity-80"
                    >
                      <FiSave size={16} className="mr-2" /> Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 justify-between w-full">
                    <p className="text-sm text-black text-left text-wrap overflow-x-clip">{note.comment}</p>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="flex items-center justify-center bg-slate-700 text-white px-2 py-2 rounded-md hover:bg-slate-600"
                        aria-label="Edit Note"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id.toString())}
                        className="flex items-center justify-center bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600"
                        aria-label="Delete Note"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 items-center justify-start mt-2">
                  <p className="text-xs font-semibold">{note.names}</p>
                  <div className="bg-black w-1 h-1 rounded-full"></div>
                  <p className="text-xs text-gray-500">{note.createdDate}</p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-red-400">No notes found</p>
          )}
        </ul>
      </div>
    </div>

  );
};
