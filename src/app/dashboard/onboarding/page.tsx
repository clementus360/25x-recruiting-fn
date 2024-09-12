"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SearchIcon from "@/assets/search.svg";
import SortIcon from "@/assets/sort.svg";
import PageSelector from "@/components/PageSelector";
import { getAllCandidates, getApplicantsForJob } from "@/data/jobsData";
import { useParams } from "next/navigation";
import { useError } from "@/context/ErrorContext";
import { useCompany } from "@/context/CompanyContext";
import OnboardingCandidateCard from "@/components/Dashboard/Onboarding/OnboardingCandidateCard";
import Select from "@/components/Select";
import { onboardingCandidates } from "@/data/constants";
import DateSelector from "@/components/DateSelector";

export default function DashboardCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [load, setLoad] = useState(false);
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

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                    setError("User is not authenticated");
                    return;
                }

                const data = await getAllCandidates(token, currentPage, filters);
                setCandidates(data.candidates);
                setTotalPages(data.pageCount);
            } catch (error: any) {
                setError(`Error fetching applicants: ${error.message}`);
            } finally {
                setLoad(false); // Reset the load state
            }
        };

        fetchCandidates();
    }, [load, jobId, currentPage, filters]);

    const handleChangeCurrentPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
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
        <main className="flex min-h-screen flex-col gap-8 py-12 pb-32 w-full lg:pl-24 lg:pr-16">
            <div className="flex flex-col gap-1 px-4 lg:px-0">
                <h2 className="text-accent font-light">{companyInfo?.companyName}</h2>
                <h1 className="text-4xl font-bold">Onboarding</h1>
            </div>

            <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
                {/* Filters Section */}
                <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 rounded-md">
                    {/* Sort By Filter */}
                    <div className="flex items-center gap-2">
                        <Select
                            options={[
                                { value: "ASC", label: "Sort: Most Recent" },
                                { value: "DESC", label: "Sort: Oldest" },
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
                    <p className="text-grey text-sm text-nowrap">{onboardingCandidates.length} Result{onboardingCandidates.length > 1 ? 's' : ''}</p>
                </div>

                {/* Results Display */}
                <div className="flex flex-col gap-8">

                    <div className="flex flex-col h-max gap-6">

                        {onboardingCandidates?.map((candidate, idx) => (
                            <OnboardingCandidateCard
                                key={idx}
                                candidate={candidate}
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
