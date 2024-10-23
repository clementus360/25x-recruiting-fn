import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { getAccessToken } from "@/data/cookies";
import { saveQualificationDocument, uploadImage } from "@/data/qualificationDocuments";
import { useState } from "react";
import { Oval } from "react-loader-spinner";

export default function QualificationDocumentForm({
    title,
    type,
    onClose,
}: {
    title: string,
    type: string;
    onClose: () => void;
}) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isParsed, setIsParsed] = useState<boolean>(false);
    const { error, setError } = useError();
    const { setSuccess } = useSuccess();

    const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type for images (e.g., jpg, png, gif)
            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validImageTypes.includes(file.type)) {
                setError("Invalid file type. Please upload an image (JPEG, PNG, or GIF).");
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setError(""); // Clear error message if file is valid
        }
    };

    const handleSubmitFile = async () => {
        if (!selectedFile) {
            setError("No file selected.");
            return;
        }

        setLoading(true);
        try {
            const token = getAccessToken();
            if (!token) {
                setError("User is not authenticated");
                return;
            }

            // Convert the selected file to a Blob for upload
            const fileBlob = new Blob([selectedFile], { type: selectedFile.type });
            const uploadedFileUrl = await uploadImage(fileBlob, selectedFile.name);

            // Save the uploaded file URL along with the document type
            await saveQualificationDocument(type, uploadedFileUrl, token);

            setSuccess(`${title} uploaded successfully`)
            setIsParsed(true);
            onClose();
        } catch (error: any) {
            setError(error.message || "Failed to upload and save the document. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 p-6 w-full">

            <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-8/12 py-8 rounded-lg">
                <input
                    onChange={handleAddFile}
                    type="file"
                    accept="image/jpeg, image/png, image/gif"
                    name="document"
                    id="document"
                    className="text-center"
                />
            </div>

            {selectedFile && (
                <p className="text-sm text-green-600">
                    Selected file: {selectedFile.name}
                </p>
            )}


            <div className="flex gap-4 justify-end">
                <button
                    onClick={handleSubmitFile}
                    className={`flex gap-2 items-center justify-center px-4 py-2 rounded-md text-sm text-white ${!selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"}`}
                    disabled={!selectedFile || loading}
                >
                    {loading &&
                        <Oval
                            visible={true}
                            height="14"
                            width="14"
                            color="#ffffff"
                            secondaryColor="#ffffff"
                            ariaLabel="oval-loading"
                            wrapperStyle={{}}
                            wrapperClass="flex items-center justify-center"
                        />
                    }
                    Upload File
                </button>
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
