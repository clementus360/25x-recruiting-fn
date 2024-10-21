'use client';

import React, { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean; // Optional isDisabled prop
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  isDisabled = false, // Default isDisabled to false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1); // For keyboard navigation

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Reset focus index when the dropdown opens
    if (isOpen) setFocusedIndex(-1);
  }, [isOpen]);

  const handleOptionClick = (optionValue: string) => {
    if (!isDisabled) {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return; // Prevent key actions when disabled

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      setFocusedIndex((prevIndex) =>
        prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      setFocusedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      handleOptionClick(options[focusedIndex].value);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Ensure default bg and text color if not provided in className
  const bgClass = className?.includes("bg-") ? "" : "bg-white";
  const textClass = className?.includes("text-") ? "" : "text-black";

  return (
    <div
      ref={selectRef}
      className={`relative w-full text-nowrap`}
      onKeyDown={handleKeyDown}
      tabIndex={isDisabled ? -1 : 0} // Prevent tabbing into the select if disabled
    >
      <div
        className={`${className} ${bgClass} ${textClass} flex items-center justify-between py-1 px-4 border rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDisabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`} // Disabled styles
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen && !isDisabled}
        role="button"
        aria-disabled={isDisabled}
      >
        <span>{value ? options.find((option) => option.value === value)?.label : placeholder}</span>
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
      {isOpen && !isDisabled && (
        <div className="absolute w-full max-h-56 overflow-y-auto mt-1 bg-white border rounded shadow-lg z-40">
          {options.map((option, index) => (
            <div
              key={option.value}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${option.value === value ? "bg-gray-100" : ""} ${index === focusedIndex ? "bg-blue-100" : ""}`}
              onClick={() => handleOptionClick(option.value)}
              role="option"
              aria-selected={option.value === value}
              tabIndex={-1}
              onMouseEnter={() => setFocusedIndex(index)} // For mouse hover
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
