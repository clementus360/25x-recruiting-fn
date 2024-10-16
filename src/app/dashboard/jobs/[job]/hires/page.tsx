'use client';

import { useEffect, useState } from "react";

import SearchIcon from "@/assets/search.svg"

import PageSelector from "@/components/PageSelector";
import { getHiresForJob } from "@/data/jobsData";
import { useParams } from "next/navigation";
import { useError } from "@/context/ErrorContext";
import { HireRow } from "@/components/Dashboard/Jobs/Job/Hires/HireRow";
import Select from "@/components/Select";
import { NoResultsPage } from "@/components/Dashboard/NoResultsPage";
import DateSelector from "@/components/DateSelector";
import LoadingPage from "@/components/Dashboard/LoadingPage";
import Image from "next/image";
import { getAccessToken } from "@/data/cookies";
import TableFilter from "@/components/TableFilter";

export default function Candidates() {
  const [applicants, setApplicants] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [results, setResults] = useState<number>(1);
  const { setError } = useError();
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
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
    sortingOptions: "DESC",
  });

  const [searchTermInput, setSearchTermInput] = useState<string>("");

  const handleLoadData = () => {
    setLoad(!load)
  };

  const fetchApplicants = async () => {
    setLoading(true)
    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      const data = await getHiresForJob(jobId, token, currentPage, filters);

      setApplicants(data.Applicants);
      setTotalPages(data.pageCount);
      setResults(data.totalApplicants)
    } catch (error: any) {
      setError(error.message ? error.message : `An error occured while loading hired candidates`);
    } finally {
      setLoading(false)
      setLoad(false);
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
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Hiring Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Contacts</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">Rating</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase"></th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
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
              <HireRow
                key={applicant.applicantId}
                applicant={applicant}
                page={currentPage}
                handleLoad={handleLoadData}
              />
            ))}
          </tbody>
        </table>

      </div>

      {/* Pagination */}
      <PageSelector pageNumber={totalPages} changePage={handleChangeCurrentPage} />
    </section>
  );
}
