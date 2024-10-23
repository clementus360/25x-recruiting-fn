import { UserData } from "@/types/authTypes";
import { API_BASE_URL } from "./constants";
import { CompanyUpdateData, UserUpdateData } from "@/types/profileTypes";

export async function GetUsers(companyId: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/${companyId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the companies data
        return data.users; // Assuming you only need the companies array
    } catch (error: any) {
        console.error("Error Getting users:", error.message);
        throw error;
    }
}

export async function GetUserData(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/view-profile`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the user data
        return data;
    } catch (error: any) {
        console.error("Error Getting user:", error.message);
        throw error;
    }
}

export async function GetCompanyData(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/companies/company-profile`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the companies data
        return data;
    } catch (error: any) {
        console.error("Error Getting Company Data:", error.message);
        throw error;
    }
}

export async function InviteUser(userData: UserData, companyId: number, token: string) {

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/invite-user/${companyId}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
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

export async function RegisterUser(password: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/verify-invited-user`, {
            method: "PATCH",
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

export async function UpdateUserProfile(updateData: UserUpdateData, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/update-profile`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updateData)
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
        throw error.message;
    }
}

export async function UpdateCompanyProfile(companyId: string, updateData: CompanyUpdateData, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/companies/update-company-profile/${companyId}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updateData)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to update the company.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error updating the company:", error.message);
        throw error;
    }
}

export async function getHiringManagers(companyId: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/hiring-managers/${companyId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Something went wrong";
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Return the companies data
        return data.hiringManagers; // Assuming you only need the companies array
    } catch (error: any) {
        console.error("Error Getting hiring managers:", error.message);
        throw error;
    }
}