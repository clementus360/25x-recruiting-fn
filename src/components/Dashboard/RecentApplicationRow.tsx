import { RecentApplications } from "@/types/applicationTypes";

export function RecentApplicationRow({ application }: { application: RecentApplications; }) {
  return (
    <tr className="bg-white border-b-[0.01rem] border-b-grey hover:bg-gray-50">
      <td className="py-4 px-6 text-center text-sm text-grey">{application.date}</td>
      <td className="py-4 px-6 text-center">
        <p className="font-semibold">{application.name}</p>
        <p className="text-xs text-grey">{application.job}</p>
      </td>
      <td className="py-4 px-6 text-center text-sm text-grey">{application.resume ? 'Done' : 'None'}</td>
      <td className="py-4 px-6 text-center text-sm text-grey">{application.coverLetter ? 'Done' : 'None'}</td>
      <td className="py-4 px-6 text-center text-sm text-grey">{application.application}</td>
      <td className="py-4 px-6 text-center">
        <button className="bg-primary px-4 py-2 text-white text-sm font-bold rounded-md">
          View Application
        </button>
      </td>
    </tr>
  );
}

