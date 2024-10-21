'use client';

import { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { useError } from "@/context/ErrorContext";
import { GetCompanyData, GetUsers, UpdateCompanyProfile } from "@/data/users";
import UserInfoCard from "@/components/Dashboard/Profile/UserCard";
import InviteUserOverlay from "@/components/Dashboard/Profile/InviteUserOverlay";
import { Country, State, City, IState, ICity } from "country-state-city";
import Select from "@/components/Select";
import { getAccessToken } from "@/data/cookies";
import { useSuccess } from "@/context/SuccessContext";
import { Oval } from "react-loader-spinner";

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
  const [initialData, setInitialData] = useState({
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
  const [errors, setErrors] = useState({
    companyName: "",
    website: "",
    ownerPhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
  });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [users, setUsers] = useState([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const { companyInfo } = useCompany();
  const { success, setSuccess } = useSuccess();

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

  const handleCityChange = (city: string) => {
    setFormData(prevData => ({ ...prevData, city: city }));
  };



  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const accessToken = getAccessToken();

    if (!accessToken) {
      setError("User not registered.");
      return;
    }

    if (!companyInfo) {
      setError("Could not find company information.");
      return;
    }

    setLoading(true);

    // Compare formData with initialData to only update changed fields
    const updatedFields: Partial<typeof formData> = {};
    for (const key in formData) {
      if (formData[key as keyof typeof formData] !== initialData[key as keyof typeof formData]) {
        updatedFields[key as keyof typeof formData] = formData[key as keyof typeof formData];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      setError("No changes were made.");
      setLoading(false);
      return;
    }

    try {
      await UpdateCompanyProfile(companyInfo?.id, updatedFields, accessToken);
      setSuccess("Company profile updated successfully");
    } catch (error: any) {
      setError(error.message || "Failed to update company profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const accessToken = getAccessToken();

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
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyInfo = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      return;
    }

    setLoading(true);

    try {
      const result = await GetCompanyData(accessToken);
      if (result) {
        const fetchedData = {
          companyName: result.companyName || "",
          website: result.website || "",
          ownerPhone: result.ownerPhone || "",
          address: result.address || "",
          city: result.city || "",
          state: result.state || "",
          country: result.country || "",
          zip: result.zip || "0000",
        }

        setFormData(fetchedData);
        setInitialData(fetchedData)
        handleCountryChange(result.country || "");
        handleStateChange(result.state || "")
        handleCityChange(result.city || "")
      } else {
        setError("Failed to fetch company data.");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred while fetching company data.");
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
              className="bg-transparent px-2 py-2 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
            {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName}</p>}
          </label>

          <label className="flex flex-col gap-1">
            <p>Website</p>
            <input
              className="bg-transparent px-2 py-2 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
            />
            {errors.website && <p className="text-red-500 text-xs">{errors.website}</p>}
          </label>

          <label className="flex flex-col gap-1">
            <p>Owner Phone</p>
            <input
              className="bg-transparent px-2 py-2 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="ownerPhone"
              placeholder="Owner Phone"
              value={formData.ownerPhone}
              onChange={handleChange}
            />
            {errors.ownerPhone && <p className="text-red-500 text-xs">{errors.ownerPhone}</p>}
          </label>

          <label className="flex flex-col gap-1">
            <p>Address</p>
            <input
              className="bg-transparent px-2 py-2 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
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
            {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
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
            {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
          </label>

          <label className="flex flex-col gap-1">
            <p>City</p>
            <Select
              options={cities.map((city) => ({
                value: city.name,
                label: city.name,
              }))}
              value={formData.city}
              onChange={(value) => handleCityChange(value)}
              placeholder="Select City"
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
          </label>

          <label className="flex flex-col gap-1">
            <p>ZIP</p>
            <input
              className="bg-transparent px-2 py-2 border-[0.01rem] border-grey rounded-md text-sm"
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleChange}
            />
            {errors.zip && <p className="text-red-500 text-xs">{errors.zip}</p>}
          </label>

          <div className="col-span-1 md:col-span-2 flex justify-start">
            <button
              className="flex gap-2 items-center justify-center bg-primary disabled:cursor-not-allowed disabled:bg-grey hover:bg-opacity-80 cursor-pointer text-white font-semibold py-4 w-full rounded-lg"
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
              <p>{loading ? "Saving..." : "Save Information"}</p>
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
