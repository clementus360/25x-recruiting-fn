'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

import SearchIcon from "@/assets/search.svg"
import PlusIcon from "@/assets/plus.svg"
import SortIcon from "@/assets/sort.svg";

import PageSelector from "@/components/PageSelector";
import { getCandidatesForJob } from "@/data/jobsData";
import { useParams } from "next/navigation";
import { useError } from "@/context/ErrorContext";
import { CandidateRow } from "@/components/Dashboard/Jobs/Job/Candidates/CandidateRow";
import { AddCandidateOverlay } from "@/components/Dashboard/Jobs/Job/AddCandidate";
import Select from "@/components/Select";
import { NoResultsPage } from "@/components/Dashboard/NoResultsPage";
import DateSelector from "@/components/DateSelector";

export default function Candidates() {
  const [applicants, setApplicants] = useState([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { setError } = useError();
  const [isAddApplicantOverlayOpen, setIsAddApplicantOverlayOpen] = useState(false); // New state
  const [load, setLoad] = useState(false)

  const params = useParams<{ job: string }>();
  const jobId = params.job;

  const [filters, setFilters] = useState<{
    searchTerm?: string;
    fromDate?: string;
    toDate?: string;
    presetTimeFrame?: string;
    sortingOptions: "ASC" | "DESC"; // Required parameter
  }>({
    searchTerm: "",
    fromDate: "",
    toDate: "",
    presetTimeFrame: "",
    sortingOptions: "ASC", // Default sorting option
  });

  const handleLoadData = (load: boolean) => {
    setLoad(load)
  }

  const fetchApplicants = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const data = await getCandidatesForJob(jobId, token, currentPage, filters);

      setApplicants(data.Applicants);
      setTotalPages(data.pageCount);
    } catch (error: any) {
      setError(`Error fetching applicants: ${error.message}`);
    } finally {
      setLoad(false); // Reset the load state
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

  // Handle select all functionality
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all applicants
      const allApplicantIds = applicants.map((applicant: any) => applicant.applicantId);
      setSelectedRows(allApplicantIds);
    } else {
      // Deselect all applicants
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

  const handleOpenAddApplicantOverlay = () => {
    setIsAddApplicantOverlayOpen(true);
  };

  const handleCloseAddApplicantOverlay = () => {
    setIsAddApplicantOverlayOpen(false);
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

        {/* Sort By Filter */}
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
          placeholder="Search Candidates"
        />

        {/* Results Count */}
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
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Resume
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Cover Letter
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Application
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase"></th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                <button onClick={handleOpenAddApplicantOverlay} className="flex gap-2 items-center bg-accent hover:bg-opacity-80 h-max w-max px-4 py-2 text-white text-xs font-bold rounded-md">
                  <Image src={PlusIcon} height={10} width={10} alt={"search"} />
                  <p>Add New Candidate</p>
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            {applicants.map((applicant: any) => (
              <CandidateRow
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

      {isAddApplicantOverlayOpen && <AddCandidateOverlay handleLoad={handleLoadData} onClose={handleCloseAddApplicantOverlay} />}

      {/* Pagination */}
      <PageSelector pageNumber={totalPages} changePage={handleChangeCurrentPage} />
    </section>
  );
}
