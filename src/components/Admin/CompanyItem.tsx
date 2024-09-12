import { Company } from "@/types/adminTypes";

interface CompanyItemProps {
  company: Company;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export function CompanyItem({ company, onApprove, onReject }: CompanyItemProps) {
  return (
    <tr key={company.id} className="border-b border-gray-200">
      <td className="px-6 py-4 text-sm text-gray-900">{company.companyName}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {company.ownerFirstName} {company.ownerLastName}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{company.businessEmail}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{company.status}</td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <button
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80"
          onClick={() => onApprove(company.id)}
        >
          Approve
        </button>
        <button
          className="ml-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400"
          onClick={() => onReject(company.id)}
        >
          Reject
        </button>
      </td>
    </tr>
  );
}
