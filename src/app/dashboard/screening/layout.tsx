'use client'

import { useState } from "react";
import Image from "next/image";
import ImportIcon from "@/assets/import.svg";
import { Suspense } from "react";
import UploadOverlay from "@/components/UploadOverlay";
import ScreeningNavigation from "@/components/Dashboard/Screening/ScreeningNavigation";
import { uploadScreeningData } from "@/data/screeningData"; // Ensure this path is correct
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import LoadingPage from "@/components/Dashboard/LoadingPage";
import { readFileAsBinaryString } from "@/data/fileHandler";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/data/cookies";

export default function ScreeningLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isUploadOverlayOpen, setIsUploadOverlayOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { setError } = useError()
    const { setSuccess } = useSuccess()
    const [componentKey, setComponentKey] = useState<number>(0);

    const router = useRouter();

    const closeUploadOverlay = () => {
        setIsUploadOverlayOpen(false);
    };

    const openUploadOverlay = () => {
        setIsUploadOverlayOpen(true);
    };

    const handleAddFile = async (file: File) => {
        closeUploadOverlay();

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const token = getAccessToken(); // Retrieve token
            if (!token) {
                throw new Error("User is not authenticated");
            }

            // Check the file type
            if (!file.name.endsWith('.csv')) {
                throw new Error("Please upload a valid CSV file.");
            }

            // Call the API to upload the CSV file
            const responseData = await uploadScreeningData(file, token);

            // Handle successful upload
            setSuccess("File uploaded successfully!");

            setComponentKey(prevKey => prevKey + 1); // Increment key to force re-render
            router.refresh();
        } catch (error: any) {
            setError(error.message || "An error occurred while uploading the file.");
        } finally {
            setLoading(false); // Ensure loading state is stopped
        }
    };

    return (
        <Suspense>
            <div className="flex flex-col justify-between gap-8 py-16 w-full lg:pl-24 lg:pr-16">
                {loading && <LoadingPage loading={loading} />}
                <div className="flex flex-col gap-8 px-4 lg:px-0">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-4xl font-bold">Screening</h2>
                    </div>

                    <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-full lg:w-8/12 py-8 rounded-lg">
                        <button onClick={openUploadOverlay} className="flex gap-2 items-center bg-primary self-center justify-self-end h-max w-max px-4 py-2 text-white text-sm font-bold rounded-md">
                            <Image src={ImportIcon} height={14} width={14} alt={"import icon"} />
                            <p>Import Screening Applicants CSV</p>
                        </button>
                    </div>
                </div>

                <section className="flex flex-col gap-8 pb-8 bg-white w-full rounded-md drop-shadow-sm">
                    <ScreeningNavigation />
                    {children}
                </section>

                {isUploadOverlayOpen && (
                    <UploadOverlay onAddFile={handleAddFile} onClose={closeUploadOverlay} />
                )}

            </div>
        </Suspense>
    );
}
