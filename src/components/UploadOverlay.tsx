import { useState } from "react";

export default function UploadOverlay({
  onAddFile,
  onClose,
}: {
  onAddFile: (file: File) => void;
  onClose: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isParsed, setIsParsed] = useState<boolean>(false);

  const handleAddFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setErrorMessage("Invalid file type. Please upload a CSV file.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null); // Clear error message if file is valid
    }
  };

  const handleParseFile = async () => {
    if (!selectedFile) return;
    
    setIsParsing(true);
    try {
      await onAddFile(selectedFile); // Trigger the file upload/parse
      setIsParsed(true); // Set success state
    } catch (error) {
      setErrorMessage("Failed to parse the file. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col gap-8 bg-white p-6 rounded-lg shadow-lg w-6/12">
        <h1 className="text-xl font-bold">Upload Applicant CSV for Screening</h1>

        <div className="flex items-center justify-center self-center bg-lightViolet border-[0.08rem] border-accent border-dashed w-8/12 py-8 rounded-lg">
          <input
            onChange={handleAddFile}
            type="file"
            accept=".csv"
            name="applicant-csv"
            id="applicant-csv"
            className="text-center"
          />
        </div>

        {selectedFile && (
          <p className="text-sm text-green-600">
            Selected file: {selectedFile.name}
          </p>
        )}

        {errorMessage && (
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="flex gap-4 justify-end">
          {isParsing ? (
            <p className="text-sm text-blue-600">Parsing file, please wait...</p>
          ) : (
            <>
              <button
                onClick={handleParseFile}
                className={`px-4 py-2 rounded-md text-sm text-white ${!selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"}`}
                disabled={!selectedFile || isParsing}
              >
                Upload File
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
          <p className="text-sm text-green-600">File parsed successfully!</p>
        )}
      </div>
    </div>
  );
}
