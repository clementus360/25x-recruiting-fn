'use client'

import { DashboardNumbers } from "@/components/Dashboard/DashboardNumbers";
import { RecentApplicationRow } from "@/components/Dashboard/RecentApplicationRow";
import { useCompany } from "@/context/CompanyContext";
import { recentApplications, stats } from "@/data/constants";

export default function DashboardHome() {
  const { companyInfo } = useCompany();

  return (
    <main className="flex flex-col justify-between gap-8 py-16 px-4 lg:pl-24 lg:pr-16">
      <section className="flex lg:grid lg:grid-cols-2">
        <div className="flex flex-col">
          <h2 className="text-accent font-light">{companyInfo?.companyName}</h2>
          <h1 className="text-4xl font-bold">{companyInfo?.companyName}</h1>
        </div>
      </section>

      <section className="flex flex-col lg:flex-row justify-center items-center gap-2 lg:gap-16">
        {stats.map((stat) => <DashboardNumbers key={stat.id} number={stat.number} title={stat.title} />)}
      </section>

      <section className="flex flex-col gap-8 w-full bg-white px-4 py-12 rounded-lg drop-shadow-md">
        <h2 className="text-2xl font-bold">Recent Applications</h2>
        <div className="border-grey rounded-md overflow-x-scroll">

          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs uppercase bg-accent text-white">
              <tr>
                <th scope="col" className="py-3 px-6 text-center font-semibold">Date</th>
                <th scope="col" className="py-3 px-6 text-center font-semibold">Name/Job</th>
                <th scope="col" className="py-3 px-6 text-center font-semibold">Resume</th>
                <th scope="col" className="py-3 px-6 text-center font-semibold">Cover Letter</th>
                <th scope="col" className="py-3 px-6 text-center font-semibold">Application</th>
                <th scope="col" className="py-3 px-6 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((application) => (
                <RecentApplicationRow key={application.id} application={application} />
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}

