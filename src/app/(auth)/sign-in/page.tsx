"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { Oval } from "react-loader-spinner";
import { useSuccess } from "@/context/SuccessContext";
import { useRouter } from "next/navigation";
import { userSignIn } from "@/data/auth"; // Assume this is your sign-in function
import { useUser } from "@/context/UserContext";
import { useCompany } from "@/context/CompanyContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setError } = useError();
  const { setSuccess } = useSuccess();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [changed, setChanged] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const { fetchUserInfo } = useUser(); 
  const { fetchCompanyInfo } = useCompany();

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
    if (!changed) {
      setChanged(true)
    }

    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    checkDisabled()
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
      await userSignIn(email, password, () => {
        fetchUserInfo();
        fetchCompanyInfo();
      });
      setSuccess("Sign-in successful.");
      router.push("/dashboard"); // Redirect to dashboard or another page after successful sign-in
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  const checkDisabled = () => {

    if (!validateForm() || loading) {
      setDisabled(true)
    }

    setDisabled(false)
  }

  useEffect(() => {
    if (changed) {
      validateForm()
    }
  }, [email, password])

  return (
    <main className="flex min-h-screen flex-col justify-between py-56 pl-24 pr-16">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Sign In</h1>
        </div>

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input
              onChange={handleInputChange}
              className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
              type="email"
              name="email"
              id="email"
              value={email}
              placeholder="Enter your email"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
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
              <p>{loading ? "Submitting..." : "Sign In"}</p>
            </button>
            <p className="text-sm font-light text-grey">
              Don't have an account? <Link href={"/register"}><span className="font-bold text-primary">Register Company</span></Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
