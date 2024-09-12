"use client";

import React from "react";
import Image from "next/image";
import NoFileIcon from "@/assets/no-file.svg"; // Replace with an appropriate icon path

interface NoResultsPageProps {
  message?: string; // Optional custom message
}

export const NoResultsPage: React.FC<NoResultsPageProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24">
      {/* Icon */}
      <div className="mb-4">
        <Image src={NoFileIcon} alt="No results" width={50} height={50} />
      </div>
      {/* Message */}
      <p className="text-gray-500 text-lg text-center">
        {message || "No results found. Please try adjusting your filters or search terms."}
      </p>
    </div>
  );
};
