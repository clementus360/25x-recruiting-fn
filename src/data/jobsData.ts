import { ApplicantFormDataType, FormDataType } from "@/types/jobTypes";
import { API_BASE_URL, applicantTestData } from "./constants";

export async function getJobs(
    companyId: string,
    token: string,
    page: number,
    filters: {
        status?: string;
        visibility?: string;
        jobName?: string;
        hiringManagerId?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string
    } = {}
) {
    try {
        // Construct query parameters from the filters object
        const queryParams = new URLSearchParams({
            page: page.toString(),
            // Always include status and visibility, even if their value is "All"
            status: filters.status || "All",
            visibility: filters.visibility || "All",
            ...(filters.jobName && { jobName: filters.jobName }),
            ...(filters.hiringManagerId && { hiringManagerId: filters.hiringManagerId }),
            ...(filters.fromDate && { fromDate: filters.fromDate }),
            ...(filters.toDate && { toDate: filters.toDate }),
            ...(filters.presetTimeFrame && {presetTimeFrame: filters.presetTimeFrame})
        }).toString();


        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/jobs/${companyId}?${queryParams}`;

        console.log(url)

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
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the jobs data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error Getting jobs:", error.message);
        throw error;
    }
}

export async function OpenNewJob(companyId: string, token: string, formData: FormDataType) {
    const requestData = {
        title: formData.jobTitle,
        category: formData.category,
        department: formData.department,
        seats: Number(formData.seats),
        payRate: Number(formData.payRate),
        payPeriod: formData.payPeriod,
        payFrequency: formData.payFrequency,
        managementRole: formData.managementRole,
        employmentType: formData.employmentType,
        hireType: formData.hireType,
        isJobTemplate: "NO",
        country: formData.country,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: Number(formData.zip),
        description: formData.description,
        status: formData.status,
        visibility: formData.visibility,
    }

    try {

        const queryParams = new URLSearchParams({
            hiringManagerId: formData.hiringManager
        }).toString()

        const url = `${API_BASE_URL}/api/v1/jobs/open-job/${companyId}?${queryParams}`

        console.log(url)

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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

export async function getApplicantsForJob(
    jobId: string,
    token: string,
    page: number,
    filters: {
        searchTerm?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string;
        sortingOptions: "ASC" | "DESC"; // Required parameter
    }
) {
    try {
        console.log(filters)
        // Create URLSearchParams object with required and optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortingOptions: filters.sortingOptions,
            ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
            ...(filters.fromDate && { fromDate: filters.fromDate }),
            ...(filters.toDate && { toDate: filters.toDate }),
            ...(filters.presetTimeFrame && { presetTimeFrame: filters.presetTimeFrame }),
        }).toString();

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/applicants/list-all-applicants/${jobId}?${queryParams}`;

        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting applicants:", error.message);
        throw error;
    }
}

export async function addCandidate(jobId: string, token: string, formData: ApplicantFormDataType) {
    // Construct the request payload with the applicant data
    const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: Number(formData.zipCode),
        country: formData.country,
        referredBy: formData.referredBy,
        resumeUrl: formData.resumeUrl
    };

    try {
        // Define the URL for the API endpoint
        const url = `${API_BASE_URL}/api/v1/candidates/add-candidate/${jobId}`;

        console.log(url); // Log the URL for debugging purposes

        // Make the POST request to add the applicant
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to add the applicant.");
        }

        return responseData; // Return the response data if successful
    } catch (error: any) {
        console.error("Error adding the applicant:", error.message);
        throw error;
    }
}

export async function getCandidatesForJob(
    jobId: string,
    token: string,
    page: number,
    filters: {
        searchTerm?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string;
        sortingOptions: "ASC" | "DESC"; // Required parameter
    }
) {
    try {
        console.log(filters)
        // Create URLSearchParams object with required and optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortingOptions: filters.sortingOptions,
            ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
            ...(filters.fromDate && { fromDate: filters.fromDate }),
            ...(filters.toDate && { toDate: filters.toDate }),
            ...(filters.presetTimeFrame && { presetTimeFrame: filters.presetTimeFrame }),
        }).toString();

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/candidates/list-single-job-candidates/${jobId}?${queryParams}`;

        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting applicants:", error.message);
        throw error;
    }
}

export async function getHiresForJob(
    jobId: string,
    token: string,
    page: number,
    filters: {
        searchTerm?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string;
        sortingOptions: "ASC" | "DESC"; // Required parameter
    }
) {
    try {
        console.log(filters)
        // Create URLSearchParams object with required and optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortingOptions: filters.sortingOptions,
            ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
            ...(filters.fromDate && { fromDate: filters.fromDate }),
            ...(filters.toDate && { toDate: filters.toDate }),
            ...(filters.presetTimeFrame && { presetTimeFrame: filters.presetTimeFrame }),
        }).toString();

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/hires/list-all-hires/${jobId}?${queryParams}`;

        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting hires:", error.message);
        throw error;
    }
}

