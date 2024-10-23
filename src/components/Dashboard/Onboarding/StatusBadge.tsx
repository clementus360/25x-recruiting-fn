import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from 'react-icons/fa';

const StatusBadge = ({ overallStatus }:{overallStatus: {status: string, color: string}}) => {
  let icon;
  
  switch (overallStatus.status) {
    case 'Success':
      icon = <FaCheckCircle className="text-green-500 mr-1" />;
      break;
    case 'Warning':
      icon = <FaExclamationCircle className="text-yellow-500 mr-1" />;
      break;
    case 'Error':
      icon = <FaTimesCircle className="text-red-500 mr-1" />;
      break;
    default:
      icon = null;
  }

  return (
    <span className="flex items-center">
      {icon}
      <span 
        className={`py-1 px-3 font-medium rounded ${overallStatus.color}`}
      >
        {overallStatus.status}
      </span>
    </span>
  );
};

export default StatusBadge;
