'use client';

import { useSuccess } from "@/context/SuccessContext";

export default function ErrorMessage() {
    const { success, setSuccess } = useSuccess();

    if (!success) return null; // Don't render anything if there's no success

    return (
        <div
          className="fixed z-50 top-4 right-4 bg-green-500 text-white px-6 py-4 w-auto max-w-xs rounded-lg shadow-lg animate-slide-in flex items-start space-x-4"
          role="alert"
        >
          <div className="flex-1">
            {success}
          </div>
          <button
            className="text-white hover:text-gray-200"
            onClick={() => setSuccess("")}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
      );
}
