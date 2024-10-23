'use client'; // Mark this component as a Client Component

import { Inter } from "next/font/google";
import "./globals.css";
import { ErrorProvider } from "@/context/ErrorContext"; // Import ErrorProvider
import ErrorMessage from "@/components/ErrorMessage"; // Import the ErrorMessage component
import { SuccessProvider } from "@/context/SuccessContext";
import SuccessMessage from "@/components/SuccessMessage";
import { HireLetterProvider } from "@/context/HireLetterContext";

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
        <HireLetterProvider>
          <ErrorProvider>
            <SuccessProvider>
              {/* Error Message Component */}
              <div className="relative flex flex-col gap-4">
                <ErrorMessage />
                <SuccessMessage />
              </div>
              {children}
            </SuccessProvider>
          </ErrorProvider>
        </HireLetterProvider>
      </body>
    </html>
  );
}
