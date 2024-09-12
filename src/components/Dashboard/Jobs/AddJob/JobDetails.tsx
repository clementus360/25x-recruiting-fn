'use client'

import { Country, State, City, IState, ICity } from 'country-state-city';

import { useEffect, useState } from "react";

import { categories, departments, employmentTypes, initialErrors, payFrequencies, payPeriods } from "@/data/constants";
import { useFormData } from '@/context/FormDataContext';
import { useCompany } from '@/context/CompanyContext';
import { GetUsers } from '@/data/users';
import { useError } from '@/context/ErrorContext';
import { User } from '@/types/profileTypes';

export default function JobDetails({ handleChangeStep, handleActiveSteps }: { handleChangeStep: (step: number) => void, handleActiveSteps: (steps: number) => void }) {
    const { formData, setFormData } = useFormData()!;
    const [isFormValid, setIsFormValid] = useState(false);
    const [errors, setErrors] = useState(initialErrors);
    const [users, setUsers] = useState<User[]>([]);

    const [states, setStates] = useState<IState[]>([]); // State options based on selected country
    const [cities, setCities] = useState<ICity[]>([]);

    const [isRemote, setIsRemote] = useState(false)
    const [loading, setLoading] = useState(false);
    const { setError } = useError();
    const { companyInfo } = useCompany();

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
    };

    const handleToggleRemote = () => {
        setIsRemote(!isRemote)
    }

    const handleSaveAndContinue = () => {
        const isValid = validateInputs(formData); // Validate inputs and update errors state
        console.log(errors)
        if (isValid) {
            handleChangeStep(2); // Proceed to the next step if the form is valid
        }
    };

    const fetchUsers = async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!companyInfo || !accessToken) {
            return;
        }

        try {
            const result = await GetUsers(companyInfo?.id, accessToken);
            if (result) {
                setUsers(result);
            } else {
                setError("Failed to fetch Users.");
            }
        } catch (error) {
            setError("An error occurred while fetching Users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                                className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                                placeholder="Job Title"
                            />
                            {errors.jobTitle && <span className="text-red-500 text-sm">{errors.jobTitle}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>Job Category</p>
                            <select
                                className="w-full h-full bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                name="category"
                                defaultValue={'accounting & finance'}
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Category</option>
                                {Object.entries(categories).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                        </label>
                    </div>

                    {/* Department and Seats */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
                        <label className="flex flex-col w-full gap-1">
                            <p>Department</p>
                            <select
                                className="w-full h-full bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                name="department"
                                defaultValue={'accounting'}
                                value={formData.department}
                                onChange={handleInputChange}
                            >
                                {Object.entries(departments).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.department && <span className="text-red-500 text-sm">{errors.department}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>Seats</p>
                            <input
                                className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                type="number"
                                name="seats"
                                min={0}
                                max={100}
                                value={formData.seats}
                                onChange={handleInputChange}
                                placeholder="Job Seats"
                            />
                            {errors.seats && <span className="text-red-500 text-sm">{errors.seats}</span>}
                        </label>
                    </div>

                    {/* Compensation Details */}
                    <div className="flex flex-col gap-4 w-full">
                        <h3 className="text-lg">Compensation</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between gap-8 w-full">
                                <label className="flex flex-col w-full gap-1">
                                    <p>Pay Rate</p>
                                    <div className="flex items-center justify-between gap-4">
                                        <input
                                            className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                            type="number"
                                            name="payRate"
                                            min={0}
                                            value={formData.payRate}
                                            onChange={handleInputChange}
                                            placeholder="Pay Rate"
                                        />
                                    </div>
                                    {errors.payRange && <span className="text-red-500 text-sm">{errors.payRange}</span>}
                                </label>

                                <p className="self-end pb-2">Per</p>

                                <label className="flex flex-col w-full gap-1">
                                    <p>Pay Period</p>
                                    <select
                                        className="w-full h-full bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                        name="payPeriod"
                                        defaultValue={'year'}
                                        value={formData.payPeriod}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Pay Period</option>
                                        {Object.entries(payPeriods).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.payPeriod && <span className="text-red-500 text-sm">{errors.payPeriod}</span>}
                                </label>

                                <label className="flex flex-col w-full gap-1">
                                    <p>Pay Frequency</p>
                                    <select
                                        className="w-full h-full bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                        name="payFrequency"
                                        defaultValue={'weekly'}
                                        value={formData.payFrequency}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Pay Frequency</option>
                                        {Object.entries(payFrequencies).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.payFrequency && <span className="text-red-500 text-sm">{errors.payFrequency}</span>}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Management Role and Employment Type */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <label className="flex flex-col w-full gap-1">
                            <p>Management Role</p>
                            <select
                                className="w-full h-10 bg-transparent px-2 border-[0.01rem] border-grey rounded-md text-sm"
                                name="managementRole"
                                id="managementRole"
                                defaultValue={'YES'}
                                value={formData.managementRole}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                                <option value="YES">Yes - Will manage other employees</option>
                                <option value="NO">No - Will not manage other employees</option>
                            </select>
                            {errors.managementRole && <span className="text-red-500 text-sm">{errors.managementRole}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1 h-full">
                            <p>Employment Type</p>
                            <select
                                className="w-full h-10 bg-transparent px-2 border-[0.01rem] border-grey rounded-md text-sm"
                                name="employmentType"
                                defaultValue={'fulltime - salary'}
                                value={formData.employmentType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Employment Type</option>
                                {Object.entries(employmentTypes).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                            {errors.employmentType && <span className="text-red-500 text-sm">{errors.employmentType}</span>}
                        </label>
                    </div>

                    {/* Hire Type */}
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <label className="flex flex-col w-full gap-1 h-full">
                            <p>Hire Type</p>
                            <select
                                className="w-full h-10 bg-transparent px-2 border-[0.01rem] border-grey rounded-md text-sm"
                                name="hireType"
                                defaultValue={'new'}
                                value={formData.hireType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Hire Type</option>
                                <option value="NEW">New</option>
                                <option value="REPLACEMENT">Replacement</option>
                                <option value="OTHER">Other</option>
                            </select>
                            {errors.hireType && <span className="text-red-500 text-sm">{errors.hireType}</span>}
                        </label>

                        <div className="w-full"></div>
                    </div>

                    <div className='flex flex-col lg:flex-row justify-between gap-8 w-full'>
                        <label className="flex flex-col w-full gap-1">
                            <p>Job Status</p>
                            <select
                                className="w-full h-10 bg-transparent px-2 border-[0.01rem] border-grey rounded-md text-sm"
                                name="status"
                                id="status"
                                defaultValue={'OPENED'}
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                                <option value="OPENED">Open</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                            {errors.status && <span className="text-red-500 text-sm">{errors.status}</span>}
                        </label>
                        <label className="flex flex-col w-full gap-1">
                            <p>Job Visibility</p>
                            <select
                                className="w-full h-10 bg-transparent px-2 border-[0.01rem] border-grey rounded-md text-sm"
                                name="visibility"
                                id="visibility"
                                defaultValue={'INTERNAL'}
                                value={formData.visibility}
                                onChange={handleInputChange}
                            >
                                <option value=""></option>
                                <option value="INTERNAL">Internal</option>
                                <option value="PUBLIC">Public</option>
                            </select>
                            {errors.visibility && <span className="text-red-500 text-sm">{errors.visibility}</span>}
                        </label>
                    </div>
                </form>
            </section>

            <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
                <div className="flex flex-col">
                    <h2 className="text-lg font-bold">Add Hiring Managers</h2>
                    <p className="text-grey">Add the people who will review the applicants on this job</p>
                </div>

                <form className="flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
                        <label className="flex flex-col w-full gap-1 h-full">
                            <p>Hiring Manager</p>
                            <select
                                className="w-full h-10 bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                name="hiringManager"
                                id="hiringManager"
                                defaultValue={''}
                                value={formData.hiringManager}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a Manager</option>
                                {users.map(((user, idx) => (
                                    <option key={idx} value={user.id}>{user.firstName} {user.lastName}</option>
                                )))}
                            </select>
                            {errors.hiringManager && <span className="text-red-500 text-sm">{errors.hiringManager}</span>}
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
                    {errors.isRemote && <span className="text-red-500 text-sm">{errors.isRemote}</span>}
                </label> */}

                <form className="flex flex-col gap-8">
                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">
                        <label className="flex flex-col w-full gap-1">
                            <p>Country</p>
                            <select
                                className="w-full h-10 bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                name="country"
                                id="country"
                                defaultValue={''}
                                value={formData.country}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Country</option>
                                {Country.getAllCountries().map((country, idx) => <option key={idx} value={country.name}>{country.name}</option>)}
                            </select>
                            {errors.country && <span className="text-red-500 text-sm">{errors.country}</span>}
                        </label>

                        <div className="w-full"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full h-16">
                        <label className="flex flex-col w-full gap-1">
                            <p>Address</p>
                            <input
                                className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                type="text"
                                name="address"
                                id="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                            {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                        </label>

                        <div className="w-full"></div>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-8 w-full">

                        <label className="flex flex-col w-full gap-1">
                            <p>State</p>
                            <select
                                className="w-full bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm h-full"
                                name="state"
                                id="state"
                                value={formData.state}
                                onChange={handleInputChange}
                            >
                                <option value="">Select State</option>
                                {states.map((state) => (
                                    <option key={state.isoCode} value={state.name}>
                                        {state.name}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>City</p>
                            <select
                                className="w-full bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm h-full"
                                name="city"
                                id="city"
                                value={formData.city}
                                onChange={handleInputChange}
                            >
                                <option value="">Select City</option>
                                {cities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <span className="text-red-500 text-sm">{errors.state}</span>}
                        </label>

                        <label className="flex flex-col w-full gap-1">
                            <p>Zip Code</p>
                            <input
                                className="w-full h-max bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
                                type="number"
                                name="zip"
                                id="zip"
                                placeholder="Zip Code"
                                value={formData.zip}
                                onChange={handleInputChange}
                            />
                        </label>
                        {errors.zip && <span className="text-red-500 text-sm">{errors.zip}</span>}
                    </div>
                </form>
            </section>

            <section className="flex items-end justify-end">
                <div className="flex gap-4">
                    {/* <button className="flex gap-2 items-center border-2 border-primary px-4 py-2 hover:border-[0.1rem] text-primary text-sm font-bold rounded-md">
                        <p>Cancel</p>
                    </button> */}
                    <button
                        className="flex gap-2 items-center bg-primary disabled:bg-grey disabled:border-grey border-2 border-primary px-4 py-2 hover:bg-opacity-90 text-white text-sm font-bold rounded-md"
                        onClick={handleSaveAndContinue}
                    >
                        Save & Continue
                    </button>
                </div>
            </section>
        </>
    )
}