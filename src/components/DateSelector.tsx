import React from "react";

interface DateSelectorProps {
  fromDate?: string;
  toDate?: string;
  onDateChange: (dates: { fromDate?: string; toDate?: string }) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ fromDate, toDate, onDateChange }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onDateChange({ [name]: value });
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        name="fromDate"
        value={fromDate || ""}
        onChange={handleDateChange}
        className="border rounded py-1 px-2"
        placeholder="From Date"
      />
      <span>-</span>
      <input
        type="date"
        name="toDate"
        value={toDate || ""}
        onChange={handleDateChange}
        className="border rounded py-1 px-2"
        placeholder="To Date"
      />
    </div>
  );
};

export default DateSelector;
