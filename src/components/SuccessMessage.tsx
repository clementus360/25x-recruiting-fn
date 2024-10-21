'use client';

import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { getAccessToken } from "@/data/cookies";
import { sendHireLetter } from "@/data/onboarding";

export default function SuccessMessage() {
  const { success, setSuccess, companyId, applicantId } = useSuccess();
  const { error, setError } = useError();

  if (!success) return null;

  const handleSendHireLetter = async () => {
    try {

      const token = getAccessToken();

      if (!token) {
        return;
      }

      if (!companyId || !applicantId) {
        return
      }

      await sendHireLetter(companyId, applicantId, token)
      setSuccess("Hire letter sent successfully")

    } catch (error: any) {
      console.error("Error sending hire letter:", error);
      setError(error.message || "Failed to send hire letter")
    }
  };

  return (
    <div
      className="animate-slide-in fixed z-50 top-4 right-4 border-l-4 border-green-500 bg-white text-black px-6 py-4 w-auto max-w-xs rounded-md shadow-lg flex flex-col space-y-3"
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
          />
        </svg>

        <div className="flex-1">
          {success}
        </div>

        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setSuccess("")}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {success === "Candidate hired successfully" && (
        <button
          onClick={handleSendHireLetter}
          className="bg-green-500 text-white px-3 py-2 rounded-md text-sm z-20 hover:bg-opacity-50"
        >
          Send Hire Letter
        </button>
      )}
    </div>
  );
}
