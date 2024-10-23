import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { API_BASE_URL } from "./constants";

export const uploadImage = async (image: Blob, name: string) => {
    const imageRef = ref(
        storage,
        `qualificationDocuments/${new Date().getTime().toString() + name}`
    );
    const uploadResult = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    return imageUrl;
};

export async function saveQualificationDocument(documentType: string, documentUrl: string, token: string) {
    try {
        const queryParams = new URLSearchParams({
            docOptions: documentType
        }).toString();

        const response = await fetch(`${API_BASE_URL}/api/v1/qualification-documents/add-document?${queryParams}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                docUrl: documentUrl
            })
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save qualification document.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving qualification document:", error.message);
        throw error;
    }
}

export async function getQualificationDocument(documentType: string, token: string) {
    try {
        const queryParams = new URLSearchParams({
            docOptions: documentType
        }).toString();

        console.log(documentType)

        const response = await fetch(`${API_BASE_URL}/api/v1/qualification-documents/retrieve-document?${queryParams}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to get qualification document.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error getting qualification document:", error.message);
        throw error;
    }
}

export async function getApplicantQualificationDocument(applicantId: string, token: string) {
    try {
        const queryParams = new URLSearchParams({
            hireId: applicantId
        }).toString();


        const response = await fetch(`${API_BASE_URL}/api/v1/applicants/retrieve-qualification-document/${applicantId}?${queryParams}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to get qualification document.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error getting qualification document:", error.message);
        throw error;
    }
}