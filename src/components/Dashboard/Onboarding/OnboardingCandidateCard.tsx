import { useEffect, useState } from "react";
import StatusBadge from "./StatusBadge";

interface Document {
  name: string;
  documentUrl: string;
  documentStatus: "NOT_STARTED" | "COMPLETED" | "ON_TRACK";
}

interface Step {
  StepName: string;
  documents?: Document[]; // documents are optional
}

interface Candidate {
  userInfo: {
    id: number;
    onboardingId: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    jobName: string;
    createdDate: string;
  };
  signature: Step;
  personalInfo: Step;
  directDeposit: Step;
  additionalDocuments: Step;
  testAndCertifications: Step;
  taxWithholding: Step;
}

interface OnboardingCandidateCardProps {
  candidate: Candidate;
}

interface MappedStep {
  name: string;
  documents: {
    name: string;
    documentUrl: string;
    completed: any;
  }[];
  type: string;
}

interface MappedCandidate {
  name: string;
  email: string;
  phone: string;
  job: string;
  hiredDate: string;
  steps: MappedStep[];
}

const mapCandidateData = (candidate: any): MappedCandidate => {

  const isEmpty = (obj: any) => Object.keys(obj).length === 0;

  return {
    name: `${candidate.userInfo.firstName} ${candidate.userInfo.lastName}`,
    email: candidate.userInfo.email,
    phone: candidate.userInfo.phone,
    job: candidate.userInfo.jobName,
    hiredDate: candidate.userInfo.createdDate,
    steps: [
      {
        name: "E-Signature",
        documents: [
          {
            name: "Coded Electronic Signature Form",
            documentUrl: isEmpty(candidate.signature) ? "" : candidate.signature.documents.documentUrl,
            completed: isEmpty(candidate.signature) ? "" : candidate.signature.documents.documentStatus,
          }],
        type: "signature"
      },
      {
        name: "Personal Information",
        documents: [
          {
            name: "Personal Information",
            completed: isEmpty(candidate.personalInfo.documents[0]) ? "" : candidate.personalInfo.documents[0].documentStatus,
            documentUrl: isEmpty(candidate.personalInfo.documents[0]) ? "" : candidate.personalInfo.documents[0].documentUrl
          },
          {
            name: "Emergency Contacts",
            completed: isEmpty(candidate.personalInfo.documents[1]) ? "" : candidate.personalInfo.documents[1].documentStatus,
            documentUrl: isEmpty(candidate.personalInfo.documents[1]) ? "" : candidate.personalInfo.documents[1].documentUrl
          }
        ],
        type: "form"
      },
      {
        name: "Direct Deposit",
        documents: [
          {
            name: "Direct Deposit",
            documentUrl: isEmpty(candidate.directDeposit) ? "" : candidate.directDeposit.documents.documentUrl,
            completed: isEmpty(candidate.directDeposit) ? "" : candidate.directDeposit.documents.documentStatus,
          }],
        type: "signature"
      },
      {
        name: "Additional Documents",
        documents: [
          {
            name: "References & Employment History",
            completed: isEmpty(candidate.additionalDocuments.documents[0]) ? "" : candidate.additionalDocuments.documents[0].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[0]) ? "" : candidate.additionalDocuments.documents[0].documentUrl
          },
          {
            name: "Electronic Signature Agreement",
            completed: isEmpty(candidate.additionalDocuments.documents[1]) ? "" : candidate.additionalDocuments.documents[1].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[1]) ? "" : candidate.additionalDocuments.documents[1].documentUrl
          },
          {
            name: "Confidentiality & Non-Compete Agreement",
            completed: isEmpty(candidate.additionalDocuments.documents[2]) ? "" : candidate.additionalDocuments.documents[2].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[2]) ? "" : candidate.additionalDocuments.documents[2].documentUrl

          },
          {
            name: "Conflict of Interest",
            completed: isEmpty(candidate.additionalDocuments.documents[3]) ? "" : candidate.additionalDocuments.documents[3].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[3]) ? "" : candidate.additionalDocuments.documents[3].documentUrl

          },
          {
            name: "Corporate Compliance",
            completed: isEmpty(candidate.additionalDocuments.documents[4]) ? "" : candidate.additionalDocuments.documents[4].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[4]) ? "" : candidate.additionalDocuments.documents[4].documentUrl
          },
          {
            name: "Orientation Checklist",
            completed: isEmpty(candidate.additionalDocuments.documents[5]) ? "" : candidate.additionalDocuments.documents[5].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[5]) ? "" : candidate.additionalDocuments.documents[5].documentUrl
          },
          {
            name: "PPE & Infection Control Acknowledgment",
            completed: isEmpty(candidate.additionalDocuments.documents[6]) ? "" : candidate.additionalDocuments.documents[6].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[6]) ? "" : candidate.additionalDocuments.documents[6].documentUrl
          },
          {
            name: "Job Acceptance",
            completed: isEmpty(candidate.additionalDocuments.documents[7]) ? "" : candidate.additionalDocuments.documents[7].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[7]) ? "" : candidate.additionalDocuments.documents[7].documentUrl
          },
          {
            name: "Receipt of Employee Handbook",
            completed: isEmpty(candidate.additionalDocuments.documents[8]) ? "" : candidate.additionalDocuments.documents[8].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[8]) ? "" : candidate.additionalDocuments.documents[8].documentUrl
          },
          {
            name: "TB TARGETED MEDICAL QUESTIONNAIRE FORM",
            completed: isEmpty(candidate.additionalDocuments.documents[9]) ? "" : candidate.additionalDocuments.documents[9].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[9]) ? "" : candidate.additionalDocuments.documents[9].documentUrl
          },
          {
            name: "Field Employee Standards & Procedures",
            completed: isEmpty(candidate.additionalDocuments.documents[10]) ? "" : candidate.additionalDocuments.documents[10].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[10]) ? "" : candidate.additionalDocuments.documents[10].documentUrl
          },
          {
            name: "Employee Safety Form Duties",
            completed: isEmpty(candidate.additionalDocuments.documents[11]) ? "" : candidate.additionalDocuments.documents[11].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[11]) ? "" : candidate.additionalDocuments.documents[11].documentUrl
          },
          {
            name: "Mask Policy",
            completed: isEmpty(candidate.additionalDocuments.documents[12]) ? "" : candidate.additionalDocuments.documents[12].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[12]) ? "" : candidate.additionalDocuments.documents[12].documentUrl
          },
          {
            name: "Privacy Policy",
            completed: isEmpty(candidate.additionalDocuments.documents[13]) ? "" : candidate.additionalDocuments.documents[13].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[13]) ? "" : candidate.additionalDocuments.documents[13].documentUrl
          },
          {
            name: "HEPATITIS VACCINE REQUIREMENT",
            completed: isEmpty(candidate.additionalDocuments.documents[14]) ? "" : candidate.additionalDocuments.documents[14].documentStatus,
            documentUrl: isEmpty(candidate.additionalDocuments.documents[14]) ? "" : candidate.additionalDocuments.documents[14].documentUrl
          }
        ],
        type: "form"
      },
      {
        name: "Test/Certifications",
        documents: [
          {
            name: "HIV & Aids Test",
            completed: isEmpty(candidate.testAndCertifications.documents[0]) ? "" : candidate.testAndCertifications.documents[0].documentStatus,
            documentUrl: isEmpty(candidate.testAndCertifications.documents[0]) ? "" : candidate.testAndCertifications.documents[0].documentUrl
          },
          {
            name: "Alzheimer Disease Test",
            completed: isEmpty(candidate.testAndCertifications.documents[1]) ? "" : candidate.testAndCertifications.documents[1].documentStatus,
            documentUrl: isEmpty(candidate.testAndCertifications.documents[1]) ? "" : candidate.testAndCertifications.documents[1].documentUrl
          },
          {
            name: "Home Health Aide Competency Test",
            completed: isEmpty(candidate.testAndCertifications.documents[2]) ? "" : candidate.testAndCertifications.documents[2].documentStatus,
            documentUrl: isEmpty(candidate.testAndCertifications.documents[2]) ? "" : candidate.testAndCertifications.documents[2].documentUrl
          },
          {
            name: "Post Test",
            completed: isEmpty(candidate.testAndCertifications.documents[3]) ? "" : candidate.testAndCertifications.documents[3].documentStatus,
            documentUrl: isEmpty(candidate.testAndCertifications.documents[3]) ? "" : candidate.testAndCertifications.documents[3].documentUrl
          },
          {
            name: "Culture Index Survey",
            completed: isEmpty(candidate.testAndCertifications.documents[4]) ? "" : candidate.testAndCertifications.documents[4].documentStatus,
            documentUrl: isEmpty(candidate.testAndCertifications.documents[4]) ? "" : candidate.testAndCertifications.documents[4].documentUrl
          }
        ],
        type: "form"
      },
      {
        name: "Tax Withholding",
        documents: [
          {
            name: "Tax Form Information Verification",
            completed: isEmpty(candidate.taxWithholding.documents[0]) ? "" : candidate.taxWithholding.documents[0].documentStatus,
            documentUrl: isEmpty(candidate.taxWithholding.documents[0]) ? "" : candidate.taxWithholding.documents[0].documentUrl
          },
        ],
        type: "form"
      },
    ],
  };
};

