'use client';

import { useEffect, useState } from "react";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { Oval } from "react-loader-spinner";
import { useCompany } from "@/context/CompanyContext";
import { InviteUser } from "@/data/users";
import Select from "@/components/Select";
import { getAccessToken } from "@/data/cookies";

export default function InviteUserOverlay({ onClose }: { onClose: () => void }) {
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const [loading, setLoading] = useState(false);
    const { companyInfo } = useCompany()
    const [disabled, setDisabled] = useState(true);

    const accessToken = getAccessToken();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        title: "",
        userRole: "Admin",
        note: "",
    });

    const [changed, setChanged] = useState({
        firstName: false,
        lastName: false,
        email: false,
        title: false,
        userRole: false,
        note: false,
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

        if (!formData.title.trim()) {
            newErrors.title = "Title is required.";
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

        setChanged((prev) => ({
            ...prev,
            [name]: true
        }))
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });

        setChanged((prev) => ({
            ...prev,
            [name]: true
        }))
    }

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
            setError("An error occurred while inviting the user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const isFormValid = validate();

        if (!isFormValid || loading) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [formData, loading]);

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
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]`}
                            required
                        />
                        {errors.firstName && changed.firstName && <span className="text-red-500 text-xs">{errors.firstName}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last Name"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem],`}
                            required
                        />
                        {errors.lastName && changed.lastName && <span className="text-red-500 text-xs">{errors.lastName}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]`}
                            required
                        />
                        {errors.email && changed.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                    </div>

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Title"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem]`}
                        />
                        {errors.title && changed.title && <span className="text-red-500 text-xs">{errors.title}</span>}
                    </div>

                    <Select
                        value={formData.userRole}
                        options={[
                            { value: 'Admin', label: 'Admin' },
                            { value: 'User', label: 'User' }
                        ]}
                        onChange={(value) => handleSelectChange("userRole", value)}
                        className="w-full h-full"
                    />

                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            placeholder="Note"
                            className={`px-2 py-2 border-grey border-[0.02rem] rounded-[0.2rem] `}
                        />
                        {errors.note && changed.note && <span className="text-red-500 text-xs">{errors.note}</span>}
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
                            className="flex items-center justify-center gap-2 bg-primary disabled:cursor-not-allowed disabled:bg-grey hover:bg-opacity-80 text-white font-semibold py-2 w-full rounded-lg"
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
