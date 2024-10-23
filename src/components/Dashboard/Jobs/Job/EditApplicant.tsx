'use client';

import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { Country, State, City, IState, ICity } from "country-state-city";
import Select from "@/components/Select";
import { getAccessToken } from "@/data/cookies";
import { getApplicantData } from "@/data/jobsData";
import { editApplicantData } from "@/data/appplicant";

interface EditApplicantOverlayProps {
    applicantId: string;
    onClose: () => void;
    handleLoad: (load: boolean) => void;
}

export const EditApplicantOverlay: React.FC<EditApplicantOverlayProps> = ({ applicantId, onClose, handleLoad }) => {
    const [applicantData, setApplicantData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        referredBy: "",
        resumeUrl: "",
    });
    const [originalData, setOriginalData] = useState({ ...applicantData });
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);
    const { setError } = useError();
    const { setSuccess } = useSuccess();

    // Fetch the applicant's details when component mounts
    useEffect(() => {
        const fetchApplicantData = async () => {
            try {
                const token = getAccessToken();
                if (!token) {
                    setError("User not authenticated.");
                    return;
                }
                const details = await getApplicantData(applicantId, token);
                setApplicantData(details); // Set the applicant's details
                setOriginalData(details); // Keep the original data for comparison
            } catch (error: any) {
                setError(error.message || "Failed to fetch applicant data.");
            }
        };

        fetchApplicantData();
    }, [applicantId, setError]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setApplicantData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (country: string) => {
        const selectedCountry = Country.getAllCountries().find(c => c.name === country);
        if (selectedCountry) {
            setStates(State.getStatesOfCountry(selectedCountry.isoCode));
            setCities([]); // Clear cities when the country changes
        } else {
            setStates([]);
            setCities([]);
        }
        setApplicantData(prev => ({ ...prev, country, state: "", city: "" }));
    };

    const handleStateChange = (state: string) => {
        const selectedState = states.find(s => s.name === state);
        if (selectedState) {
            const countryIsoCode = Country.getAllCountries().find(c => c.name === applicantData.country)?.isoCode;
            if (countryIsoCode) {
                setCities(City.getCitiesOfState(countryIsoCode, selectedState.isoCode));
            }
        } else {
            setCities([]);
        }
        setApplicantData(prev => ({ ...prev, state, city: "" }));
    };

    useEffect(() => {
        if (applicantData.country) {
            const countryCode = Country.getAllCountries().find(c => c.name === applicantData.country)?.isoCode;
            if (countryCode) {
                setStates(State.getStatesOfCountry(countryCode));
                setCities([]); // Clear cities when country changes
            }
        } else {
            setStates([]);
            setCities([]);
        }
    }, [applicantData.country]);

    useEffect(() => {
        if (applicantData.state && applicantData.country) {
            const countryCode = Country.getAllCountries().find(c => c.name === applicantData.country)?.isoCode;
            const stateCode = states.find(s => s.name === applicantData.state)?.isoCode;
            if (countryCode && stateCode) {
                setCities(City.getCitiesOfState(countryCode, stateCode));
            }
        } else {
            setCities([]);
        }
    }, [applicantData.state, applicantData.country, states]);

    const validateInputs = () => {
        if (!applicantData.firstName || !applicantData.lastName || !applicantData.email) {
            setError("First name, last name, and email are required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const token = getAccessToken();
            if (!token) {
                setError("User not authenticated.");
                return;
            }

            // Compare current data with original and only send the changed fields
            const changedFields = Object.keys(applicantData).reduce((acc, key) => {
                if (applicantData[key as keyof typeof applicantData] !== originalData[key as keyof typeof originalData]) {
                    acc[key as keyof typeof applicantData] = applicantData[key as keyof typeof applicantData];
                }
                return acc;
            }, {} as Partial<typeof applicantData>);

            if (Object.keys(changedFields).length === 0) {
                setError("No changes made to update.");
                return;
            }

            await editApplicantData(changedFields, applicantId, token);
            setSuccess("Applicant updated successfully!");
            handleLoad(true);
            onClose();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const handleClickOutside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent the event from bubbling up to the outside click handler
        onClose();
      };

    return (
        <div onMouseDown={handleClickOutside} className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
            <div onMouseDown={(e) => e.stopPropagation()} className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Update Applicant Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={applicantData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={applicantData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={applicantData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={applicantData.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={applicantData.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm">Country</label>
                        <Select
                            options={Country.getAllCountries().map(country => ({ label: country.name, value: country.name }))}
                            value={applicantData.country}
                            onChange={handleCountryChange}
                            placeholder="Select Country"
                        />
                    </div>
                    <div>
                        <label className="text-sm">State</label>
                        <Select
                            options={states.map(state => ({ label: state.name, value: state.name }))}
                            value={applicantData.state}
                            onChange={handleStateChange}
                            placeholder="Select State"
                        />
                    </div>
                    <div>
                        <label className="text-sm">City</label>
                        <Select
                            options={cities.map(city => ({ label: city.name, value: city.name }))}
                            value={applicantData.city}
                            onChange={(value) => setApplicantData({ ...applicantData, city: value })}
                            placeholder="Select City"
                        />
                    </div>
                    <div>
                        <label className="text-sm">Zip Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={applicantData.zipCode}
                            onChange={handleChange}
                            placeholder="Zip Code"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm">Referred By</label>
                        <input
                            type="text"
                            name="referredBy"
                            value={applicantData.referredBy}
                            onChange={handleChange}
                            placeholder="Referred By"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-primary text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
};
