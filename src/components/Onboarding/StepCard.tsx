import React from 'react';
import { FaCheckCircle, FaClipboard, FaDollarSign, FaFile, FaFileAlt, FaFileSignature, FaPenFancy, FaUniversity } from 'react-icons/fa';

interface StepCardProps {
  step: string;
  status: 'COMPLETED' | 'ON_TRACK' | 'NOT_STARTED' | 'REVIEW';
  progress: string;
  onClick: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, status, progress, onClick }) => {
  const getIcon = (stepName: string) => {
    switch (stepName) {
      case 'E-Signature':
        return <FaPenFancy color='#1579BE' />;
      case 'Personal Information':
        return <FaClipboard color='#1579BE' />;
      case 'Direct Deposit':
        return <FaUniversity color='#1579BE' />;
      case 'Additional Documents':
        return <FaFileAlt color='#1579BE' />;
      case 'Test/Certifications':
        return <FaFileSignature color='#1579BE' />;
      case 'Tax Withholding':
        return <FaDollarSign color='#1579BE' />;
      case 'Employment Eligibility':
        return <FaCheckCircle color='#1579BE' />;
      default:
        return <FaFile color='#1579BE' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400';
      case 'ON_TRACK':
        return 'text-blue-400';
      case 'NOT_STARTED':
        return 'text-gray-400';
      case 'REVIEW':
        return 'text-yellow-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div
      onClick={status === 'COMPLETED' ? undefined : onClick}
      className={`border border-gray-300 rounded-lg shadow-md flex flex-col items-center justify-center text-center w-48 h-48 cursor-${status === 'COMPLETED' ? 'not-allowed bg-gray-100' : 'pointer hover:bg-gray-100'}`}
    >
      <div className="text-4xl mb-2">
        {status === 'COMPLETED' ? <FaCheckCircle className="text-green-500" /> : getIcon(step)}
      </div>

      <h3 className="font-semibold mb-1">{step}</h3>

      {status !== 'REVIEW'
        ? <p className={`text-xs font-medium ${getStatusColor(status)} px-2 py-1 rounded-full bg-opacity-20`}>
          {progress} COMPLETED
        </p>
        : <p className="text-sm font-medium text-blue-600 px-2 py-1 rounded-full bg-blue-100 bg-opacity-20">
          View Details
        </p>
      }
    </div>
  );
};

export default StepCard;
