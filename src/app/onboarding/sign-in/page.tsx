'use client';

import { useState, useEffect } from "react";
import { Oval } from "react-loader-spinner";
import { useSuccess } from "@/context/SuccessContext";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuthError } from "@/context/AuthErrorContext";
import AuthErrorMessage from "@/components/AuthErrorMessage";
import { OnboardingUserSignIn } from "@/data/onboarding";

export default function SignIn() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { error, setError } = useAuthError();
    const { setSuccess } = useSuccess();
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [changed, setChanged] = useState({
        email: false,
        password: false
    });

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Email validation
        if (!email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email is invalid.";
        }

        // Password validation
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }

        setChanged((prev) => ({
            ...prev,
            [name]: true
        }))
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setError("Please fix the errors before submitting.");
            return;
        }

        setLoading(true);
        setError("");

        try {

            await OnboardingUserSignIn(email, password, () => null);

            setSuccess("Sign-in successful.");
            router.push("/onboarding");

        } catch (err: any) {
            setError(err.message || "An error occurred during onboarding sign-in.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isFormValid = validateForm();

        if (!isFormValid || loading) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [email, password, loading]);

    useEffect(() => {
        validateForm()
    }, [email, password])

    return (
        <main className="flex min-h-screen items-center justify-center py-16">
            <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
                <div className="flex flex-col gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-center">Welcome to the Onboarding Process</h1>
                    <p className="text-sm text-grey text-center ">As the first step in your process with us we ask that you setup a secure password and establish security questions so that we can confirm your identity in the future.
                        Once you set your security information below you will be redirected to your activities page.</p>
                </div>

                <form onSubmit={handleSignIn} className="flex flex-col gap-4">

                    {error && <AuthErrorMessage />}

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-semibold">Email</label>
                        <input
                            onChange={handleInputChange}
                            className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            placeholder="Choose a email"
                        />
                        {errors.email && changed.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                    </div>

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
                        {errors.password && changed.password && <span className="text-red-500 text-xs">{errors.password}</span>}
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
                            "Login"
                        )}
                    </button>
                </form>
            </div>
        </main>
    );
}
