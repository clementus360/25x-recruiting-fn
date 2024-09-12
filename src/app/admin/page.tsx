"use client";

import { CompanyItem } from "@/components/Admin/CompanyItem";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { GetCompanies, VerifyCompany } from "@/data/admin";
import { Company } from "@/types/adminTypes";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Admin() {
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        // If there is no accessToken or it's invalid, redirect to the sign-in page
        if (!accessToken) {
            router.push("/sign-in");
        } else {
            setIsLogged(true)
            // Validate the token
        }
    }, [router]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem("accessToken"); // Replace with the actual token

                if (!token) {
                    return;
                }

                const result = await GetCompanies(token);
                if (result) {
                    setCompanies(result);
                } else {
                    setError("Failed to fetch companies.");
                }
            } catch (error) {
                setError("An error occurred while fetching companies.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            const token = localStorage.getItem("accessToken"); // Replace with the actual token

            if (!token) {
                return;
            }

            await VerifyCompany(id, token);
            setCompanies((prevCompanies) =>
                prevCompanies.map((company) =>
                    company.id === id ? { ...company, status: "APPROVED" } : company
                )
            );

            setSuccess(`Company with id:${id} approved successfully`)
        } catch (error) {
            setError("An error occurred while approving the company.");
        }
    };

    const handleReject = (id: number) => {
        // Add logic to reject the company
        console.log(`Rejected company with id: ${id}`);
    };

    return (
        <main className="flex min-h-screen flex-col justify-between py-24 pl-24 pr-16">
            <div className="flex flex-col gap-12">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>

                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-6 py-2 text-sm font-semibold text-gray-700">Company Name</th>
                            <th className="px-6 py-2 text-sm font-semibold text-gray-700">Owner</th>
                            <th className="px-6 py-2 text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-2 text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-2 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map((company) => (
                            <CompanyItem
                                key={company.id}
                                company={company}
                                onApprove={handleApprove}
                                onReject={handleReject}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