export async function getDeclinedForJob(
    jobId: string,
    token: string,
    page: number,
    filters: {
        searchTerm?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string;
        sortingOptions: "ASC" | "DESC"; // Required parameter
    }
) {
    try {
        console.log(filters)
        // Create URLSearchParams object with required and optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortingOptions: filters.sortingOptions,
            ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
            ...(filters.fromDate && { fromDate: filters.fromDate }),
            ...(filters.toDate && { toDate: filters.toDate }),
            ...(filters.presetTimeFrame && { presetTimeFrame: filters.presetTimeFrame }),
        }).toString();

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/declined/list-all-candidates${jobId}?${queryParams}`;

        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting declined:", error.message);
        throw error;
    }
}

export async function addApplicant(jobId: string, token: string, formData: ApplicantFormDataType) {
    // Construct the request payload with the applicant data
    const requestData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: Number(formData.zipCode),
        country: formData.country,
        referredBy: formData.referredBy,
        resumeUrl: formData.resumeUrl
    };

    try {
        // Define the URL for the API endpoint
        const url = `${API_BASE_URL}/api/v1/applicants/add-applicant/${jobId}`;

        console.log(url); // Log the URL for debugging purposes

        // Make the POST request to add the applicant
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to add the applicant.");
        }

        return responseData; // Return the response data if successful
    } catch (error: any) {
        console.error("Error adding the applicant:", error.message);
        throw error;
    }
}

export async function getCommentsForApplicant(applicantId: number, token: string,) {
    try {
        const url = `${API_BASE_URL}/api/v1/comments/list-comments/${applicantId}`;

        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data.comments; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting applicant comments", error.message);
        throw error;
    }
}

export async function addCommentToApplicant(applicantId: number, token: string, comment: string) {
    try {
        const url = `${API_BASE_URL}/api/v1/comments/add-comment/${applicantId}`;

        console.log(url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                comment
            })
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data.comments; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting applicant comments", error.message);
        throw error;
    }
}

export async function deleteComment(applicantId: number, token: string, commentId: string) {
    try {
        const url = `${API_BASE_URL}/api/v1/comments/comments/delete-comment/${applicantId}/${commentId}`;

        console.log(url);

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data.comments; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error deleting comment", error.message);
        throw error;
    }
}

export async function editRating(applicantId: number, token: string, rating: number) {
    try {
        const url = `${API_BASE_URL}/api/v1/ratings/ratings/edit-rating/${applicantId}`;

        console.log(url);

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                rate: rating
            })
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data.comments; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error changing rating", error.message);
        throw error;
    }
}

export async function HireOrDeclineCandidate(applicantId: number, jobId: number, page: number, token: string, action: string, reason: string) {

    const queryParams = new URLSearchParams({
        page: page.toString(),
        hireOrDecline: action || "AdvanceToCandidate",
    }).toString();

    try {
        const url = `${API_BASE_URL}/api/v1/candidates/${applicantId}/hire-or-decline/${jobId}?${queryParams}`;

        const response = await fetch(url, {
            method: "PATCH",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                reason: reason
            })
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the applicants data
        return data; // Adjust according to the actual data structure returned

    } catch (error: any) {
        console.error("Error Advancing applicant", error.message);
        throw error;
    }
}

export async function getAllCandidates(
    token: string,
    page: number,
    filters: {
        searchTerm?: string;
        fromDate?: string;
        toDate?: string;
        presetTimeFrame?: string;
        sortingOptions: "ASC" | "DESC"; // Required parameter
    }
) {
    try {
        console.log(filters)
        // Create URLSearchParams object with required and optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            sortingOptions: filters.sortingOptions,
            ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
            ...(filters.fromDate && { fromDate: filters.fromDate }),
            ...(filters.toDate && { toDate: filters.toDate }),
            ...(filters.presetTimeFrame && { presetTimeFrame: filters.presetTimeFrame }),
        }).toString();

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/candidates/list-all-candidates?${queryParams}`;

        console.log(url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        console.log("Candidates: ", data)

        // Return the candidate data
        return data;
    } catch (error: any) {
        console.error("Error getting candidates:", error.message);
        throw error;
    }
}

export async function getSingleJob(companyId: string, jobId: string, token: string) {
    try {

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/jobs/${companyId}/list-single-job/${jobId}`;

        console.log(url)

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
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Return the jobs data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error Getting jobs:", error.message);
        throw error;
    }
}

export async function getApplicantData(applicantId: string, token: string) {
    try {

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/applicants/${applicantId}`;

        console.log(url)

        // const response = await fetch(url, {
        //     method: "GET",
        //     headers: {
        //         "Accept": "application/json",
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${token}`,
        //     },
        // });

        // // Check if the response is OK
        // if (!response.ok) {
        //     throw new Error(`Error: ${response.status} ${response.statusText}`);
        // }

        // const data = await response.json();

        const data = applicantTestData

        // Return the jobs data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error Getting jobs:", error.message);
        throw error;
    }
}
