'use client';

import { GetUserData } from "@/data/users";
import { User } from "@/types/profileTypes";
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the context type
interface UserContextType {
  userInfo: User | null;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  userInfoLoading: boolean;
  fetchUserInfo: () => void
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to handle token changes
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
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userInfoLoading, setUserInfoLoading] = useState(true);
  
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("accessToken");
  
  
      if (token) {
        try {
          const userData = await GetUserData(token);
          setUserInfo(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
      setUserInfoLoading(false);
    };
  
    useEffect(() => {
      fetchUserInfo();
    }, []);
  
    useTokenChange(fetchUserInfo);
  
    return (
      <UserContext.Provider value={{ userInfo, setUserInfo, userInfoLoading, fetchUserInfo }}>
        {children}
      </UserContext.Provider>
    );
  };
  

// Update the `useUser` hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
