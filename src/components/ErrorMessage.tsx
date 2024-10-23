'use client';

import { useError } from "@/context/ErrorContext";

export default function ErrorMessage() {
  const { error, setError } = useError();

  if (!error) return null; // Don't render anything if there's no error

  return (
    <div
      className="animate-slide-in fixed z-[60] top-12 right-4 border-l-4 border-red-500 bg-white text-black px-6 py-4 w-auto max-w-xs rounded-md shadow-lg flex items-start space-x-3"
      role="alert"
    >
      {/* Exclamation icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-red-500"
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
        className="text-gray-500 hover:text-gray-700"
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
