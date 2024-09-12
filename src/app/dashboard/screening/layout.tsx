'use client'

import Image from "next/image";

import ImportIcon from "@/assets/import.svg"
import CandidateNavigation from "@/components/Dashboard/Candidates/CandidateNavigation";
import { useState } from "react";
import UploadOverlay from "@/components/UploadOverlay";

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
