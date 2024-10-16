'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

import SearchIcon from "@/assets/search.svg"
import PlusIcon from "@/assets/plus.svg"

import PageSelector from "@/components/PageSelector";
import { getCandidatesForJob } from "@/data/jobsData";
import { useParams } from "next/navigation";
import { useError } from "@/context/ErrorContext";
import { CandidateRow } from "@/components/Dashboard/Jobs/Job/Candidates/CandidateRow";
import { AddCandidateOverlay } from "@/components/Dashboard/Jobs/Job/AddCandidate";
import Select from "@/components/Select";
import { NoResultsPage } from "@/components/Dashboard/NoResultsPage";
import DateSelector from "@/components/DateSelector";
import LoadingPage from "@/components/Dashboard/LoadingPage";
import { getAccessToken } from "@/data/cookies";
import TableFilter from "@/components/TableFilter";

export default function Candidates() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [results, setResults] = useState<number>(1);
  const { setError } = useError();
  const [isAddApplicantOverlayOpen, setIsAddApplicantOverlayOpen] = useState(false); // New state
  const [load, setLoad] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);
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
    sortingOptions: "DESC", // Default sorting option
  });

  const [searchTermInput, setSearchTermInput] = useState<string>("");

  const handleLoadData = () => {
    setLoad(!load)
  }

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const data = await getCandidatesForJob(jobId, token, currentPage, filters);

      setApplicants(data.Applicants);
      setTotalPages(data.pageCount);
      setResults(data.totalApplicants)
    } catch (error: any) {
      setError(error.message ? error.message : `An error occured while loading candidates`);
    } finally {
      setLoading(false)
      setLoad(false); // Reset the load state
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [load, currentPage, filters]);

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

  // Handle search on button click
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermInput(e.target.value);  // Update the search term locally
  };

  const handleSearchButtonClick = () => {
    // Trigger the search only when the button is clicked
    setFilters((prev) => ({
      ...prev,
      searchTerm: searchTermInput.trim() || undefined,  // Set the search term in filters
    }));
  };

  useEffect(() => {
    if (searchTermInput === "") {
      handleSearchButtonClick()
    }
  }, [searchTermInput])

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
      sortingOptions: "DESC",
    });
    setCurrentPage(1);
  };

  return (
    <section className="relative flex flex-col gap-4">

      {/* Filters Section */}
      <TableFilter
        results={results}
        filters={filters}
        searchTermInput={searchTermInput}
        handleSelectChange={handleSelectChange}
        handleDateChange={handleDateChange}
        clearFilters={clearFilters}
        handleSearchInputChange={handleSearchInputChange}
        handleSearchButtonClick={handleSearchButtonClick}
      />

      <div className="w-full overflow-x-scroll lg:overflow-x-visible">

        {/* Applicants Table */}
        <table className="relative text-center h-max w-full">
          <thead className="bg-gray-300">
            <tr>
              <th></th>
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
              {/* <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Application
              </th> */}
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
              </th>
              <th className="flex px-6 py-3 text-center text-xs font-medium text-black uppercase">
                <button onClick={handleOpenAddApplicantOverlay} className="flex gap-2 items-center bg-accent hover:bg-opacity-80 h-max w-max px-4 py-2 text-white text-xs font-bold rounded-md">
                  <Image src={PlusIcon} height={10} width={10} alt={"search"} />
                  <p>Add New Candidate</p>
                </button>
              </th>
            </tr>
          </thead>

          <tbody className={`fade-in ${!loading ? "loaded" : ""}`}>
            <LoadingPage loading={loading} />

            {!loading && applicants.length <= 0 &&
              <tr>
                <td colSpan={9} className="h-full">
                  <NoResultsPage />
                </td>
              </tr>
            }
            {applicants.map((applicant: any) => (
              <CandidateRow
                key={applicant.applicantId}
                applicant={applicant}
                page={currentPage}
                handleLoad={handleLoadData}
              />
            ))}
          </tbody>
        </table>
      </div>

      {isAddApplicantOverlayOpen && <AddCandidateOverlay handleLoad={handleLoadData} onClose={handleCloseAddApplicantOverlay} />}

      {/* Pagination */}
      <PageSelector pageNumber={totalPages} changePage={handleChangeCurrentPage} />
    </section>
  );
}
