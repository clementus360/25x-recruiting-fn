'use client'

import Image from "next/image";

import Logo from "@/assets/logo_1@4x.png"

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { AuthErrorProvider } from "@/context/AuthErrorContext";
import { getAccessToken } from "@/data/cookies";
import { CompanyProvider } from "@/context/CompanyContext";
import { UserProvider } from "@/context/UserContext";

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
            router.push("/dashboard/jobs");
        }

    }, [router]);

    return (
        <CompanyProvider>
            <UserProvider>
                <AuthErrorProvider>
                    <Suspense>
                        <div className="flex flex-col items-center justify-center">
                            <div className="py-12 min-h-screen flex flex-col gap-16 justify-center items-center">
                                <div className="flex min-w-1/5 w-full items-center justify-center">
                                    <Image src={Logo} alt={"25x caregiver recruiting logo"} className="w-3/5 lg:w-1/5" />
                                </div>

                                <section className="w-10/12 lg:w-1/2 lg:min-w-40 drop-shadow-sm transition-all">
                                    {children}
                                </section>
                            </div>

                            {/* <section className="hidden lg:grid place-items-center w-full h-full bg-lightViolet rounded-l-2xl bg-cover bg-center bg-fixed shadow-inner">
                                <Image src={AuthImage} className="h-full object-cover" alt={""} />
                            </section> */}
                        </div>
                    </Suspense>
                </AuthErrorProvider>
            </UserProvider>
        </CompanyProvider>
    );
}
