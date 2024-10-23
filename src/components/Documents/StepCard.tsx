import React from 'react';
import { FaCar, FaCertificate, FaCheckCircle, FaClipboard, FaClipboardList, FaDollarSign, FaFile, FaFileAlt, FaFileMedical, FaFileMedicalAlt, FaFileSignature, FaHeartbeat, FaIdCard, FaMoneyCheckAlt, FaPenFancy, FaUniversity } from 'react-icons/fa';

interface StepCardProps {
  step: string;
  status: 'COMPLETED' | 'ON_TRACK' | 'NOT_STARTED';
  onClick: () => void;
}

const StepCard: React.FC<StepCardProps> = ({ step, status, onClick }) => {
  const getIcon = (stepName: string) => {
    switch (stepName) {
      case "Driver's Licence":
        return <FaIdCard color='#1579BE' />;
      case 'Certifications/Licenses':
        return <FaCertificate color='#1579BE' />;
      case 'CPR Card':
        return <FaHeartbeat color='#1579BE' />;
      case 'Auto Insurance Card':
        return <FaCar color='#1579BE' />;
      case 'Vehicle Registration (MVR)':
        return <FaClipboardList color='#1579BE' />;
      case 'Social Security Card':
        return <FaFileAlt color='#1579BE' />;
      case 'Physical Form Signed By Doctor':
        return <FaFileMedical color='#1579BE' />;
      case 'TB Test Signed By Doctor':
        return <FaFileMedicalAlt color='#1579BE' />;
      case 'Copy Of Void Check':
        return <FaMoneyCheckAlt color='#1579BE' />;
      default:
        return <FaFileAlt color='#1579BE' />;
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
      {/* <p className={`text-sm ${getStatusColor(status)}`}>
        {status.replace('_', ' ')}
      </p> */}
    </div>
  );
};

export default StepCard;
