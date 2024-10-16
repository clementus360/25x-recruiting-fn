'use client'

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AuthErrorProvider } from "@/context/AuthErrorContext";
import { getAccessToken } from "@/data/cookies";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();

    useEffect(() => {
        const accessToken = getAccessToken();

        // If there is no accessToken or it's invalid, redirect to the sign-in page
        if (accessToken) {
            router.push("/onboarding");
        }

    }, [router]);

    return (
        <AuthErrorProvider>
            <Suspense>
                {children}
            </Suspense>
        </AuthErrorProvider>
    );
}
