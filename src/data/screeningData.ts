import { API_BASE_URL } from "./constants";

export async function uploadScreeningData(file: File, token: string) {
    try {
        const url = `${API_BASE_URL}/api/v1/applicants/screening`;

        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('file', file); // Append the file to the form data

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Authorization header
            },
            body: formData, // Send form data as body
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to upload screening data.");
        }

        return responseData; // Return the response data if successful
    } catch (error: any) {
        console.error("Error uploading screening data:", error.message);
        throw error;
    }
}

export async function uploadExistingScreeningData(file: File, token: string) {
    try {
        const url = `${API_BASE_URL}/api/v1/applicants/screening`;

        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('file', file); // Append the file to the form data

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Authorization header
            },
            body: formData, // Send form data as body
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to upload screening data.");
        }

        return responseData; // Return the response data if successful
    } catch (error: any) {
        console.error("Error uploading screening data:", error.message);
        throw error;
    }
}

export async function getScreeningApplicants(
    token: string,
    page: number,
    filters: {
        searchTerm?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string;
        applicantCategory: "FIT_FOR_HIRE" | "NEED_REVIEW_SARASOTA" | "NOT_FIT_SARASOTA" | "UNCATEGORIZED_SARASOTA" | "NEED_REVIEW_FORT_MERYS" | "NOT_FIT_FORT_MERYS" | "UNCATEGORIZED_FORT_MERYS" | "DO_NOT_HIRE";
        sortingOptions: "ASC" | "DESC"; // Required parameter
    }
) {
    try {
        // Create URLSearchParams object with required and optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortingOptions: filters.sortingOptions,
            applicantCategory: filters.applicantCategory,
            ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
            ...(filters.fromDate && { fromDate: filters.fromDate }),
            ...(filters.toDate && { toDate: filters.toDate }),
            ...(filters.presetTimeFrame && { presetTimeFrame: filters.presetTimeFrame }),
        }).toString();

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/applicants/applicants-to-review?${queryParams}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });


        // Check if the response is OK
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Something went wrong";
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Return the jobs data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.log("error is: ", error)
        console.error("Error Getting screening applicants:", error.message);
        throw error;
    }
}

export async function moveApplicantToJob(jobId: string, applicantIds: number[], token: string,) {
    try {
        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/applicants/move-screened-to-job/${jobId}`;

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                applicantIds: applicantIds
            })
        });

        // Check if the response is OK
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.message || "Something went wrong";
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Return the applicants data
        return data.message

    } catch (error: any) {
        console.error("Error changing rating", error.message);
        throw error;
    }

}
