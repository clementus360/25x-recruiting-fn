'use client';

import Select from "@/components/Select";
import { useEffect, useState } from "react";

export default function FilterSection({
  onFilterChange,
  clearFilters,
  managers,
}: {
  onFilterChange: (filterKey: string, value: any) => void;
  clearFilters: boolean;
  managers: { id: number; firstName: string, lastName: string }[];
}) {
  const [jobStatus, setJobStatus] = useState("All");
  const [jobVisibility, setJobVisibility] = useState("All");
  const [hiringManagerId, setHiringManagerId] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timeframe, setTimeframe] = useState("All");

  console.log(managers)

  useEffect(() => {
    // Reset all filter states when filters are cleared
    setJobStatus("All");
    setJobVisibility("All");
    setHiringManagerId(null);
    setFromDate("");
    setToDate("");
    setTimeframe("All");
  }, [clearFilters]);

  return (
    <div>
      <div className="flex flex-col gap-3 px-8 py-4">
        {/* Job Status Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="job-status" className="text-sm">
            Job Status
          </label>
          <Select
            options={[
              { value: "All", label: "All" },
              { value: "Open", label: "Open" },
              { value: "Closed", label: "Closed" },
            ]}
            value={jobStatus}
            onChange={(value) => {
              setJobStatus(value);
              onFilterChange("status", value);
            }}
          />
        </div>

        {/* Job Visibility Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="job-visibility" className="text-sm">
            Job Visibility
          </label>
          <Select
            options={[
              { value: "All", label: "All" },
              { value: "Internal", label: "Internal" },
              { value: "Public", label: "Public" },
            ]}
            value={jobVisibility}
            onChange={(value) => {
              setJobVisibility(value);
              onFilterChange("visibility", value);
            }}
          />
        </div>

        {/* Hiring Manager Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="hiring-manager" className="text-sm">
            Hiring Manager
          </label>
          <Select
            options={[
              { value: "", label: "All" },
              ...managers.map((manager) => ({
                value: manager.id.toString(),
                label: `${manager.firstName} ${manager.lastName}`,
              })),
            ]}
            value={hiringManagerId ?? ""}
            onChange={(value) => {
              const id = value ? parseInt(value, 10) : null;
              setHiringManagerId(value);
              onFilterChange("hiringManagerId", id);
            }}
          />
        </div>

        {/* Date Filters */}
        <div className="flex flex-col gap-2">
          <label htmlFor="from-date" className="text-sm">
            From Date
          </label>
          <input
            id="from-date"
            className="border rounded-md p-2"
            type="date"
            value={fromDate}
            onChange={(e) => {
              const value = e.target.value;
              setFromDate(value);
              onFilterChange("fromDate", value);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="to-date" className="text-sm">
            To Date
          </label>
          <input
            id="to-date"
            className="border rounded-md p-2"
            type="date"
            value={toDate}
            onChange={(e) => {
              const value = e.target.value;
              setToDate(value);
              onFilterChange("toDate", value);
            }}
          />
        </div>

        {/* Timeframe Filter */}
        <div className="flex flex-col gap-2">
          <label htmlFor="timeframe" className="text-sm">
            Timeframe
          </label>
          <Select
            options={[
              { value: "All", label: "All" },
              { value: "Today", label: "Today" },
              { value: "Yesterday", label: "Yesterday" },
              { value: "ThisWeek", label: "This Week" },
              { value: "LastWeek", label: "Last Week" },
              { value: "ThisMonth", label: "This Month" },
              { value: "LastMonth", label: "Last Month" },
              { value: "ThisYear", label: "This Year" },
              { value: "LastYear", label: "Last Year" },
            ]}
            value={timeframe}
            onChange={(value) => {
              setTimeframe(value);
              onFilterChange("presetTimeFrame", value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