const OnboardingCandidateCard = ({ candidate }: OnboardingCandidateCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState<MappedCandidate | null>(null);
  const [overallStatus, setOverallStatus] = useState<{ status: string; color: string }>({ status: '', color: '' });


  useEffect(() => {
    const mappedData = mapCandidateData(candidate);
    setCandidateInfo(mappedData);

    // Calculate overall status
    const calculateOverallStatus = () => {
      let completedCount = 0;
      let notStartedCount = 0;

      mappedData.steps.forEach(step => {
        step.documents.forEach(doc => {
          if (doc.completed === "COMPLETED") {
            completedCount++;
          } else if (doc.completed === "NOT_STARTED") {
            notStartedCount++;
          }
        });
      });

      // Determine overall status
      if (completedCount === 0 && notStartedCount === 0) {
        setOverallStatus({ status: 'Not Started', color: 'bg-red-500' });
      } else if (completedCount === mappedData.steps.reduce((total, step) => total + step.documents.length, 0)) {
        setOverallStatus({ status: 'Completed', color: 'bg-green-500' });
      } else {
        setOverallStatus({ status: 'In progress', color: 'bg-yellow-400' });
      }
    };

    calculateOverallStatus();
  }, [candidate]);

  useEffect(() => {
    setCandidateInfo(mapCandidateData(candidate));
  }, [candidate]);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  if (!candidateInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-[0.1px] rounded-md shadow-sm p-6 bg-gray-50 transition-all duration-300 hover:shadow-md">
      {/* Candidate Summary */}
      <div
        onClick={handleToggle}
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between ${isExpanded ? "pb-8 border-b" : ""}`}
      >
        <div className="w-full sm:w-auto">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">{candidateInfo.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <p className="text-md text-gray-600">{candidateInfo.job}</p>
            <p className="text-sm text-gray-500">{candidateInfo.email}</p>
            <p className="text-sm text-gray-500">{candidateInfo.phone}</p>
            <p className="text-sm text-gray-500">Hired Date: {candidateInfo.hiredDate}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
          <span className="flex items-center">
            <span className={`py-1 px-3 text-white text-sm font-medium rounded ${overallStatus.color}`}>{overallStatus.status}</span>
          </span>
          <button className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none focus:underline font-medium text-sm">
            {isExpanded ? (
              <span className="flex items-center">
                Hide Details
                <svg className="w-4 h-4 ml-1 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            ) : (
              <span className="flex items-center">
                Show Details
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {candidateInfo.steps.map((step, idx) => (
              <li key={idx} className={`border-b border-gray-300 pb-4 mb-4 ${idx === candidateInfo.steps.length - 1 ? "" : "border-b"}`}>
                <h5 className="font-medium text-gray-800 mb-2">
                  {idx + 1}. {step.name}
                </h5>
                <div className="flex items-center flex-wrap gap-2">
                  {step.documents.map((doc, docIdx) => (
                    <div key={docIdx} className={`flex items-center text-sm space-x-2 py-1 px-2 rounded-lg w-full sm:w-auto ${doc.completed ? "cursor-pointer" : ""}`}>
                      <span className={`w-2 h-2 rounded-full ${doc.completed ? "bg-green-500" : "bg-yellow-400"}`}></span>
                      {doc.documentUrl ? (
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${doc.completed ? "text-green-500" : "text-gray-400"} underline hover:text-blue-500`}
                        >
                          {doc.name}
                        </a>
                      ) : (
                        <span className={`${doc.completed ? "text-green-500" : "text-gray-400"}`}>{doc.name}</span>
                      )}
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
