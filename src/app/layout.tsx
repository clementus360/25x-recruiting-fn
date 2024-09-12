'use client'; // Mark this component as a Client Component

import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorProvider } from "@/context/ErrorContext"; // Import ErrorProvider
import ErrorMessage from "@/components/ErrorMessage"; // Import the ErrorMessage component
import { SuccessProvider } from "@/context/SuccessContext";
import SuccessMessage from "@/components/SuccessMessage";
import { CompanyProvider } from "@/context/CompanyContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap everything with ErrorProvider */}
        <ErrorProvider>
          <SuccessProvider>
            <CompanyProvider>
              <UserProvider>
                {/* Error Message Component */}
                <div className="relative flex flex-col gap-4">
                  <ErrorMessage />
                  <SuccessMessage />
                </div>
                {children}
              </UserProvider>
            </CompanyProvider>
          </SuccessProvider>
        </ErrorProvider>
      </body>
    </html>
  );
}
