'use client';

import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { addCandidate } from "@/data/jobsData";
import { useCompany } from "@/context/CompanyContext";
import { useParams } from "next/navigation";
import { Country, State, City, IState, ICity } from "country-state-city";
import Select from "@/components/Select";
import { getAccessToken } from "@/data/cookies";

interface AddApplicantOverlayProps {
  handleLoad: (load: boolean) => void;
  onClose: () => void;
}

export const AddCandidateOverlay: React.FC<AddApplicantOverlayProps> = ({ handleLoad, onClose }) => {
  const [applicantData, setApplicantData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "Sarasota",
    state: "Florida",
    zipCode: "",
    country: "United States",
    referredBy: "",
    resumeUrl: "",
  });

  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const params = useParams<{ job: string }>();
  const jobId = params.job;
  const { companyInfo } = useCompany();
  const { setError } = useError();
  const { setSuccess } = useSuccess();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplicantData((prev) => ({ ...prev, [name]: value }));
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
    // Add more validations as needed
    return true;
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

      await addCandidate(jobId, token, applicantData);
      setSuccess("Candidate added successfully!");
      handleLoad(true)
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Candidate</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label htmlFor="firstName" className="text-xs font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={applicantData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastName" className="text-xs font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={applicantData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={applicantData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone" className="text-xs font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={applicantData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="address" className="text-xs font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={applicantData.address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="country" className="text-xs font-medium text-gray-700 mb-1">Country</label>
            <Select
              options={Country.getAllCountries().map(country => ({ label: country.name, value: country.name }))}
              value={applicantData.country}
              onChange={handleCountryChange}
              placeholder="Select Country"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="state" className="text-xs font-medium text-gray-700 mb-1">State</label>
            <Select
              options={states.map(state => ({ label: state.name, value: state.name }))}
              value={applicantData.state}
              onChange={handleStateChange}
              placeholder="Select State"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="city" className="text-xs font-medium text-gray-700 mb-1">City</label>
            <Select
              options={cities.map(city => ({ label: city.name, value: city.name }))}
              value={applicantData.city}
              onChange={(value) => setApplicantData({ ...applicantData, city: value })}
              placeholder="Select City"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="zipCode" className="text-xs font-medium text-gray-700 mb-1">Zip Code</label>
            <input
              type="text"
              name="zipCode"
              id="zipCode"
              value={applicantData.zipCode}
              onChange={handleChange}
              placeholder="Zip Code"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="referredBy" className="text-xs font-medium text-gray-700 mb-1">Referred By</label>
            <input
              type="text"
              name="referredBy"
              id="referredBy"
              value={applicantData.referredBy}
              onChange={handleChange}
              placeholder="Referred By"
              className="border p-2 rounded"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="resumeUrl" className="text-xs font-medium text-gray-700 mb-1">Resume URL</label>
            <input
              type="url"
              name="resumeUrl"
              id="resumeUrl"
              value={applicantData.resumeUrl}
              onChange={handleChange}
              placeholder="Resume URL"
              className="border p-2 rounded"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Add Applicant
          </button>
        </div>
      </div>
    </div>
  );
};
