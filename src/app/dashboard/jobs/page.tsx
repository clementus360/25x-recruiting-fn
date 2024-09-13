'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

import PlusIcon from "@/assets/plus.svg"
import SearchIcon from "@/assets/search-icon.png";
import SortIcon from "@/assets/sort.svg";
import FilterSection from "@/components/Dashboard/Jobs/FilterSection";
import JobCard from "@/components/Dashboard/Jobs/JobCard";
import PageSelector from "@/components/PageSelector";
import { Job, JobCardData } from "@/types/jobTypes";
import { getJobs } from "@/data/jobsData";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { useCompany } from "@/context/CompanyContext";
import Link from "next/link";
import { getHiringManagers } from "@/data/users";
import { NoResultsPage } from "@/components/Dashboard/NoResultsPage";
import Select from "@/components/Select";

export default function DashboardJobs() {
  const [hiringManagers, setHiringManagers] = useState([])
  const [filterList, setFilterList] = useState<{ [key: string]: boolean }>({});
  const [order, setOrder] = useState<string>("DESC");
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [clearFilters, setClearFilters] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { error, setError } = useError();
  const { setSuccess } = useSuccess();
  const { companyInfo } = useCompany();


  // Fetch jobs whenever filters, search, or page changes
  useEffect(() => {

    const fetchJobs = async () => {
      setLoading(true);
      setError("");

      const filtersParams = {
        status: typeof filterList["status"] === "string" ? filterList.status : undefined,
        visibility: typeof filterList["visibility"] === "string" ? filterList.visibility : undefined,
        jobName: search || undefined,
        hiringManagerId: filterList["hiringManagerId"] ? filterList.hiringManagerId.toString() : undefined,
        fromDate: typeof filterList["fromDate"] === "string" ? filterList.fromDate : undefined,
        toDate: typeof filterList["toDate"] === "string" ? filterList.toDate : undefined,
        presetTimeFrame: typeof filterList["presetTimeFrame"] === "string" ? filterList.presetTimeFrame : undefined,
        sortingOptions: typeof order === "string" ? order : undefined
      };

      try {
        const companyId = companyInfo?.id; // Replace with the actual company ID
        const token = localStorage.getItem("accessToken"); // Replace with the actual token

        if (!companyId || !token) {
          return;
        }

        const jobsData = await getJobs(companyId, token, currentPage, filtersParams);
        setJobs(jobsData.jobs);

        setTotalPages(jobsData.pageCount)
      } catch (err) {
        setError("An error occured while loading jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filterList, search, order, currentPage, companyInfo]);

  useEffect(() => {
    const fetchHiringManagers = async () => {
      try {
        const companyId = companyInfo?.id;
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("User is not authenticated");
          return;
        }

        if (!companyId) {
          return;
        }

        const data = await getHiringManagers(companyId, token);

        setHiringManagers(data);
        setTotalPages(data.pageCount);
      } catch (error: any) {
        setError(`Failed to load hiring managers`);
      }
    };

    fetchHiringManagers();
  }, [companyInfo]);

  const handleChangeCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleOrderChange = (value: string) => {
    setOrder(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (filterKey: string, value: any) => {
    setFilterList((prev) => {
      const updatedFilters = { ...prev };

      // Check if the filter is 'status' or 'visibility'
      if (filterKey === "status" || filterKey === "visibility") {
        // Always set the 'status' or 'visibility' filter, even if it's 'All'
        updatedFilters[filterKey] = value;
      } else if (value === "All" || value === null || value === "") {
        // For other filters, if the value is "All", null, or an empty string, remove the filter
        delete updatedFilters[filterKey];
      } else {
        // Otherwise, set the filter with the actual value
        updatedFilters[filterKey] = value;
      }

      return updatedFilters;
    });
  };


  const handleClearFilter = () => {
    setFilterList({});
    setClearFilters((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-8 justify-between w-full">
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-accent font-light">{companyInfo?.companyName}</h2>
          <h1 className="text-4xl font-bold">Jobs</h1>
        </div>

        <Link href={"/dashboard/jobs/add-job"}>
          <button className="flex gap-2 items-center bg-primary h-max w-max px-4 py-2 hover:bg-opacity-90 text-white text-sm font-bold rounded-md">
            <Image src={PlusIcon} height={14} width={14} alt={"Add Job"} />
            <p>Open a new Job</p>
          </button>
        </Link>
      </div>

      <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
        <input
          value={search}
          onChange={handleSearchChange}
          style={{
            background: `url(${SearchIcon.src})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "1rem",
            backgroundSize: "1.5rem",
          }}
          className={`w-full border-[0.01rem] border-grey px-12 py-2 rounded-md`}
          type="search"
          name="search-jobs"
          id="search-jobs"
          placeholder="Search Jobs"
        />

        <section className="flex flex-col lg:grid lg:grid-cols-[2fr_6fr] gap-8">
          <div className="flex flex-col gap-4">
            <button onClick={handleClearFilter} className="w-max text-sm underline font-bold">
              Clear All Filters
            </button>
            <FilterSection
              onFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              managers={hiringManagers}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="text-sm flex items-center justify-between lg:justify-end gap-8">
              <div className="flex gap-4 items-center">
                <div className="flex gap-2">
                  <Image src={SortIcon} alt={"sort"} className="w-6 h-6" />
                  <p className="font-bold">Sort by</p>
                </div>
                <Select
                  options={[
                    { value: "DESC", label: "Date: Most recent" },
                    { value: "ASC", label: "Date: Oldest" },
                  ]}
                  value={order || "DESC"} // Provide a default value
                  onChange={(value) => handleOrderChange(value)}
                />
              </div>
              <p className="text-grey lg:block">{jobs.length} Results</p>
            </div>

            <div className="flex flex-col gap-8">
              {loading ? (
                <p>Loading...</p>
              ) : error ? (
                <p></p>
              ) : (
                jobs.map((job, idx) => {
                  return (<JobCard key={job.id} {...job} />
                  )
                })
              )}
            </div>

            {jobs.length <= 0 &&
              <NoResultsPage />
            }

            <PageSelector pageNumber={totalPages || 0} changePage={handleChangeCurrentPage} />
          </div>
        </section>
      </section>
    </div>
  );
}
