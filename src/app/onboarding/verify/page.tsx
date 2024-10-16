'use client';

import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { Oval } from "react-loader-spinner";
import { CompleteOnboardingRegistration } from "@/data/onboarding";
import { useRouter, useSearchParams } from "next/navigation";
// import { registerUserOnboarding } from "@/data/auth"; // Replace with the actual function to handle onboarding registration

type FormData = {
    password: string;
};

export default function OnboardingLogin() {
    const router = useRouter()

    const searchParams = useSearchParams();
    const rawToken = searchParams.toString(); // Get the entire query string

    // Extract token from query string, assuming it's the only parameter
    const token = rawToken.slice(0, -1) // Gets the entire query string
    
    const [password, setPassword] = useState("");

    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [errors, setErrors] = useState<string>("");

    const [touchedFields, setTouchedFields] = useState<Record<keyof FormData, boolean>>({
        password: false,
    });

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const validateForm = (password: string) => {
        console.log(password)
        let newErrors: string = ""

        if (touchedFields.password && !password.trim()) newErrors = "Password is required.";
        else if (touchedFields.password && password.length < 8)
            newErrors = "Password must be at least 8 characters long.";

        setErrors(newErrors);

        console.log(newErrors.length > 1)
        return !(newErrors.length > 1)
    };

    useEffect(() => {
        setDisabled(!validateForm(password));
    }, [password, touchedFields]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setTouchedFields((prev) => ({
            ...prev,
            [name]: true,
        }));

        setPassword(value)
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm(password)) {
            setLoading(true);
            try {
                await CompleteOnboardingRegistration(password, token)
                setSuccess("User registered successfully for onboarding!");
                setPassword("");
                setTouchedFields({
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
                    <h1 className="text-2xl font-bold text-center">Register Your Onboarding Account</h1>
                    <p className="text-sm text-grey text-center ">As the first step in your process with us we ask that you setup a secure password and establish security questions so that we can confirm your identity in the future.
                        Once you set your security information below you will be redirected to your activities page.</p>
                </div>

                <form onSubmit={handleVerify} className="flex flex-col gap-4">

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-semibold">Password</label>
                        <input
                            onChange={handleInputChange}
                            className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            placeholder="Enter your password"
                        />
                        {errors && <span className="text-red-500 text-xs">{errors}</span>}
                    </div>


                    <button
                        type="submit"
                        className="flex items-center justify-center bg-blue-500 text-white font-semibold py-2 rounded-md  disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                            "Register"
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
