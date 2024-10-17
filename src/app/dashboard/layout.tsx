'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import DashboardHeader from "./Header";
import { getAccessToken, parseJwt } from "@/data/cookies";
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
            router.replace('/sign-in');
        } else {
            const tokenPayload = parseJwt(accessToken);

            if (!tokenPayload) {
                throw new Error("Invalid token. Please try again.");
            }

            if (tokenPayload.role === 'onboarding' || !tokenPayload.role) {
                router.push("/onboarding")
            } else {
                setIsLoading(false)
            }

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
