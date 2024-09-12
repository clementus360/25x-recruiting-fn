'use client';

import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { GetCompanyData, GetUsers, UpdateCompanyProfile } from "@/data/users";
import UserInfoCard from "@/components/Dashboard/Profile/UserCard";
import InviteUserOverlay from "@/components/Dashboard/Profile/InviteUserOverlay";
import { Country, State, City, IState, ICity } from "country-state-city";
import Select from "@/components/Select";

export default function CompanyProfile() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    ownerPhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const { setError } = useError();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const { companyInfo } = useCompany();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    setFormData(prevData => ({ ...prevData, country, state: "", city: "" }));
  };

  const handleStateChange = (state: string) => {
    const selectedState = states.find(s => s.name === state);
    if (selectedState) {
      const countryIsoCode = Country.getAllCountries().find(c => c.name === formData.country)?.isoCode;
      if (countryIsoCode) {
        setCities(City.getCitiesOfState(countryIsoCode, selectedState.isoCode));
      }
    } else {
      setCities([]);
    }
    setFormData(prevData => ({ ...prevData, state, city: "" }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Access token not found.");
      return;
    }

    setLoading(true);

    try {
      await UpdateCompanyProfile(formData, accessToken);
      console.log("Company Data Updated:", formData);
    } catch (error) {
      setError("An error occurred while updating company data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!companyInfo || !accessToken) {
      return;
    }

    setLoading(true);

    try {
      const result = await GetUsers(companyInfo.id, accessToken);
      if (result) {
        setUsers(result);
      } else {
        setError("Failed to fetch users.");
      }
    } catch (error) {
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return;
    }

    setLoading(true);

    try {
      const result = await GetCompanyData(accessToken);
      if (result) {
        setFormData({
          companyName: result.companyName || "",
          website: result.website || "",
          ownerPhone: result.ownerPhone || "",
          address: result.address || "",
          city: result.city || "",
          state: result.state || "",
          country: result.country || "",
          zip: result.zip || "",
        });

        handleCountryChange(result.country || "");
      } else {
        setError("Failed to fetch company data.");
      }
    } catch (error) {
      setError("An error occurred while fetching company data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanyInfo();
  }, [companyInfo]);

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    fetchUsers();
  };

  return (

    <main className="flex min-h-screen flex-col gap-16 py-16 w-full px-4 lg:px-40">
      <section className="flex flex-col gap-8 w-full bg-white py-8 px-6 lg:px-8 rounded-lg drop-shadow-sm">
        <h1 className="text-3xl font-bold">Company Profile</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <p>Company Name</p>
            <input
              className="bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-1">
            <p>Website</p>
            <input
              className="bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-1">
            <p>Owner Phone</p>
            <input
              className="bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="ownerPhone"
              placeholder="Owner Phone"
              value={formData.ownerPhone}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-1">
            <p>Address</p>
            <input
              className="bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col gap-1">
            <p>Country</p>
            <Select
              options={Country.getAllCountries().map((country) => ({
                value: country.name,
                label: country.name,
              }))}
              value={formData.country}
              onChange={(value) => handleCountryChange(value)}
              placeholder="Select Country"
            />
          </label>

          <label className="flex flex-col gap-1">
            <p>State</p>
            <Select
              options={states.map((state) => ({
                value: state.name,
                label: state.name,
              }))}
              value={formData.state}
              onChange={(value) => handleStateChange(value)}
              placeholder="Select State"
            />
          </label>

          <label className="flex flex-col gap-1">
            <p>City</p>
            <Select
              options={cities.map((city) => ({
                value: city.name,
                label: city.name,
              }))}
              value={formData.city}
              onChange={(value) => setFormData((prevData) => ({ ...prevData, city: value }))}
              placeholder="Select City"
            />
          </label>

          <label className="flex flex-col gap-1">
            <p>ZIP</p>
            <input
              className="bg-transparent px-2 py-3 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleChange}
            />
          </label>

          <div className="col-span-1 md:col-span-2 flex justify-start">
            <button
              type="submit"
              className="bg-primary px-8 py-4 text-white text-sm font-semibold rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Information"}
            </button>
          </div>
        </form>

        <h1 className="text-3xl font-bold">Users</h1>
        <div className="w-full flex flex-wrap gap-3">
          {users.map((user, idx) => (
            <UserInfoCard user={user} key={idx} />
          ))}
          <button
            className="border-[0.01rem] border-grey rounded-md p-4 min-w-[10rem]"
            onClick={() => setIsOverlayOpen(true)}
          >
            Invite New User
          </button>
        </div>

        {isOverlayOpen && (
          <InviteUserOverlay
            onClose={handleCloseOverlay}
          />
        )}
      </section>
    </main>
  );
}
