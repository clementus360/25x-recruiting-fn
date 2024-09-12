import { FormDataType } from "@/types/authTypes";
import { API_BASE_URL } from "./constants";
import { useRouter } from "next/navigation";
import { useError } from "@/context/ErrorContext";
import { useSuccess } from "@/context/SuccessContext";

const initialFormData: FormDataType = {
    phone: "",
    email: "",
    fname: "",
    lname: "",
    jobTitle: "",
    company: "",
    employees: "",
    industry: "",
};

// Separate function to register a company
export async function registerCompany(formData: typeof initialFormData) {
    const requestData = {
        ownerFirstName: formData.fname,
        ownerLastName: formData.lname,
        ownerPhone: formData.phone.slice(-10),
        businessEmail: formData.email,
        jobTitle: formData.jobTitle,
        companyName: formData.company,
        numOfEmployees: parseInt(formData.employees, 10), // Convert to integer
        industry: formData.industry,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/companies/company-register`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to register the company.");
        }

        return responseData; // Return the response data if successful
    } catch (error: any) {
        console.error("Error registering the company:", error.message);
        throw error;
    }
}

export async function userSignIn(
    email: string,
    password: string,
    onSignInSuccess: () => void // Add a callback function for successful login
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        console.error("Error details from the response:", responseData);
        throw new Error(responseData.message || "Failed to Sign-in");
      }
  
      localStorage.setItem("accessToken", responseData.accessToken);
  
      // Call the callback to fetch user data
      onSignInSuccess(); // Trigger fetching user data after login
  
      return responseData; // Return the response data if successful
    } catch (error: any) {
      console.error("Error Logging in", error.message);
      throw error;
    }
  }
  

export async function CompleteRegistration(password: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/companies/register-company-owner`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                password: password
            })
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to register the company.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error registering the company:", error.message);
        throw error;
    }
}

export function useLogout() {
    const router = useRouter(); // Initialize useRouter inside the hook
  
    // Logout function
    const handleLogout = () => {
      // Remove access token from localStorage
      localStorage.removeItem("accessToken");
      // Redirect to sign-in page
      router.push("/sign-in");
    };
  
    return handleLogout;
  }