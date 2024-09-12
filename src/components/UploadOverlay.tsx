export default function UploadOverlay({ onAddFile, onClose }: { onAddFile: (file: File) => void; onClose: () => void }) {


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