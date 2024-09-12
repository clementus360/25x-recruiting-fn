// DeclineReasonOverlay.tsx
import React, { useState } from "react";

interface DeclineReasonOverlayProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DeclineReasonOverlay: React.FC<DeclineReasonOverlayProps> = ({
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState<string>("");

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <div className="fixed z-40 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Reason for Declining</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={4}
          placeholder="Enter the reason..."
          value={reason}
          onChange={handleReasonChange}
        />
        <div className="flex justify-end mt-4">
          <button
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded-md"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeclineReasonOverlay;
