'use client'

import Image from "next/image";

import ImportIcon from "@/assets/import.svg"
import CandidateNavigation from "@/components/Dashboard/Candidates/CandidateNavigation";
import { useState } from "react";

function UploadOverlay({ onAddFile, onClose }: { onAddFile: (file: File) => void; onClose: () => void }) {


    const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
                return;
            }
            onAddFile(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-lg w-6/12">
                <h1 className="text-xl font-bold">Upload Applicant csv for screening</h1>

                <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-8/12 py-8 rounded-lg">
                    <input onChange={handleAddFile} type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" name="applicant-csv" id="applicant-csv" />
                </div>

                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    )
}

export default function ScreeningLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [isUploadOverlayOpen, setIsUploadOverlayOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File>()

    const closeUploadOverlay = () => {
        setIsUploadOverlayOpen(false)
    }

    const openUploadOverlay = () => {
        setIsUploadOverlayOpen(true)
    }

    const handleAddFile = (file: File) => {
        setFile(file)
        closeUploadOverlay();
    }

    return (
        <div className="flex flex-col gap-8 py-8 px-24">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-4xl font-bold">Screening</h2>
                </div>

                <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-8/12 py-8 rounded-lg">
                    <button onClick={openUploadOverlay} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-sm font-bold rounded-md">
                        <Image src={ImportIcon} height={14} width={14} alt={"search"} />
                        <p>Import Screening Applicants CSV</p>
                    </button>
                </div>
            </div>

            <section className="flex flex-col gap-8 pb-8 bg-white w-full rounded-md drop-shadow-sm overflow-hidden">

                <CandidateNavigation />
                {/* Page contnts will appear here */}
                {children}
            </section>

            {isUploadOverlayOpen && (
                <UploadOverlay onAddFile={handleAddFile} onClose={closeUploadOverlay} />
            )}
        </div>
    );
}
