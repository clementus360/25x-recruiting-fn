'use client';

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useError } from "@/context/ErrorContext";
import { Oval } from "react-loader-spinner";
import { useSuccess } from "@/context/SuccessContext";
import { useRouter, useSearchParams } from "next/navigation";
import { RegisterUser } from "@/data/users";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function UserRegistration() {
    const router = useRouter()

    const searchParams = useSearchParams();
    const rawToken = searchParams.toString(); // Get the entire query string

    // Extract token from query string, assuming it's the only parameter
    const token = rawToken.slice(0, -1) // Gets the entire query string

    const [password, setPassword] = useState('');
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [changed, setChanged] = useState(false)

    const validateForm = (password: string) => {
        const newErrors: { [key: string]: string } = {};

        if (!password.trim()) {
            newErrors.password = "Password is required.";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = "Password must contain at least one lowercase letter.";
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*]/.test(password)) {
            newErrors.password = "Password must contain at least one special character.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate on formData change
    useEffect(() => {
        validateForm(password);
    }, [password]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!changed) {
            setChanged(true)
        }
        setPassword(e.target.value);
    };

    const handleRegisterCompanyOwner = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm(password)) {
            setError("Please fix the errors before submitting.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            // Add the logic for registration with the extracted token
            await RegisterUser(password, token)
            // await registerCompanyOwner({ token, password }); // Pass token and password to the API function
            setSuccess("Registration completed successfully.");
            router.push("/sign-in")
        } catch (err: any) {
            setError(`An error occurred while completing the registration: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isFormValid = validateForm(password);

        if (!isFormValid || loading) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [password, loading]);

    useEffect(() => {
        if (changed) {
            validateForm(password)
        }
    }, [password])

    return (
        <Suspense>
            <main className="flex min-h-screen flex-col justify-between py-56 pl-24 pr-16">
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">User Registration</h1>
                    </div>

                    <form onSubmit={handleRegisterCompanyOwner} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1 relative">
                            <label htmlFor="password" className="text-sm font-semibold">Password</label>
                            <input
                                onChange={handleInputChange}
                                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] pr-10"
                                type={showPassword ? "text" : "password"} // Toggle input type based on state
                                name="password"
                                id="password"
                                value={password}
                                placeholder="Enter your password"
                            />
                            {/* Show password icon */}
                            <button
                                type="button"
                                className="absolute right-2 top-9 text-gray-500"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="w-5 h-5" />
                                ) : (
                                    <FaEye className="w-5 h-5" />
                                )}
                            </button>
                            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                        </div>

                        <div className="mt-6 flex flex-col gap-2">
                            <button
                                className="flex gap-2 items-center justify-center bg-primary disabled:bg-grey hover:bg-opacity-80 cursor-pointer text-white font-semibold py-4 w-full rounded-lg"
                                type="submit"
                                disabled={disabled}
                            >
                                {loading && <Oval
                                    visible={true}
                                    height="14"
                                    width="14"
                                    color="#ffffff"
                                    secondaryColor="#ffffff"
                                    ariaLabel="oval-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="flex items-center justify-center"
                                />}
                                <p>{loading ? "Submitting..." : "Request Verification"}</p>
                            </button>
                            <p className="text-sm font-light text-grey">
                                Already have an account? <Link href={"/sign-in"}><span className="font-bold text-primary">Sign In</span></Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>
        </Suspense>
    );
}
