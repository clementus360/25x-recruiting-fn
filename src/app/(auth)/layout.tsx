'use client'

import Image from "next/image";

import AuthImage from "@/assets/auth-image.png"

import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function AuthLayout({
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
            router.push("/dashboard");// Validate the token
        }
    }, [router]);

    return (
        <Suspense>
            <div className="relative grid grid-cols-[1fr_1fr]">
                <section className="w-full drop-shadow-sm">
                    {children}
                </section>

                <section className="grid place-items-center w-full h-full bg-lightViolet rounded-l-2xl bg-cover bg-center bg-fixed shadow-inner">
                    {/* This section will contain graphics seen when the user is going to sign up or sign in */}
                    <Image src={AuthImage} alt={""} />

                </section>
            </div>
        </Suspense>
    );
}
