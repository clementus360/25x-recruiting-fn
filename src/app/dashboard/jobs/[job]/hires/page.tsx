'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

import SearchIcon from "@/assets/search.svg"
import SortIcon from "@/assets/sort.svg";

import PageSelector from "@/components/PageSelector";
import { getHiresForJob } from "@/data/jobsData";
import { useParams } from "next/navigation";
import { useError } from "@/context/ErrorContext";
import { HireRow } from "@/components/Dashboard/Jobs/Job/Hires/HireRow";
import Select from "@/components/Select";
import { NoResultsPage } from "@/components/Dashboard/NoResultsPage";
import DateSelector from "@/components/DateSelector";

export default function Candidates() {
  const [applicants, setApplicants] = useState([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { setError } = useError();
  const [load, setLoad] = useState(false);

  const params = useParams<{ job: string }>();
  const jobId = params.job;

  const [filters, setFilters] = useState<{
    searchTerm?: string;
    fromDate?: string;
    toDate?: string;
    presetTimeFrame?: string;
    sortingOptions: "ASC" | "DESC";
  }>({
    searchTerm: "",
    fromDate: "",
    toDate: "",
    presetTimeFrame: "",
    sortingOptions: "ASC",
  });

  const handleLoadData = (load: boolean) => {
    setLoad(load);
  };

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const data = await getHiresForJob(jobId, token, currentPage, filters);

      setApplicants(data.Applicants);
      setTotalPages(data.pageCount);
    } catch (error: any) {
      setError(`An error occured while loading hired candidates`);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [load, currentPage, filters]);

  const handleSelectRow = (applicantId: number) => {
    setSelectedRows((prev) =>
      prev.includes(applicantId)
        ? prev.filter((id) => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allApplicantIds = applicants.map((applicant: any) => applicant.applicantId);
      setSelectedRows(allApplicantIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleChangeCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    handleFilterChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleDateChange = (dates: { fromDate?: string; toDate?: string }) => {
    setFilters((prev) => ({
      ...prev,
      ...dates,
    }));
  };

  // Function to clear all filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      fromDate: "",
      toDate: "",
      presetTimeFrame: "",
      sortingOptions: "ASC", // Reset to default sorting option
    });
    setCurrentPage(1); // Optionally reset the page to the first
  };

  return (
    <section className="relative flex flex-col gap-4">
      {/* Filters Section */}
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 rounded-md">
        <div className="flex items-center gap-2">
          <Select
            options={[
              { value: "ASC", label: "Date: Most Recent" },
              { value: "DESC", label: "Date: Oldest" },
            ]}
            value={filters.sortingOptions || ""} // Provide a default value
            onChange={handleSelectChange("sortingOptions")}
          />
        </div>

        {/* Timeframe Filter */}
        <div className="flex items-center gap-2">
          <Select
            options={[
              { value: "", label: "All Time" },
              { value: "Today", label: "Today" },
              { value: "Yesterday", label: "Yesterday" },
              { value: "ThisWeek", label: "This Week" },
              { value: "LastWeek", label: "Last Week" },
              { value: "ThisMonth", label: "This Month" },
              { value: "LastMonth", label: "Last Month" },
              { value: "ThisYear", label: "This Year" },
              { value: "LastYear", label: "Last Year" },
            ]}
            placeholder="Select Time Range"
            value={filters.presetTimeFrame || ""} // Provide default value
            onChange={handleSelectChange("presetTimeFrame")}
          />
        </div>

        {/* Date Selector Filter */}
        <DateSelector
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          onDateChange={handleDateChange}
        />

        {/* Clear Filters Button */}
        <button onClick={clearFilters} className="font-bold text-nowrap px-2 text-xs text-black underline">
          Clear Filters
        </button>

        <input
          style={{
            background: `url(${SearchIcon.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '1rem',
            backgroundSize: '1.5rem',
          }}
          className={`w-full self-start py-2 border-[0.01rem] border-grey pl-12 pr-2 rounded-md text-sm mt-4 lg:mt-0`}
          type="search"
          name="searchTerm"
          id="searchTerm"
          onChange={handleFilterChange}
          placeholder="Search Hires"
        />

        <p className="text-grey text-sm text-nowrap">{applicants.length} Result{applicants.length > 1 ? 's' : ''}</p>
      </div>

      <div className="w-full overflow-x-scroll lg:overflow-x-visible">
        {/* Applicants Table */}
        <table className="text-center h-max w-full">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === applicants.length && applicants.length > 0}
                />
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Hiring Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Contacts</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Rating</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase"></th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
              </th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((applicant: any) => (
              <HireRow
                key={applicant.applicantId}
                applicant={applicant}
                page={currentPage}
                selectedRows={selectedRows}
                handleSelectRow={handleSelectRow}
                handleLoad={handleLoadData}
              />
            ))}
          </tbody>
        </table>

        {applicants.length <= 0 &&
          <NoResultsPage />
        }

      </div>

      {/* Pagination */}
      <PageSelector pageNumber={totalPages} changePage={handleChangeCurrentPage} />
    </section>
  );
}
