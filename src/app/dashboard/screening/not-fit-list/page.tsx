'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import SearchIcon from "@/assets/search.svg"
import { NoResultsPage } from "@/components/Dashboard/NoResultsPage";
import LoadingPage from "@/components/Dashboard/LoadingPage";
import PageSelector from "@/components/PageSelector";
import Select from "@/components/Select";
import { getScreeningApplicants, moveApplicantToJob, moveApplicantToList } from "@/data/screeningData";
import { useError } from "@/context/ErrorContext";
import { ScreeningRow } from "@/components/Dashboard/Screening/ScreeningCard";
import DateSelector from "@/components/DateSelector";
import { useSearchParams } from "next/navigation";
import { JobCardData } from "@/types/jobTypes";
import { getJobs } from "@/data/jobsData";
import { useCompany } from "@/context/CompanyContext";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useSuccess } from "@/context/SuccessContext";
import { getAccessToken } from "@/data/cookies";
import TableFilter from "@/components/TableFilter";
import { fortMyersScreeningCategories, sarasotaScreeningCategories } from "@/data/constants";
import { Category } from "@/types/ScreeningTypes";

export default function NotFitList() {
  const [applicants, setApplicants] = useState([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const { setError } = useError();
  const { setSuccess } = useSuccess();
  const [load, setLoad] = useState(false)
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [results, setResults] = useState<number>(1);
  const [searchTermInput, setSearchTermInput] = useState<string>("");
  const { companyInfo } = useCompany();
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const [filters, setFilters] = useState<{
    searchTerm: string;
    fromDate: string;
    toDate: string;
    presetTimeFrame: string;
    applicantCategory: "FIT_FOR_HIRE" | "NEED_REVIEW_SARASOTA" | "NOT_FIT_SARASOTA" | "UNCATEGORIZED_SARASOTA" | "NEED_REVIEW_FORT_MERYS" | "NOT_FIT_FORT_MERYS" | "UNCATEGORIZED_FORT_MERYS" | "DO_NOT_HIRE";
    sortingOptions: "ASC" | "DESC";
  }>({
    searchTerm: "",
    fromDate: "",
    toDate: "",
    presetTimeFrame: "",
    applicantCategory: location === "FortMyers" ? 'NOT_FIT_FORT_MERYS' : 'NOT_FIT_SARASOTA',
    sortingOptions: "DESC",
  });

  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const handleLoadData = () => {
    setLoad(!load)
  }

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      // Fetch applicants from API (example function)
      const data = await getScreeningApplicants(token, currentPage, filters);

      setApplicants(data.Applicants);
      setTotalPages(data.pageCount);
      setResults(data.totalApplicants)
    } catch (error: any) {
      setError(error.message ? error.message : `An error occured while loading screening applicants`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [filters, currentPage, load]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermInput(e.target.value);
  };

  const handleSearchButtonClick = () => {
    setFilters({ ...filters, searchTerm: searchTermInput });
  };

  const handleSelectRow = (applicantId: number) => {
    setSelectedRows(prev =>
      prev.includes(applicantId)
        ? prev.filter(id => id !== applicantId)
        : [...prev, applicantId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(applicants.map((applicant: any) => applicant.applicantId));
    } else {
      setSelectedRows([]);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const handleChangeCurrentPage = (page: number) => {
    setCurrentPage(page);
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

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      fromDate: "",
      toDate: "",
      presetTimeFrame: "",
      applicantCategory: "NOT_FIT_FORT_MERYS",
      sortingOptions: "DESC",
    });
    setCurrentPage(1); // Optionally reset the page to the first
  };

  const handleMoveMultipleApplicants = (jobId: string) => {
    if (selectedRows.length === 0) {
      alert("No applicants selected.");
      return;
    }

    // Trigger the modal instead of using window.confirm
    setSelectedJobId(jobId);
    setIsMoveModalOpen(true);
  };

  const handleChangeMultipleApplicants = (category: string) => {
    if (selectedRows.length === 0) {
      alert("No applicants selected.");
      return;
    }

    // Trigger the modal instead of using window.confirm
    setCategory(category);
    setIsChangeModalOpen(true);
  };

  const handleConfirmMove = async () => {
    console.log(selectedJobId)
    if (!selectedJobId) return;

    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      // Call the moveApplicantToJob function
      const responseMessage = await moveApplicantToJob(selectedJobId, selectedRows, token);

      setSuccess("Applicants moved to job successfully")
      setSelectedJobId(null)
      setSelectedRows([])
      fetchApplicants(); // Reload applicants if needed
    } catch (error: any) {
      setError(error.message || "An error occurred while moving applicants");
    } finally {
      setSelectedJobId(null)
      setIsMoveModalOpen(false); // Close modal after confirming
    }
  };

  const handleConfirmChange = async () => {
    console.log(category)
    if (!category) return;

    try {
      const token = getAccessToken();
      if (!token) {
        setError("User is not authenticated");
        return;
      }

      // Call the moveApplicantToJob function
      const responseMessage = await moveApplicantToList(category, selectedRows, token);

      setSuccess("Applicants moved to list successfully")
      setSelectedJobId(null)
      setSelectedRows([])
      fetchApplicants(); // Reload applicants if needed
    } catch (error: any) {
      setError(error.message || "An error occurred while moving applicants");
    } finally {
      setSelectedJobId(null)
      setIsChangeModalOpen(false); // Close modal after confirming
    }
  };

  const handleCancelMove = () => {
    setIsMoveModalOpen(false); // Close modal on cancel
  };

  const handleCancelChange = () => {
    setIsChangeModalOpen(false); // Close modal on cancel
  };


  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const companyId = companyInfo?.id; // Replace with the actual company ID
      const token = getAccessToken(); // Replace with the actual token

      if (!companyId || !token) {
        return;
      }

      const jobsData = await getJobs(companyId, token, currentPage);
      setJobs(jobsData.jobs);

      setTotalPages(jobsData.pageCount)
    } catch (err: any) {
      setError(err.message || "Failed to get jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTermInput === "") {
      handleSearchButtonClick()
    }
  }, [searchTermInput])

  useEffect(() => {
    if (location === "FortMyers") {
      setFilters((prev) => ({
        ...prev,
        applicantCategory: "NOT_FIT_FORT_MERYS",
      }));
    } else if (location === "Sarasota") {
      setFilters((prev) => ({
        ...prev,
        applicantCategory: "NOT_FIT_SARASOTA",
      }));
    }
  }, [searchParams])

  return (
    <section className="flex flex-col gap-4 px-8 overflow-x-scroll">
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
        <table className="relative text-center h-max w-full">
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
                Applied Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                source
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                Notes
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                <div className={`${selectedRows.length > 1 ? 'block' : 'hidden'}`}>
                  <Select
                    options={jobs.map((job: JobCardData) => ({
                      value: job.id.toString(),
                      label: job.title,
                    }))}
                    value={""}
                    placeholder="Move all to"
                    onChange={(value) => handleMoveMultipleApplicants(value)} // Trigger the move function
                    className="bg-primary text-white rounded-lg py-2"
                  />
                </div>
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-black uppercase">
                <div className={`${selectedRows.length > 1 ? 'block' : 'hidden'}`}>
                  <Select
                    options={location === "FortMyers" ? fortMyersScreeningCategories.map((category: Category) => ({
                      value: category.value,
                      label: category.name,
                    }))
                      :
                      sarasotaScreeningCategories.map((category: Category) => ({
                        value: category.value,
                        label: category.name,
                      }))
                    }
                    value={""}
                    placeholder="Change list"
                    onChange={(value) => handleChangeMultipleApplicants(value)}
                    className="bg-primary text-white rounded-lg py-2"
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody className={`relative fade-in ${!loading ? "loaded" : ""}`}>
            <tr>
              <td colSpan={10} className="h-full">
                <LoadingPage loading={loading} />
              </td>
            </tr>

            {!loading && applicants.length <= 0 &&
              <tr>
                <td colSpan={10} className="h-full">
                  <NoResultsPage />
                </td>
              </tr>
            }
            {applicants.map((applicant: any) => (
              <ScreeningRow
                key={applicant.applicantId}
                applicant={applicant}
                page={currentPage}
                selectedRows={selectedRows}
                handleSelectRow={handleSelectRow}
                handleLoad={handleLoadData}
                jobs={jobs}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        message="Are you sure you want to move the selected applicants?"
        onConfirm={handleConfirmMove}
        onCancel={handleCancelMove}
        isOpen={isMoveModalOpen} // Control modal visibility
      />

      <ConfirmationModal
        message="Are you sure you want to move the selected applicants?"
        onConfirm={handleConfirmChange}
        onCancel={handleCancelChange}
        isOpen={isChangeModalOpen} // Control modal visibility
      />

      <PageSelector pageNumber={totalPages} changePage={handleChangeCurrentPage} />
    </section>
  );
}
