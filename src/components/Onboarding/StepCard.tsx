import React from 'react';

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
  const getIcon = (stepName: string): string => {
    switch (stepName) {
      case 'E-Signature':
        return '✍️';
      case 'Personal Information':
        return '📋';
      case 'Direct Deposit':
        return '🏦';
      case 'Additional Documents':
        return '📑';
      case 'Test/Certifications':
        return '📝';
      case 'Tax Withholding':
        return '💵';
      case 'Employment Eligibility':
        return '✅';
      default:
        return '📄';
    }
  };

  return (
    <div
      onClick={onClick}
      className="border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center text-center w-48 h-48"
    >
      <div className="text-4xl mb-2">{getIcon(step)}</div>
      <h3 className="font-semibold mb-1">{step}</h3>
      <p className="text-sm text-gray-500">
        {`Complete 1 of 2`}
      </p>
    </div>
  );
};

export default StepCard;
