'use client';

import { useEffect, useState } from "react";
import Image from "next/image";

import PlusIcon from "@/assets/plus.svg"
import SearchIcon from "@/assets/search.svg";
import PageSelector from "@/components/PageSelector";
import { getAllCandidates } from "@/data/jobsData";
import { useParams } from "next/navigation";
import { useError } from "@/context/ErrorContext";
import CandidateCard from "@/components/Dashboard/Candidates/CandidateCard";
import { useCompany } from "@/context/CompanyContext";
import Select from "@/components/Select";
import DateSelector from "@/components/DateSelector";
import LoadingPage from "@/components/Dashboard/LoadingPage";
import { NoResultsPage } from "@/components/Dashboard/NoResultsPage";
import { getAccessToken } from "@/data/cookies";
import TableFilter from "@/components/TableFilter";


export default function DashboardCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [results, setResults] = useState<number>(1);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { setError } = useError();
  const params = useParams<{ job: string }>();
  const jobId = params.job;
  const { companyInfo } = useCompany();

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

  const [searchTermInput, setSearchTermInput] = useState<string>("");

  const handleLoadData = () => {
    setLoad(!load)
  }

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true)
      try {
        const token = getAccessToken();
        if (!token) {
          setError("User is not authenticated");
          return;
        }

        const data = await getAllCandidates(token, currentPage, filters);
        setCandidates(data.candidates);
        setTotalPages(data.pageCount);
        setResults(data.totalApplicants)
      } catch (error: any) {
        setError(`An error occured while loading candidates`);
      } finally {
        setLoading(false)
        setLoad(false); // Reset the load state
      }
    };

    fetchCandidates();
  }, [load, jobId, currentPage, filters]);

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
    <main className="flex min-h-screen flex-col gap-8 py-12 pb-32 w-full lg:pl-24 lg:pr-16">
      <div className="flex flex-col gap-1 px-4 lg:px-0">
        <h2 className="text-accent font-light">{companyInfo?.companyName}</h2>
        <h1 className="text-4xl font-bold">Candidates</h1>
      </div>

      <section className="relative flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
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

        {/* Results Display */}
        <div className="w-full overflow-x-scroll lg:overflow-x-visible">

          <div className="relative flex items-center flex-col gap-4 w-full">

            <LoadingPage loading={loading} />

            {!loading && candidates.length <= 0 &&
              <tr>
                <td colSpan={9} className="h-full">
                  <NoResultsPage />
                </td>
              </tr>
            }

            {candidates?.map((candidate, idx) => (
              <CandidateCard
                key={idx}
                candidate={candidate}
                handleLoad={handleLoadData}
              />
            ))}
          </div>
        </div>

        <PageSelector
          pageNumber={totalPages}
          changePage={handleChangeCurrentPage}
        />
      </section>
    </main>
  );
}
