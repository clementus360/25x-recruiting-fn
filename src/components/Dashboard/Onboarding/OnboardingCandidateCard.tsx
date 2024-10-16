import { useState } from "react";

interface Document {
  name: string;
  completed: boolean;
}

interface Step {
  name: string;
  documents: Document[];
}

interface Candidate {
  name: string;
  email: string;
  phone: string;
  job: string;
  hiredDate: string;
  steps: Step[];
}

interface OnboardingCandidateCardProps {
  candidate: Candidate;
}

const OnboardingCandidateCard = ({ candidate }: OnboardingCandidateCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handler to toggle the onboarding process details
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  // Determine overall status based on documents
  const getOverallStatus = () => {
    const totalDocuments = candidate.steps.reduce((acc, step) => acc + step.documents.length, 0);
    const completedDocuments = candidate.steps.reduce(
      (acc, step) => acc + step.documents.filter(doc => doc.completed).length,
      0
    );
    if (completedDocuments === totalDocuments) return { status: "Completed", color: "text-green-500", icon: "✔" };
    if (completedDocuments > 0) return { status: "In Progress", color: "text-yellow-500", icon: "⚠️" };
    return { status: "Not Started", color: "text-red-500", icon: "✘" };
  };

  const { status, color, icon } = getOverallStatus();

  return (
    <div className="border-[0.1px] rounded-md shadow-sm p-6 bg-gray-50 transition-all duration-300 hover:shadow-md">
      {/* Candidate Summary */}
      <div
        onClick={handleToggle}
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between ${isExpanded ? 'pb-8 border-b' : ''}`}
      >
        <div className="w-full sm:w-auto">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{candidate.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <p className="text-md text-gray-600">{candidate.job}</p>
            <p className="text-sm text-gray-500">{candidate.email}</p>
            <p className="text-sm text-gray-500">{candidate.phone}</p>
            <p className="text-sm text-gray-500">Hired Date: {candidate.hiredDate}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
          <span className={`flex items-center ${color}`}>
            <span className="text-xl mr-2">{icon}</span>
            {status}
          </span>

          <button
            className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none focus:underline font-medium text-sm"
          >
            {isExpanded ? (
              <span className="flex items-center">
                Hide Details
                <svg
                  className="w-4 h-4 ml-1 transform rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            ) : (
              <span className="flex items-center">
                Show Details
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Onboarding Details */}
      {isExpanded && (
        <div className="mt-6">
          <ul className="space-y-6">
            {candidate.steps.map((step, idx) => (
              <li
                key={idx}
                className={`border-b border-gray-300 pb-4 mb-4 ${idx === candidate.steps.length - 1 ? '' : 'border-b'}`}
              >
                <h5 className="font-medium text-gray-800 mb-2">{idx + 1}. {step.name}</h5>
                <div className="flex items-center flex-wrap gap-2">
                  {step.documents.map((doc, docIdx) => (
                    <div
                      key={docIdx}
                      className={`flex items-center text-sm space-x-2 py-1 px-2 rounded-lg w-full sm:w-auto ${doc.completed ? 'cursor-pointer' : ''}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${doc.completed ? 'bg-green-500' : 'bg-yellow-400'}`}
                      ></span>
                      <span className={`${doc.completed ? 'text-green-500' : 'text-gray-400'}`}>{doc.name}</span>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OnboardingCandidateCard;
