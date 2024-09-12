const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GetCompanies(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/companies`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the companies data
        return data.companies; // Assuming you only need the companies array
    } catch (error) {
        console.error("Failed to fetch companies:", error);
        throw error; // Return null or an empty array in case of an error
    }
}


const status = {
    status: "APPROVED"
}

export async function VerifyCompany(id: number, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/companies/${id}/verify-company`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(status)
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
