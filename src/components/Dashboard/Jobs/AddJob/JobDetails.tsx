'use client'

import { Country, State, City, IState, ICity } from 'country-state-city';

import { useEffect, useState } from "react";

import { categories, departments, employmentTypes, initialErrors, payFrequencies, payPeriods } from "@/data/constants";
import { useFormData } from '@/context/FormDataContext';
import { useCompany } from '@/context/CompanyContext';
import { GetUsers } from '@/data/users';
import { useError } from '@/context/ErrorContext';
import { User } from '@/types/profileTypes';
import Select from '@/components/Select';
import { getAccessToken } from '@/data/cookies';

export default function JobDetails({ handleChangeStep, handleActiveSteps }: { handleChangeStep: (step: number) => void, handleActiveSteps: (steps: number) => void }) {
    const { formData, setFormData } = useFormData()!;
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState(initialErrors);
    const [users, setUsers] = useState<User[]>([]);

    const [states, setStates] = useState<IState[]>([]); // State options based on selected country
    const [cities, setCities] = useState<ICity[]>([]);

    const [isRemote, setIsRemote] = useState(false)
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const { setError } = useError();
    const { companyInfo } = useCompany();

    const [changed, setChanged] = useState({
        jobTitle: false,
        category: false,
        department: false,
        seats: false,
        payRate: false,
        payPeriod: false,
        payFrequency: false,
        managementRole: false,
        employmentType: false,
        hireType: false,
        hiringManager: false,
        search: false,
        isRemote: false,
        country: false,
        address: false,
        city: false,
        state: false,
        zip: false,
        description: false,
        visibility: false
    });

    const resetChanged = () => {
        setChanged({
            jobTitle: true,
            category: true,
            department: true,
            seats: true,
            payRate: true,
            payPeriod: true,
            payFrequency: true,
            managementRole: true,
            employmentType: true,
            hireType: true,
            hiringManager: true,
            search: true,
            isRemote: true,
            country: true,
            address: true,
            city: true,
            state: true,
            zip: true,
            description: true,
            visibility: true
        })
    }

    // Use custom hook to interact with localStorage
    const accessToken = getAccessToken()

    const validateInputs = (data: typeof formData) => {
        const newErrors = { ...initialErrors };

        // Validate job title
        if (!data.jobTitle || data.jobTitle.trim().length === 0) {
            newErrors.jobTitle = "Job Title is required.";
        }

        // Validate job category
        if (!data.category) {
            newErrors.category = "Please select a job category.";
        }

        // Validate department
        if (!data.department) {
            newErrors.department = "Please select a department.";
        }

        // Validate seats (must be a positive number)
        if (data.seats === undefined || data.seats <= 0) {
            newErrors.seats = "Seats must be a positive number.";
        }

        // Validate pay rate (must be a number and not empty)
        if (!data.payRate || isNaN(data.payRate)) {
            newErrors.pay = "Pay rate must be a valid number.";
        }

        // Validate pay period
        if (!data.payPeriod) {
            newErrors.payPeriod = "Please select a pay period.";
        }

        // Validate pay frequency
        if (!data.payFrequency) {
            newErrors.payFrequency = "Please select a pay frequency.";
        }

        // Validate management role
        if (!data.managementRole) {
            newErrors.managementRole = "Please specify if this is a management role.";
        }

        // Validate employment type
        if (!data.employmentType) {
            newErrors.employmentType = "Please select an employment type.";
        }

        // Validate hire type
        if (!data.hireType) {
            newErrors.hireType = "Please select a hire type.";
        }

        // Validate job visibility
        if (!data.visibility) {
            newErrors.visibility = "Please select job visibility.";
        }

        // Validate hiring manager
        if (!data.hiringManager) {
            newErrors.hiringManager = "Please select a hiring manager.";
        }

        // Validate search
        if (data.search && data.search.trim().length === 0) {
            newErrors.search = "Search term cannot be empty.";
        }

        // Validate country selection
        if (!data.country) {
            newErrors.country = "Please select a country.";
        }

        // Validate address
        if (!data.address) {
            newErrors.address = "Please enter an address.";
        }

        // Validate zip code
        if (!data.zip) {
            newErrors.zip = "Please enter a zip code.";
        }

        // Validate address, city, state, and zip if the job is not remote
        if (!data.isRemote) {
            if (!data.address || data.address.trim().length === 0) {
                newErrors.address = "Address is required for non-remote jobs.";
            }
            if (!data.city || data.city.trim().length === 0) {
                newErrors.city = "City is required for non-remote jobs.";
            }
            if (!data.state || data.state.trim().length === 0) {
                newErrors.state = "State is required for non-remote jobs.";
            }
            if (!data.zip || data.zip.trim().length === 0) {
                newErrors.zip = "ZIP code is required for non-remote jobs.";
            } else if (!/^\d{5}(-\d{4})?$/.test(data.zip)) {
                newErrors.zip = "ZIP code must be in the format '12345' or '12345-6789'.";
            }
        }

        setErrors(newErrors);
        const isValid = (Object.keys(newErrors) as Array<keyof typeof newErrors>).every(
            (key) => !newErrors[key]
        );
        setIsFormValid(isValid);
        return isValid; // Return true if no errors
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => {
            const newFormData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            };
            validateInputs(newFormData); // Validate with updated form data

            if (validateInputs(newFormData)) {
                handleActiveSteps(1)
            } else {
                handleActiveSteps(0)
            }
            return newFormData;
        });

        setChanged((prev) => ({
            ...prev,
            [name]: true
        }))
    };


    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => {
            const newFormData = {
                ...prev,
                [name]: value
            }

            return newFormData
        })
    }

    const handleToggleRemote = () => {
        setIsRemote(!isRemote)
    }

    const handleSaveAndContinue = () => {
        resetChanged()
        const isValid = validateInputs(formData); // Validate inputs and update errors state

        if (isValid) {
            handleChangeStep(2); // Proceed to the next step if the form is valid
        }
    };

    // useEffect(() => {
    //     const isFormValid = validateInputs(formData);

    //     if (!isFormValid || loading) {
    //       setDisabled(true);
    //     } else {
    //       setDisabled(false);
    //     }
    //   }, [formData, loading]);


    useEffect(() => {
        const fetchUsers = async () => {

            if (!companyInfo || !accessToken) {
                return;
            }

            try {
                const result = await GetUsers(companyInfo?.id, accessToken);
                if (result) {
                    setUsers(result);
                } else {
                    setError("Failed to fetch users.");
                }
            } catch (error: any) {
                setError(error.message || "An error occurred while fetching Users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [companyInfo]);


    // Update states when country changes
    useEffect(() => {
        if (formData.country) {
            const countryCode = Country.getAllCountries().find(c => c.name === formData.country)?.isoCode;
            if (countryCode) {
                setStates(State.getStatesOfCountry(countryCode));
                setCities([]); // Clear cities when country changes
            }
        } else {
            setStates([]);
            setCities([]);
        }
    }, [formData.country]);

    useEffect(() => {
        if (validateInputs(formData)) {
            handleActiveSteps(1)
        } else {
            handleActiveSteps(0)
        }
    }, [])

    // Update cities when state changes
    useEffect(() => {
        const countryCode = Country.getAllCountries().find(c => c.name === formData.country)?.isoCode;
        if (formData.state && countryCode) {
            const stateCode = State.getStatesOfCountry(countryCode).find(s => s.name === formData.state)?.isoCode;
            if (stateCode) {
                setCities(City.getCitiesOfState(countryCode, stateCode));
            }
        } else {
            setCities([]);
        }
    }, [formData.state, formData.country]);

    useEffect(() => {
        validateInputs(formData); // Validate on formData change
    }, [formData]);

    return (
        <>
            <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Job Details</h2>
                    <p className="text-grey">Basic information about the job</p>
                </div>

                <form className="flex flex-col gap-8">
                    {/* Job Title and Category */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
                        <label className="flex flex-col w-full gap-1">
                            <p>Job Title</p>
                            <input
                                className="w-full h-full bg-transparent px-2 border-[0.01rem] border-grey rounded-sm text-sm"
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                placeholder="Job Title"
                            />
                            {errors.jobTitle && changed.jobTitle && <span className="text-red-500 text-xs">{errors.jobTitle}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>Job Category</p>
                            <Select
                                options={Object.entries(categories).map(([value, label]) => ({
                                    value,
                                    label
                                }))}
                                value={formData.category}
                                onChange={(value: any) => handleSelectChange("category", value)}
                                placeholder="Select Category"
                                className="w-full h-full"
                            />
                            {errors.category && changed.category && <span className="text-red-500 text-xs">{errors.category}</span>}
                        </label>
                    </div>

                    {/* Department and Seats */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
                        <label className="flex flex-col w-full gap-1">
                            <p>Department</p>
                            <Select
                                options={Object.entries(departments).map(([value, label]) => ({
                                    value,
                                    label
                                }))}
                                value={formData.department}
                                onChange={(value: any) => handleSelectChange("department", value)}
                                placeholder="Select Department"
                                className="w-full h-full"
                            />
                            {errors.department && changed.department && <span className="text-red-500 text-xs">{errors.department}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>Seats</p>
                            <input
                                className="w-full h-full bg-transparent px-2 border-[0.01rem] border-grey rounded-sm text-sm"
                                type="number"
                                name="seats"
                                min={0}
                                max={100}
                                value={formData.seats}
                                onChange={handleInputChange}
                                placeholder="Job Seats"
                            />
                            {errors.seats && changed.seats && <span className="text-red-500 text-xs">{errors.seats}</span>}
                        </label>
                    </div>

                    {/* Compensation Details */}
                    <div className="flex flex-col gap-4 w-full">
                        <h3 className="text-lg">Compensation</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between gap-8 w-full">
                                <label className="flex flex-col w-full gap-1">
                                    <p>Pay Rate</p>
                                    <div className="flex h-full items-center justify-between gap-4">
                                        <input
                                            className="w-full h-full bg-transparent px-2 border-[0.01rem] border-grey rounded-sm text-sm"
                                            type="number"
                                            name="payRate"
                                            min={0}
                                            value={formData.payRate}
                                            onChange={handleInputChange}
                                            placeholder="Pay Rate"
                                        />
                                    </div>
                                    {errors.payRange && changed.payRate && <span className="text-red-500 text-xs">{errors.payRange}</span>}
                                </label>

                                <p className="self-end pb-2">Per</p>

                                <label className="flex flex-col w-full gap-1">
                                    <p>Pay Period</p>
                                    <Select
                                        options={Object.entries(payPeriods).map(([value, label]) => ({
                                            value,
                                            label
                                        }))}
                                        value={formData.payPeriod}
                                        onChange={(value: any) => handleSelectChange("payPeriod", value)}
                                        placeholder="Select pay period"
                                        className="w-full h-full"
                                    />
                                    {errors.payPeriod && changed.payPeriod && <span className="text-red-500 text-xs">{errors.payPeriod}</span>}
                                </label>

                                <label className="flex flex-col w-full gap-1">
                                    <p>Pay Frequency</p>
                                    <Select
                                        options={Object.entries(payFrequencies).map(([value, label]) => ({
                                            value,
                                            label
                                        }))}
                                        value={formData.payFrequency}
                                        onChange={(value: any) => handleSelectChange("payFrequency", value)}
                                        placeholder="Select pay frequency"
                                        className="w-full h-full"
                                    />
                                    {errors.payFrequency && changed.payFrequency && <span className="text-red-500 text-xs">{errors.payFrequency}</span>}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Management Role and Employment Type */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <label className="flex flex-col w-full gap-1">
                            <p>Management Role</p>
                            <Select
                                options={[
                                    { value: "YES", label: "Yes - Will manage other employees" },
                                    { value: "NO", label: "No - Will not manage other employees" }
                                ]}
                                value={formData.managementRole}
                                onChange={(value: any) => handleSelectChange("managementRole", value)}
                                placeholder="Select management role"
                                className="w-full h-full"
                            />
                            {errors.managementRole && changed.managementRole && <span className="text-red-500 text-xs">{errors.managementRole}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1 h-full">
                            <p>Employment Type</p>
                            <Select
                                options={Object.entries(employmentTypes).map(([value, label]) => ({
                                    value,
                                    label
                                }))}
                                value={formData.employmentType}
                                onChange={(value: any) => handleSelectChange("employmentType", value)}
                                placeholder="Select employment type"
                                className="w-full h-full"
                            />
                            {errors.employmentType && changed.employmentType && <span className="text-red-500 text-xs">{errors.employmentType}</span>}
                        </label>
                    </div>

                    {/* Hire Type */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <label className="flex flex-col w-full gap-1 h-full">
                            <p>Hire Type</p>
                            <Select
                                options={[
                                    { value: "NEW", label: "New" },
                                    { value: "REPLACEMENT", label: "Replacement" },
                                    { value: "OTHER", label: "Other" }
                                ]}
                                value={formData.hireType}
                                onChange={(value: any) => handleSelectChange("hireType", value)}
                                placeholder="Select hire type"
                                className="w-full h-full"
                            />
                            {errors.hireType && changed.hireType && <span className="text-red-500 text-xs">{errors.hireType}</span>}
                        </label>

                        <div className="w-full"></div>
                    </div>

                    <div className='flex flex-col lg:flex-row justify-between gap-8 w-full'>
                        <label className="flex flex-col w-full gap-1">
                            <p>Job Visibility</p>
                            <Select
                                options={[
                                    { value: "INTERNAL", label: "Internal" },
                                    { value: "PUBLIC", label: "Public" }
                                ]}
                                value={formData.visibility}
                                onChange={(value: any) => handleSelectChange("visibility", value)}
                                placeholder="Select job visibility"
                                className="w-full h-full"
                            />
                            {errors.visibility && changed.visibility && <span className="text-red-500 text-xs">{errors.visibility}</span>}
                        </label>
                    </div>
                </form>
            </section>

            <section className="flex z-10 flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Add Hiring Managers</h2>
                    <p className="text-grey">Add the people who will review the applicants on this job</p>
                </div>

                <form className="flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
                        <label className="flex flex-col w-full gap-1 h-full">
                            <p>Hiring Manager</p>
                            <Select
                                options={users.map(user => ({
                                    value: user.id.toString(),  // Convert id to string
                                    label: `${user.firstName} ${user.lastName}`
                                }))}
                                value={formData.hiringManager}
                                onChange={(value: any) => handleSelectChange("hiringManager", value)}
                                placeholder="Select a Manager"
                                className="w-full h-full"
                            />
                            {errors.hiringManager && changed.hiringManager && <span className="text-red-500 text-xs">{errors.hiringManager}</span>}
                        </label>

                    </div>
                </form>
            </section>

            <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Job Location</h2>
                    <p className="text-grey">The address where the employee will work from</p>
                </div>

                {/* <label className="flex items-center gap-2">
                    <input
                        onChange={handleInputChange}
                        type="checkbox"
                        checked={formData.isRemote}
                        name="isRemote"
                        id="is-remote"
                    />
                    <p>This is a remote position</p>
                    {errors.isRemote && <span className="text-red-500 text-xs">{errors.isRemote}</span>}
                </label> */}

                <form className="flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
                        <label className="flex flex-col w-full gap-1">
                            <p>Country</p>
                            <Select
                                options={Country.getAllCountries().map(country => ({
                                    value: country.name,
                                    label: country.name,
                                }))}
                                value={formData.country}
                                onChange={(value: any) => handleSelectChange("country", value)}
                                placeholder="Select Country"
                                className="w-full h-full"
                            />
                            {errors.country && <span className="text-red-500 text-xs">{errors.country}</span>}
                        </label>

                        <div className="w-full"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full h-16">
                        <label className="flex flex-col w-full gap-1">
                            <p>Address</p>
                            <input
                                className="w-full h-max bg-transparent px-2 py-2 border-[0.01rem] border-grey rounded-sm text-sm"
                                type="text"
                                name="address"
                                id="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            {errors.address && changed.address && <span className="text-red-500 text-xs">{errors.address}</span>}
                        </label>

                        <div className="w-full"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">

                        <label className="flex flex-col w-full gap-1">
                            <p>State</p>
                            <Select
                                options={states.map((state) => ({
                                    value: state.name,
                                    label: state.name
                                }))}
                                value={formData.state}
                                onChange={(value: any) => handleSelectChange("state", value)}
                                placeholder="Select state"
                                className="w-full h-full"
                            />
                            {errors.state && <span className="text-red-500 text-xs">{errors.state}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>City</p>
                            <Select
                                options={cities.map((city) => ({
                                    value: city.name,
                                    label: city.name
                                }))}
                                value={formData.city}
                                onChange={(value: any) => handleSelectChange("city", value)}
                                placeholder="Select city"
                                className="w-full h-full"
                            />
                            {errors.city && <span className="text-red-500 text-xs">{errors.city}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>Zip Code</p>
                            <input
                                className="w-full h-full bg-transparent px-2 py-2 border-[0.01rem] border-grey rounded-sm text-sm"
                                type="number"
                                name="zip"
                                id="zip"
                                placeholder="Zip Code"
                                value={formData.zip}
                                onChange={handleInputChange}
                            />
                            {errors.zip && changed.zip && <span className="text-red-500 text-xs">{errors.zip}</span>}
                        </label>
                    </div>
                </form>
            </section>

            <section className="flex items-end justify-end">
                <div className="flex gap-4">
                    {/* <button className="flex gap-2 items-center border-2 border-primary px-4 py-2 hover:border-[0.1rem] text-primary text-sm font-bold rounded-md">
                        <p>Cancel</p>
                    </button> */}
                    <button
                        className="flex gap-2 items-center bg-primary disabled:cursor-not-allowed disabled:bg-grey disabled:border-grey border-2 border-primary px-4 py-2 hover:bg-opacity-90 text-white text-sm font-bold rounded-md"
                        onClick={handleSaveAndContinue}
                        disabled={disabled}
                    >
                        Save & Continue
                    </button>
                </div>
            </section>
        </>
    )
}