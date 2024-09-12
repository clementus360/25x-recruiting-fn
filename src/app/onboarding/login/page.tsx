"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { Oval } from "react-loader-spinner";
// import { registerUserOnboarding } from "@/data/auth"; // Replace with the actual function to handle onboarding registration

type FormData = {
    username: string;
    password: string;
};

export default function OnboardingLogin() {
    const [formData, setFormData] = useState<FormData>({
        username: "",
        password: "",
    });

    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [errors, setErrors] = useState<Record<keyof FormData, string | undefined>>({
        username: undefined,
        password: undefined,
    });

    const [touchedFields, setTouchedFields] = useState<Record<keyof FormData, boolean>>({
        username: false,
        password: false,
    });

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const validateForm = (data: FormData) => {
        const newErrors: Record<keyof FormData, string | undefined> = {
            username: undefined,
            password: undefined,
        };

        if (touchedFields.username && !data.username.trim()) newErrors.username = "Username is required.";
        if (touchedFields.password && !data.password.trim()) newErrors.password = "Password is required.";
        else if (touchedFields.password && data.password.length < 8)
            newErrors.password = "Password must be at least 8 characters long.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        setDisabled(!validateForm(formData));
    }, [formData, touchedFields]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setTouchedFields((prev) => ({
            ...prev,
            [name]: true,
        }));

        if (e.target instanceof HTMLInputElement && type === "checkbox") {
            const { checked } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm(formData)) {
            setLoading(true);
            try {
                // await registerUserOnboarding(formData);
                setError("");
                setSuccess("User registered successfully for onboarding!");
                setFormData({
                    username: "",
                    password: "",
                });
                setTouchedFields({
                    username: false,
                    password: false,
                });
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An unknown error occurred."
                );
            } finally {
                setLoading(false);
            }
        } else {
            setError("Please fix the errors and try again.");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center py-16">
            <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-center">Welcome to the Onboarding Process</h1>
                    <p className="text-sm text-grey text-center ">As the first step in your process with us we ask that you setup a secure password and establish security questions so that we can confirm your identity in the future.
                        Once you set your security information below you will be redirected to your activities page.</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-sm font-semibold">Username</label>
                        <input
                            onChange={handleInputChange}
                            className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            placeholder="Choose a username"
                        />
                        {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-semibold">Password</label>
                        <input
                            onChange={handleInputChange}
                            className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                    </div>


                    <button
                        type="submit"
                        className="flex items-center justify-center bg-blue-500 text-white font-semibold py-2 rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={disabled || loading}
                    >
                        {loading ? (
                            <Oval
                                height={20}
                                width={20}
                                color="white"
                                ariaLabel="Loading..."
                                secondaryColor="white"
                                strokeWidth={4}
                            />
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
