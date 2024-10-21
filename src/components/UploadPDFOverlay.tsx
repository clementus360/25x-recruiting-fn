import { useState } from "react";
import { Oval } from "react-loader-spinner";

export default function UploadPDFOverlay({
  onAddFile,
  onClose,
  loading,
}: {
  onAddFile: (file: File, fileType: 'csv' | 'resume' | 'cv') => void;
  onClose: () => void;
  loading: boolean
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"csv" | "resume" | "cv" | null>(null); // Add fileType state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isParsed, setIsParsed] = useState<boolean>(false);

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.name.endsWith(".csv")) {
        setFileType("csv");
      } else if (file.name.endsWith(".pdf") || file.name.endsWith(".docx")) {
        setFileType(file.name.includes("cv") ? "cv" : "resume"); // Determine if it's a CV or resume
      } else {
        setErrorMessage("Invalid file type. Please upload a CSV, PDF, or DOCX file.");
        setSelectedFile(null);
        setFileType(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null); // Clear error message if file is valid
    }
  };

  const handleParseFile = async () => {
    if (!selectedFile || !fileType) return;

    setIsParsing(true);
    try {
      await onAddFile(selectedFile, fileType); // Trigger the file upload/parse
      setIsParsed(true); // Set success state
    } catch (error) {
      setErrorMessage("Failed to upload the file. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-lg w-6/12">
        <h1 className="text-xl font-bold">
          Upload Applicant CSV, Resume, or CV
        </h1>

        <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-8/12 py-8 rounded-lg">
          <input
            onChange={handleAddFile}
            type="file"
            accept=".csv,.pdf,.docx"
            name="applicant-file"
            id="applicant-file"
            className="text-center"
          />
        </div>

        {selectedFile && (
          <p className="text-sm text-green-600">
            Selected file: {selectedFile.name}
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <div className="flex gap-4 justify-end">
          {isParsing ? (
            <p className="text-sm text-blue-600">Uploading file, please wait...</p>
          ) : (
            <>
              <button
                className={`px-4 py-2 rounded-md text-sm text-white ${!selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"}`}
                onClick={handleParseFile}
                disabled={!selectedFile || isParsing}
              >
                {loading && <Oval
                  visible={true}
                  height="14"
                  width="14"
                  color="#ffffff"
                  secondaryColor="#ffffff"
                  ariaLabel="oval-loading"
                  wrapperStyle={{}}
                  wrapperClass="flex items-center justify-center"
                />}
                <p>{loading ? "Submitting..." : "Upload File"}</p>
              </button>
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
              >
                Close
              </button>
            </>
          )}
        </div>

        {isParsed && (
          <p className="text-sm text-green-600">File uploaded successfully!</p>
        )}
      </div>
    </div>
  );
}
