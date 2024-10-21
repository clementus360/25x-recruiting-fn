import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { API_BASE_URL } from "./constants";

export const uploadCoverLetter = async (coverLetter: Blob, name: string): Promise<string | null> => {
    try {
        const docRef = ref(storage, `coverLetters/${new Date().getTime().toString() + name}`);
        const uploadResult = await uploadBytes(docRef, coverLetter);
        const docUrl = await getDownloadURL(uploadResult.ref);
        return docUrl;
    } catch (error) {
        console.error("Error uploading cover letter: ", error);
        return null; // Return null if there is an error
    }
};

export const uploadResume = async (resume: Blob, name: string): Promise<string | null> => {
    try {
        const docRef = ref(storage, `resumes/${new Date().getTime().toString() + name}`);
        const uploadResult = await uploadBytes(docRef, resume);
        const docUrl = await getDownloadURL(uploadResult.ref);
        return docUrl;
    } catch (error) {
        console.error("Error uploading resume: ", error);
        return null; // Return null if there is an error
    }
};

export async function saveCoverLetter(coverLetterUrl: string, applicantId: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/applicants/edit-applicant/${applicantId}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                coverLetterUrl: coverLetterUrl
            })
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save cover letter");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving cover letter:", error.message);
        throw error;
    }
}

export async function saveResume(resumeUrl: string, applicantId: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/applicants/edit-applicant/${applicantId}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                resumeUrl: resumeUrl
            })
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save resume");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving resume:", error.message);
        throw error;
    }
}