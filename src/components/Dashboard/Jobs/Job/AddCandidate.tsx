"use client";

import { useState, useEffect } from "react";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";
import { addCandidate } from "@/data/jobsData";
import { useCompany } from "@/context/CompanyContext";
import { useParams } from "next/navigation";
import { Country, State, City, IState, ICity } from "country-state-city";
import Select from "@/components/Select";

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
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("User not authenticated.");
        return;
      }

      await addCandidate(jobId, token, applicantData);
      setSuccess("Candidate added successfully!");
      handleLoad(true)
      onClose();
    } catch (error: any) {
      console.log(error);
      setError(`Failed to add candidate: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Add New Candidate</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={applicantData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            value={applicantData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={applicantData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={applicantData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="address"
            value={applicantData.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded"
          />

          <Select
            options={Country.getAllCountries().map(country => ({ label: country.name, value: country.name }))}
            value={applicantData.country}
            onChange={handleCountryChange}
            placeholder="Select Country"
          />

          <Select
            options={states.map(state => ({ label: state.name, value: state.name }))}
            value={applicantData.state}
            onChange={handleStateChange}
            placeholder="Select State"
          />

          <Select
            options={cities.map(city => ({ label: city.name, value: city.name }))}
            value={applicantData.city}
            onChange={(value) => setApplicantData({ ...applicantData, city: value })}
            placeholder="Select City"
          />

          <input
            type="text"
            name="zipCode"
            value={applicantData.zipCode}
            onChange={handleChange}
            placeholder="Zip Code"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="referredBy"
            value={applicantData.referredBy}
            onChange={handleChange}
            placeholder="Referred By"
            className="border p-2 rounded"
          />
          <input
            type="url"
            name="resumeUrl"
            value={applicantData.resumeUrl}
            onChange={handleChange}
            placeholder="Resume URL"
            className="border p-2 rounded"
          />
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
