"use client";

import { GetCompanyData } from "@/data/users";
import { CompanyData } from "@/types/authTypes";
import React, { createContext, useContext, useState, useEffect } from "react"; 

// Define the context type
interface CompanyContextType {
  companyInfo: CompanyData | null;
  setCompanyInfo: React.Dispatch<React.SetStateAction<CompanyData | null>>;
  companyInfoLoading: boolean;
  fetchCompanyInfo: () => void;
}

// Create the context
const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

// Handle local storage changes
function useTokenChange(callback: () => void) {
  useEffect(() => {
    const handleTokenChange = () => {
      callback();
    };

    window.addEventListener("storage", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleTokenChange);
    };
  }, [callback]);
}

// Create a provider component
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<CompanyData | null>(null);
  const [companyInfoLoading, setCompanyInfoLoading] = useState(true);

  const fetchCompanyInfo = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        // Use the GetCompanyData function to fetch company data
        const companyData: CompanyData = await GetCompanyData(token);
        setCompanyInfo(companyData);
      } catch (error) {
        console.error("Error fetching company data:", error);
        setCompanyInfo(null);
      }
    } else {
      setCompanyInfo(null); // Clear the company info if no token is found
    }

    setCompanyInfoLoading(false);
  };

  // Fetch company info when the component mounts and when the token changes
  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  useTokenChange(fetchCompanyInfo); // Use custom hook to detect token change

  return (
    <CompanyContext.Provider value={{ companyInfo, setCompanyInfo, companyInfoLoading, fetchCompanyInfo }}>
      {children}
    </CompanyContext.Provider>
  );
};

// Update the `useCompany` hook
export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
};
