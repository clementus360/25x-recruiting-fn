"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { FaUser, FaBuilding, FaSignOutAlt } from "react-icons/fa"; // Import Font Awesome icons from react-icons

import SearchIcon from "@/assets/search.svg";
import NotificationIcon from "@/assets/notification.svg";
import HelpIcon from "@/assets/help.svg";
import AccountIcon from "@/assets/CaregiversUnited-Logo-Color-Box-300x201.png-2.webp";
import ProfileIcon from "@/assets/profile.svg";
import MenuIcon from "@/assets/menu.svg";
import { useLogout } from "@/data/auth";

export const navItems = [
  { name: 'Home', path: undefined },
  { name: 'Screening', path: 'screening' },
  { name: 'Jobs', path: 'jobs' },
  { name: 'Candidates', path: 'candidates' },
  { name: 'Onboarding', path: 'onboarding' },
];

export default function DashboardHeader() {
  const { userInfo, userInfoLoading } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const pathname = usePathname();
  const basepath = pathname.split('/')[2];
  const handleLogout = useLogout();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="relative flex flex-col z-30 lg:flex-row items-center justify-between px-4 lg:px-24 bg-white drop-shadow-sm">
      <div className="flex w-full justify-between">
        <div className="flex items-center justify-center gap-16 py-4 lg:py-0">
          <Image src={AccountIcon} alt={"account"} className="w-auto h-16 bg-black" />

          <nav className="menu hidden lg:block">
            <ul className="flex gap-2 justify-between">
              {navItems.map((item, idx) => (
                <Link href={`/dashboard/${item.path ? item.path : ''}`} key={idx}>
                  <li className={`relative py-10 px-4 text-sm font-medium rounded-t-lg`}>
                    {item.name}
                    <div className={`absolute ${basepath === item.path ? 'block' : 'hidden'} w-full h-[0.2rem] rounded-t-lg bg-accent left-0 bottom-0`}></div>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="gap-4 justify-between hidden lg:flex">
            <Image src={SearchIcon} height={16} width={16} alt={"search"} />
            <Image src={NotificationIcon} height={16} width={16} alt={"notification"} />
            <Image src={HelpIcon} height={16} width={16} alt={"help"} />
          </div>

          <div className="relative" ref={dropdownRef}>
            {/* Profile Section */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Image src={ProfileIcon} alt={"profile"} className="w-6 h-6 rounded-full" />
              <p className="hidden lg:flex">Hi, <span className="font-bold"> {userInfo?.firstName}</span></p>
            </div>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-40 py-3 border border-gray-200">
                <Link href="/dashboard/company-profile" onClick={closeDropdown}>
                  <div className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <FaBuilding className="text-gray-500" />
                    Company Profile
                  </div>
                </Link>
                <Link href="/dashboard/user-profile" onClick={closeDropdown}>
                  <div className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                    <FaUser className="text-gray-500" />
                    User Profile
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeDropdown(); // Close dropdown after logout
                  }}
                  className="flex items-center gap-3 px-5 py-3 text-sm text-red-500 hover:bg-gray-100 cursor-pointer w-full text-left"
                >
                  <FaSignOutAlt className="text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="lg:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Image src={MenuIcon} alt="menu" />
        </button>
      </div>

      {menuOpen && (
        <nav className={`block w-full lg:w-auto`}>
          <ul className="flex flex-col lg:flex-row gap-4">
            {navItems.map((item, idx) => (
              <Link key={idx} href={`/dashboard/${item.path || ""}`}>
                <li className={`relative py-2 px-4 text-sm font-medium ${basepath === item.path ? "bg-lightViolet" : ""} rounded-none lg:rounded-t-lg`}>
                  {item.name}
                  <div className={`absolute ${basepath === item.path ? "block" : "hidden"} w-full h-[0.2rem] rounded-t-lg bg-accent left-0 bottom-0`}></div>
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
