'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { Oval } from "react-loader-spinner";
// import { registerUserOnboarding } from "@/data/auth"; // Replace with the actual function to handle onboarding registration

type FormData = {
    language: string;
    timezone: string;
    username: string;
    password: string;
    confirmPassword: string;
    securityQuestion1: string;
    securityAnswer1: string;
    securityQuestion2: string;
    securityAnswer2: string;
    agreedToTerms: boolean;
    reviewedPrivacyPolicy: boolean;
};

export default function OnboardingSignUp() {
    const [formData, setFormData] = useState<FormData>({
        language: "",
        timezone: "",
        username: "",
        password: "",
        confirmPassword: "",
        securityQuestion1: "",
        securityAnswer1: "",
        securityQuestion2: "",
        securityAnswer2: "",
        agreedToTerms: false,
        reviewedPrivacyPolicy: false,
    });

    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [errors, setErrors] = useState<Record<keyof FormData, string | undefined>>({
        language: undefined,
        timezone: undefined,
        username: undefined,
        password: undefined,
        confirmPassword: undefined,
        securityQuestion1: undefined,
        securityAnswer1: undefined,
        securityQuestion2: undefined,
        securityAnswer2: undefined,
        agreedToTerms: undefined,
        reviewedPrivacyPolicy: undefined,
    });

    const [touchedFields, setTouchedFields] = useState<Record<keyof FormData, boolean>>({
        language: false,
        timezone: false,
        username: false,
        password: false,
        confirmPassword: false,
        securityQuestion1: false,
        securityAnswer1: false,
        securityQuestion2: false,
        securityAnswer2: false,
        agreedToTerms: false,
        reviewedPrivacyPolicy: false,
    });

    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const validateForm = (data: FormData) => {
        const newErrors: Record<keyof FormData, string | undefined> = {
            language: undefined,
            timezone: undefined,
            username: undefined,
            password: undefined,
            confirmPassword: undefined,
            securityQuestion1: undefined,
            securityAnswer1: undefined,
            securityQuestion2: undefined,
            securityAnswer2: undefined,
            agreedToTerms: undefined,
            reviewedPrivacyPolicy: undefined,
        };

        if (touchedFields.language && !data.language.trim()) newErrors.language = "Language is required.";
        if (touchedFields.timezone && !data.timezone.trim()) newErrors.timezone = "Timezone is required.";
        if (touchedFields.username && !data.username.trim()) newErrors.username = "Username is required.";
        if (touchedFields.password && !data.password.trim()) newErrors.password = "Password is required.";
        else if (touchedFields.password && data.password.length < 8)
            newErrors.password = "Password must be at least 8 characters long.";
        if (touchedFields.confirmPassword && !data.confirmPassword.trim())
            newErrors.confirmPassword = "Please confirm your password.";
        else if (touchedFields.confirmPassword && data.password !== data.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";
        if (touchedFields.securityQuestion1 && !data.securityQuestion1.trim())
            newErrors.securityQuestion1 = "Security question 1 is required.";
        if (touchedFields.securityAnswer1 && !data.securityAnswer1.trim())
            newErrors.securityAnswer1 = "Answer for security question 1 is required.";
        if (touchedFields.securityQuestion2 && !data.securityQuestion2.trim())
            newErrors.securityQuestion2 = "Security question 2 is required.";
        if (touchedFields.securityAnswer2 && !data.securityAnswer2.trim())
            newErrors.securityAnswer2 = "Answer for security question 2 is required.";
        if (touchedFields.agreedToTerms && !data.agreedToTerms)
            newErrors.agreedToTerms = "You must agree to the terms and conditions.";
        if (touchedFields.reviewedPrivacyPolicy && !data.reviewedPrivacyPolicy)
            newErrors.reviewedPrivacyPolicy =
                "You must review the privacy policy to proceed.";

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
                    language: "",
                    timezone: "",
                    username: "",
                    password: "",
                    confirmPassword: "",
                    securityQuestion1: "",
                    securityAnswer1: "",
                    securityQuestion2: "",
                    securityAnswer2: "",
                    agreedToTerms: false,
                    reviewedPrivacyPolicy: false,
                });
                setTouchedFields({
                    language: false,
                    timezone: false,
                    username: false,
                    password: false,
                    confirmPassword: false,
                    securityQuestion1: false,
                    securityAnswer1: false,
                    securityQuestion2: false,
                    securityAnswer2: false,
                    agreedToTerms: false,
                    reviewedPrivacyPolicy: false,
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
                    <div className="w-full flex gap-8">
                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="language" className="text-sm font-semibold">Language</label>
                            <input
                                onChange={handleInputChange}
                                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                                type="text"
                                name="language"
                                id="language"
                                value={formData.language}
                                placeholder="Preferred language"
                            />
                            {errors.language && <span className="text-red-500 text-xs">{errors.language}</span>}
                        </div>

                        <div className="w-full flex flex-col gap-1">
                            <label htmlFor="timezone" className="text-sm font-semibold">Timezone</label>
                            <input
                                onChange={handleInputChange}
                                className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                                type="text"
                                name="timezone"
                                id="timezone"
                                value={formData.timezone}
                                placeholder="Timezone (e.g., UTC, GMT+2)"
                            />
                            {errors.timezone && <span className="text-red-500 text-xs">{errors.timezone}</span>}
                        </div>
                    </div>

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

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</label>
                        <input
                            onChange={handleInputChange}
                            className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="securityQuestion1" className="text-sm font-semibold">Security Question 1</label>
                        <select
                            onChange={handleInputChange}
                            className="px-2 py-2 h-12 border-grey border-[0.02rem] rounded-[0.2rem]"
                            name="securityQuestion1"
                            id="securityQuestion1"
                            value={formData.securityQuestion1}
                        >
                            <option value="">Select a security question</option>
                            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                            <option value="What is your mother's maiden name?">What is your mother&apos;s maiden name?</option>
                            <option value="What city were you born in?">What city were you born in?</option>
                        </select>
                        {errors.securityQuestion1 && <span className="text-red-500 text-xs">{errors.securityQuestion1}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="securityAnswer1" className="text-sm font-semibold">Answer</label>
                        <input
                            onChange={handleInputChange}
                            className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                            type="text"
                            name="securityAnswer1"
                            id="securityAnswer1"
                            value={formData.securityAnswer1}
                            placeholder="Answer for security question 1"
                        />
                        {errors.securityAnswer1 && <span className="text-red-500 text-xs">{errors.securityAnswer1}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="securityQuestion2" className="text-sm font-semibold">Security Question 2</label>
                        <select
                            onChange={handleInputChange}
                            className="px-2 py-2 h-12 border-grey border-[0.02rem] rounded-[0.2rem]"
                            name="securityQuestion2"
                            id="securityQuestion2"
                            value={formData.securityQuestion2}
                        >
                            <option value="">Select a security question</option>
                            <option value="What was your first car?">What was your first car?</option>
                            <option value="What was the name of your elementary school?">What was the name of your elementary school?</option>
                            <option value="What is your favorite movie?">What is your favorite movie?</option>
                        </select>
                        {errors.securityQuestion2 && <span className="text-red-500 text-xs">{errors.securityQuestion2}</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="securityAnswer2" className="text-sm font-semibold">Answer</label>
                        <input
                            onChange={handleInputChange}
                            className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                            type="text"
                            name="securityAnswer2"
                            id="securityAnswer2"
                            value={formData.securityAnswer2}
                            placeholder="Answer for security question 2"
                        />
                        {errors.securityAnswer2 && <span className="text-red-500 text-xs">{errors.securityAnswer2}</span>}
                    </div>

                    <p className="text-sm text-grey">Please review this website&apos;s Terms & Conditions below to understand how your personal information is processed and if you accept them, please check the box next to Accept Our Terms & Conditions. In addition, once you&apos;ve reviewed our Privacy Policy, to understand how your personal information is processed, please check the box next to Review Our Policy and click Accept to continue.</p>


                    <div className="flex items-center gap-2">
                        <input
                            onChange={handleInputChange}
                            type="checkbox"
                            name="agreedToTerms"
                            id="agreedToTerms"
                            checked={formData.agreedToTerms}
                        />
                        <label htmlFor="agreedToTerms" className="text-sm">
                            I agree to the <Link href="/terms" className="text-blue-500 underline">terms and conditions</Link>.
                        </label>
                        {errors.agreedToTerms && <span className="text-red-500 text-xs">{errors.agreedToTerms}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            onChange={handleInputChange}
                            type="checkbox"
                            name="reviewedPrivacyPolicy"
                            id="reviewedPrivacyPolicy"
                            checked={formData.reviewedPrivacyPolicy}
                        />
                        <label htmlFor="reviewedPrivacyPolicy" className="text-sm">
                            I have reviewed the <Link href="/privacy" className="text-blue-500 underline">privacy policy</Link>.
                        </label>
                        {errors.reviewedPrivacyPolicy && (
                            <span className="text-red-500 text-xs">{errors.reviewedPrivacyPolicy}</span>
                        )}
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
                            "Register"
                        )}
                    </button>
                    <p className="text-sm font-light text-grey">
                        Already started onboarding? <Link href={"/onboarding/login"}><span className="font-bold text-primary">Log In</span></Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
