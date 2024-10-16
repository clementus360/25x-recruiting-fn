'use client';

import { useAuthError } from "@/context/AuthErrorContext";

export default function AuthErrorMessage() {
  const { error, setError } = useAuthError();

  if (!error) return null; // Don't render anything if there's no error

  return (
    <div
      className="bg-red-400 text-white px-4 py-4 w-full rounded-md shadow-lg flex items-start space-x-3"
      role="alert"
    >
      {/* Exclamation icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white"
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

      {/* Error message */}
      <div className="flex-1">
        {error}
      </div>

      {/* Close button */}
      <button
        className="text-white hover:text-gray-400"
        onClick={() => setError("")}
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
  );
}
