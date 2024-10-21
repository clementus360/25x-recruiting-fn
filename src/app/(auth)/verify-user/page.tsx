'use client';

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { Oval } from "react-loader-spinner";
import { useSuccess } from "@/context/SuccessContext";
import { useRouter, useSearchParams } from "next/navigation";
import { RegisterUser } from "@/data/users";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthError } from "@/context/AuthErrorContext";
import AuthErrorMessage from "@/components/AuthErrorMessage";
import { parseJwt, removeAccessToken } from "@/data/cookies";
import { CompleteOnboardingRegistration } from "@/data/onboarding";

export default function UserRegistration() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const rawToken = searchParams.toString();
    const token = rawToken.slice(0, -1)

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { error, setError } = useAuthError();
    const { setSuccess } = useSuccess();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [changed, setChanged] = useState({
        password: false,
        confirmPassword: false
    })

    const validateForm = (password: string, confirmPassword: string) => {
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

        if (confirmPassword !== password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        removeAccessToken();
    }, [])

    // Validate on formData change
    useEffect(() => {
        validateForm(password, confirmPassword);
    }, [password, confirmPassword]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "password") {
            setChanged((prev) => ({ ...prev, password: true }))
            setPassword(value);
        } else if (name === "confirmPassword") {
            setChanged((prev) => ({ ...prev, confirmPassword: true }))
            setConfirmPassword(value);
        }
    };

    const handleRegisterCompanyOwner = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm(password, confirmPassword)) {
            setError("Please fix the errors before submitting.");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const tokenPayload = parseJwt(token);

            if (!tokenPayload) {
                throw new Error("Invalid token. Please try again.");
            }

            if (tokenPayload.role === 'onboarding') {
                await CompleteOnboardingRegistration(password, token);
                setSuccess("Registration completed successfully.");
                router.push("/onboarding/sign-in")
            } else {
                await RegisterUser(password, token);
                setSuccess("Registration completed successfully.");
                router.push("/sign-in")
            }

        } catch (err: any) {
            setError(err.message || `An error occurred while completing the registration`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isFormValid = validateForm(password, confirmPassword);

        if (!isFormValid || loading) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [password, confirmPassword, loading]);

    return (
        <Suspense>
            <main className="flex flex-col justify-between pl-24 pr-16">
                <div className="flex flex-col gap-12">
                    {/* <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">User Registration</h1>
                    </div> */}

                    <form onSubmit={handleRegisterCompanyOwner} className="flex flex-col gap-4">

                        {error && <AuthErrorMessage />}

                        <div className="flex flex-col gap-1 relative">
                            <label htmlFor="password" className="text-sm font-semibold">Create a Password</label>
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
                            {errors.password && changed.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="flex flex-col gap-1 relative">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</label>
                            <input
                                onChange={handleInputChange}
                                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] pr-10"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                placeholder="Re-enter your password"
                            />
                            {/* Show password icon */}
                            <button
                                type="button"
                                className="absolute right-2 top-9 text-gray-500"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash className="w-5 h-5" />
                                ) : (
                                    <FaEye className="w-5 h-5" />
                                )}
                            </button>
                            {errors.confirmPassword && changed.confirmPassword && (
                                <span className="text-red-500 text-xs">{errors.confirmPassword}</span>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col gap-2">
                            <button
                                className="flex gap-2 items-center justify-center bg-primary disabled:cursor-not-allowed disabled:bg-grey hover:bg-opacity-80 cursor-pointer text-white font-semibold py-4 w-full rounded-lg"
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
