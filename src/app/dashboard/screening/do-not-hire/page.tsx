'use client'

import { useState } from "react";
import Image from "next/image";

import PhoneIcon from "@/assets/phone.svg"
import EmailIcon from "@/assets/email.svg"

import SortIcon from "@/assets/sort.svg"
import NoteIcon from "@/assets/note.svg"
import TagIcon from "@/assets/tag.svg"

import PageSelector from "@/components/PageSelector";
import DisplayRating from "@/components/DisplayRating";
import { NotesOverlay } from "@/components/Dashboard/NotesOverlay";
import { Job } from "@/types/jobTypes";

export default function DoNotHire() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isNotesOverlayOpen, setIsNotesOverlayOpen] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [availableJobs, setAvailableJobs] = useState();

  const handleSelectRow = (applicantId: number) => {
    setSelectedRows(prev =>
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  // const handleAddNote = (applicantId: number, note: string) => {
  //   addNoteToApplicant(note, applicantId)
  // };

  // const handleOpenNotesOverlay = (applicantId: number) => {
  //   setIsNotesOverlayOpen(applicantId);
  // };

  // const handleCloseNotesOverlay = () => {
  //   setIsNotesOverlayOpen(null);
  // };

  return (
    <section className="flex flex-col gap-4 px-8 overflow-x-scroll">
      <div className="text-sm flex items-center justify-end gap-8">
        <div className="flex gap-2">
          <Image src={SortIcon} alt={"sort"} className="w-6 h-6" />
          <p className="font-bold">Sort by</p>
        </div>
        <select name="sort" id="sort" className="bg-none text-primary">
          <option value="date-most-recent">Date: Most Recent</option>
          <option value="date-oldest">Date: Oldest</option>
        </select>
        <p className="text-grey">10 Results</p>
      </div>

      <table className="text-center">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
              <input type="checkbox" />
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase">
              First Name
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-black uppercase">
              Last Name
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
              Reason
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
              Rating
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">

            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">

            </th>
          </tr>
        </thead>

        <tbody>
          {/* {getApplicantsDoNotHire().map((applicant, idx) => (
            <tr className="">
              <td className="px-6 py-4 align-middle whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(applicant.applicantId)}
                  onChange={() => handleSelectRow(applicant.applicantId)}
                />
              </td>

              <td className="px-2 py-4 align-middle whitespace-nowrap text-sm font-bold text-gray-900">
                {applicant.firstName}
              </td>
              <td className="px-2 py-4 align-middle whitespace-nowrap text-sm font-bold text-gray-900">
                {applicant.lastName}
              </td>
              <td className="py-4 align-middle whitespace-nowrap text-sm text-gray-500">
                <p>Multiple Felonies</p>
              </td>
              <td className="py-4 align-middle whitespace-nowrap text-sm text-gray-500">
                <div className="flex justify-center">
                  <DisplayRating rate={applicant.rate} />
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button onClick={() => handleOpenNotesOverlay(applicant.applicantId)}>
                  <Image src={NoteIcon} alt={"note"} className="w-5 h-5" />
                </button>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-2">
                  <button className="flex gap-2 items-center bg-primary hover:bg-opacity-90 self-center justify-self-end h-max w-max px-4 py-2 text-white text-xs font-semibold rounded-md">Mark as fit</button>
                </div>
              </td>
            </tr>
          ))} */}
        </tbody>


      </table>

      {/* {isNotesOverlayOpen !== null && (
        <NotesOverlay
          notes={applicants.find(a => a.applicantId === isNotesOverlayOpen)?.notes || []}
          onAddNote={(note) => handleAddNote(isNotesOverlayOpen, note)}
          onClose={handleCloseNotesOverlay}
        />
      )} */}


      {/* <PageSelector /> */}

    </section>
  );
}
