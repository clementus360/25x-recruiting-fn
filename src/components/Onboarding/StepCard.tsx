import React from 'react';
import { FaCheckCircle, FaClipboard, FaDollarSign, FaFile, FaFileAlt, FaFileSignature, FaPenFancy, FaUniversity } from 'react-icons/fa';

interface Document {
  name: string;
  completed: boolean;
}

interface Step {
  name: string;
  documents: Document[];
  subSteps?: Step[]; // Optional sub-steps
}

interface StepCardProps {
  step: string;
  onClick: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, onClick }) => {
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

  return (
    <div
      onClick={onClick}
      className="border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center text-center w-48 h-48"
    >
      <div className="text-4xl mb-2">{getIcon(step)}</div>
      <h3 className="font-semibold mb-1">{step}</h3>
      {/* <p className="text-sm text-gray-500">
        {`Complete 1 of 2`}
      </p> */}
    </div>
  );
};

export default StepCard;
