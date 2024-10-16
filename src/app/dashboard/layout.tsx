'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import DashboardHeader from "./Header";
import { getAccessToken } from "@/data/cookies";
import LoadingPage from "@/components/Dashboard/LoadingPage";
import { CompanyProvider } from "@/context/CompanyContext";
import { UserProvider } from "@/context/UserContext";


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const accessToken = getAccessToken();

        if (!accessToken) {
            router.replace('/sign-in');  // Redirect to sign-in if not authenticated
        } else {
            setIsLoading(false)
        }

    }, [router]);

    if (isLoading) {
        return (
            <LoadingPage loading={isLoading} />
        );
    }

    return (
        <CompanyProvider>
            <UserProvider>
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
            </UserProvider>
        </CompanyProvider>
    );
}
