import DateSelector from "./DateSelector";
import Select from "./Select";
import Image from "next/image";
import SearchIcon from "@/assets/search.svg"

interface TableFilterProps {
    results: number, 
    filters: {
        searchTerm?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string;
        sortingOptions: "ASC" | "DESC"; // Required parameter
    },
    searchTermInput: string,
    handleSelectChange: (name: string) => (value: string) => void,
    handleDateChange: (dates: { fromDate?: string; toDate?: string }) => void,
    clearFilters: () => void,
    handleSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSearchButtonClick: () => void
}

const TableFilter: React.FC<TableFilterProps> = ({ results, filters, searchTermInput, handleSelectChange, handleDateChange, clearFilters, handleSearchInputChange, handleSearchButtonClick }) => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-gray-100 rounded-md">
            <div className="flex items-center gap-2">
                <Select
                    options={[
                        { value: "DESC", label: "Sort: Newest" },
                        { value: "ASC", label: "Sort: Oldest" },
                    ]}
                    value={filters.sortingOptions || ""}
                    onChange={handleSelectChange("sortingOptions")}
                />
            </div>

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
                    value={filters.presetTimeFrame || ""}
                    onChange={handleSelectChange("presetTimeFrame")}
                />
            </div>

            {/* Date Selector with Disabled Prop */}
            <DateSelector
                fromDate={filters.fromDate}
                toDate={filters.toDate}
                onDateChange={handleDateChange}
                disabled={!!filters.presetTimeFrame} // Disable if a timeframe is selected
            />

            <button onClick={clearFilters} className="font-bold text-nowrap px-2 text-xs text-black underline">
                Clear Filters
            </button>

            {/* Search Input with Button */}
            <div className="relative flex items-center justify-center">
                <input
                    className="w-full py-1 border border-grey px-2 rounded-l-md text-sm"
                    type="search"
                    name="searchTerm"
                    id="searchTerm"
                    value={searchTermInput} // Bind to the local state
                    onChange={handleSearchInputChange} // Update local state on input change
                    placeholder="Search Applicants"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchButtonClick(); // Trigger search on Enter key press
                        }
                    }}
                />
                <div
                    className="cursor-pointer p-2  bg-lightViolet rounded-r-md"
                    onClick={handleSearchButtonClick} // Trigger search on click
                >
                    <Image src={SearchIcon} height={20} width={20} alt="Search" />
                </div>
            </div>

            <p className="text-grey text-sm text-nowrap">
                {results? results:0} Result{results > 1 ? "s" : ""}
            </p>
        </div>
    )
}

export default TableFilter
