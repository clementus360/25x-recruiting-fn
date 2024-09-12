'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import DashboardHeader from "./Header";


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        // If there is no accessToken or it's invalid, redirect to the sign-in page
        if (!accessToken) {
            router.push("/sign-in");
        } else {
            // Validate the token
        }
    }, [router]);

    return (
        <div>
            <div className="z-50">
                <DashboardHeader />
                {/* The header component that appears on all pages */}
            </div>

            <section className="w-full drop-shadow-sm">
                {/* Page contents will appear here */}
                {children}
            </section>
        </div>
    );
}
