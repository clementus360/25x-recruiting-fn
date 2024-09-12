'use client';

import { useEffect, useState } from "react";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { Oval } from "react-loader-spinner";
import { useCompany } from "@/context/CompanyContext";
import { InviteUser } from "@/data/users";

export default function InviteUserOverlay({ onClose }: { onClose: () => void }) {
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [loading, setLoading] = useState(false);
    const { companyInfo } = useCompany()

    const accessToken = localStorage.getItem("accessToken");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        userRole: "user",
        note: "",
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        note: "",
    });

    const validate = () => {
        const newErrors: typeof errors = { firstName: "", lastName: "", email: "", title: "", note: "" };
        let isValid = true;

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required.";
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format.";
            isValid = false;
        }

        if (formData.title && formData.title.length > 50) {
            newErrors.title = "Title must be 50 characters or less.";
            isValid = false;
        }

        if (formData.note && formData.note.length > 200) {
            newErrors.note = "Note must be 200 characters or less.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear errors when user starts typing again
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const CompanyId = companyInfo?.id

        if (!validate()) {
            setLoading(false);
            return;
        }

        try {
            // Logic to invite/add user with formData
            if (CompanyId && accessToken) {
                await InviteUser(formData, Number(CompanyId), accessToken);
            } else {
                setError("Could not find company id")
                return
            }

            setSuccess("User invited successfully.");
            onClose();
        } catch (err: any) {
            console.log(err)
            setError("An error occurred while inviting the user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        validate()
    }, [formData])

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[90%] max-w-md p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Invite User</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First Name"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] ${errors.firstName ? "border-red-500" : ""}`}
                            required
                        />
                        {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] ${errors.lastName ? "border-red-500" : ""}`}
                            required
                        />
                        {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] ${errors.email ? "border-red-500" : ""}`}
                            required
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] ${errors.title ? "border-red-500" : ""}`}
                        />
                        {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
                    </div>

                    <select
                        name="userRole"
                        value={formData.userRole}
                        onChange={handleInputChange}
                        className="px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]"
                    >
                        <option value="SuperAdmin">Super Admin</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            placeholder="Note"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] ${errors.note ? "border-red-500" : ""}`}
                        />
                        {errors.note && <span className="text-red-500 text-xs">{errors.note}</span>}
                    </div>

                    <div className="mt-4">
                        {loading && (
                            <div className="flex justify-center mb-4">
                                <Oval
                                    visible={true}
                                    height={40}
                                    width={40}
                                    color="#1579BE"
                                    secondaryColor="#1579BE"
                                    ariaLabel="oval-loading"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="bg-primary disabled:bg-grey hover:bg-opacity-80 text-white font-semibold py-2 w-full rounded-lg"
                            disabled={loading}
                        >
                            {loading ? "Inviting..." : "Invite User"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 w-full rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
