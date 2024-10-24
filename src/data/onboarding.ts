import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { API_BASE_URL, onboardingCandidates } from "./constants";
import { removeAccessToken, storeAccessToken } from "./cookies";
import { DirectDeposit, OnboardingEmergencyContacts, OnboardingPersonalInfo, ReferencesAndEmployment, TBMedicalQuestionnaire, TaxWithholding } from "@/types/onboardingTypes";
import { useRouter } from "next/navigation";

export const dataURLToBlob = (dataURL: string) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
};

export const uploadSignature = async (image: Blob, name: string) => {
    const imageRef = ref(
        storage,
        `signatures/${new Date().getTime().toString() + name}`
    );
    const uploadResult = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    return imageUrl;
};

export const sendHireLetter = async (companyId: number, applicantId: number, message: string, subject: string, token: string) => {
    try {
        const queryParams = new URLSearchParams({
            companyId: companyId.toString(),
            hiredId: applicantId.toString()
        }).toString();

        const url = `${API_BASE_URL}/api/v1/onboardings/${companyId}/hire-letter?${queryParams}`;

        // Make the POST request to add the applicant
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                subject,
                message
            })
        })

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to send hire letter.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error sending hire letter", error.message);
        throw error;
    }
};

export const startCollectingDocuments = async (companyId: number, applicantId: number, token: string) => {
    try {
        const queryParams = new URLSearchParams({
            companyId: companyId.toString(),
            hiredId: applicantId.toString()
        }).toString();

        console.log(queryParams)

        const url = `${API_BASE_URL}/api/v1/onboardings/${companyId}/start-collecting-documents?${queryParams}`;

        // Make the POST request to add the applicant
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to start collecting documents.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error starting collecting documents:", error.message);
        throw error;
    }
};

export async function CompleteOnboardingRegistration(password: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/verify-hired-candidate`, {
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
            throw new Error(responseData.message || "Failed to register onboarding candidate.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error registering onboarding candidate:", error.message);
        throw error;
    }
}

export async function OnboardingUserSignIn(
    email: string,
    password: string,
    onSignInSuccess: () => void
) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/signin`, {
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
            throw new Error(responseData.message || "Failed to Sign-in onboarding user");
        }

        storeAccessToken(responseData.accessToken);

        // Call the callback to fetch user data
        onSignInSuccess(); // Trigger fetching user data after login

        return responseData; // Return the response data if successful
    } catch (error: any) {
        console.error("Error Logging in", error.message);
        throw error;
    }
}

export function useOnboardingLogout() {
    const router = useRouter(); // Initialize useRouter inside the hook

    // Logout function
    const handleLogout = () => {
        // Remove access token from localStorage
        removeAccessToken();
        // Redirect to sign-in page
        router.push("/onboarding/sign-in");
    };

    return handleLogout;
}

export async function saveSignature(signatureUrl: string, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/save-signature`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                signatureUrl: signatureUrl
            })
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save signature.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving signature:", error.message);
        throw error;
    }
}

export async function getSignature(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/find-signature-url`, {
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
            throw new Error(responseData.message || "Failed to get signature.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error getting signature:", error.message);
        throw error;
    }
}


// Personal Information
export async function savePersonalInfo(personalInfo: OnboardingPersonalInfo, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/personal-info`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(personalInfo)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving personal info:", error.message);
        throw error;
    }
}

export async function editPersonalInfo(personalInfo: OnboardingPersonalInfo, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/personal-info`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(personalInfo)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to edit personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error editing personal info:", error.message);
        throw error;
    }
}

export async function submitPersonalInfo(personalInfo: OnboardingPersonalInfo, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/personal-info/submit-document`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(personalInfo)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting personal info:", error.message);
        throw error;
    }
}

export async function getPersonalInfo(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/onboardings/personal-info`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting personal info:", error.message);
        throw error;
    }
}

// Emergency Contacts
export async function saveEmergencyContacts(emergencyContacts: OnboardingEmergencyContacts, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/emergency-contacts/add-document`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(emergencyContacts)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving personal info:", error.message);
        throw error;
    }
}

export async function editEmergencyContacts(emergencyContacts: OnboardingEmergencyContacts, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/emergency-contacts/edit-info`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(emergencyContacts)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to edit personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error editing personal info:", error.message);
        throw error;
    }
}

export async function submitEmergencyContacts(emergencyContacts: OnboardingEmergencyContacts, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/emergency-contacts/submit-document`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(emergencyContacts)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting personal info:", error.message);
        throw error;
    }
}

export async function getEmergencyContacts(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/emergency-contacts/retireve-document`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit personal info.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting personal info:", error.message);
        throw error;
    }
}

// Direct Deposit
export async function saveDirectDeposit(directDeposit: DirectDeposit, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/direct-deposits/add-document`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(directDeposit)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save direct deposit.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving direct deposit:", error.message);
        throw error;
    }
}

export async function editDirectDeposit(directDeposit: DirectDeposit, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/direct-deposits/edit-info`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(directDeposit)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to edit direct deposit.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error editing direct deposit:", error.message);
        throw error;
    }
}

export async function submitDirectDeposit(directDeposit: DirectDeposit, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/direct-deposits/submit-document`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(directDeposit)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit direct deposit.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting direct deposit:", error.message);
        throw error;
    }
}

export async function getDirectDeposit(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/direct-deposits/retireve-document`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit direct deposit.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting direct deposit:", error.message);
        throw error;
    }
}

// References and Employment
export async function saveReferencesAndEmployment(referencesAndEmployment: ReferencesAndEmployment, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/add-reference-and-employment-history`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(referencesAndEmployment)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save References and Employment.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving References and Employment:", error.message);
        throw error;
    }
}

export async function editReferencesAndEmployment(referencesAndEmployment: ReferencesAndEmployment, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/edit-reference-and-employment-history`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(referencesAndEmployment)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to edit References and Employment.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error editing References and Employment:", error.message);
        throw error;
    }
}

export async function submitReferencesAndEmployment(referencesAndEmployment: ReferencesAndEmployment, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/submit-reference-and-employment-history`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(referencesAndEmployment)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit References and Employment.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting References and Employment:", error.message);
        throw error;
    }
}

export async function getReferencesAndEmployment(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/retireve-reference-and-employment-history`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit References and Employment.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting References and Employment:", error.message);
        throw error;
    }
}

// Additional documents
export async function getAdditionalDocument(category: string, token: string) {
    try {
        const queryParams = new URLSearchParams({
            docOptions: category,
        }).toString();

        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/retireve-additional-document?${queryParams}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit References and Employment.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting References and Employment:", error.message);
        throw error;
    }
}

export async function submitAdditionalDocument(category: string, token: string) {
    try {
        const queryParams = new URLSearchParams({
            docOptions: category,
        }).toString();

        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/submit-additional-document?${queryParams}`, {
            method: "PATCH",
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
            throw new Error(responseData.message || "Failed to submit References and Employment.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting References and Employment:", error.message);
        throw error;
    }
}

// TB Medical Questionnaire Form
export async function saveTBMedicalQuestionnaire(tbMedicalQuestionnaire: TBMedicalQuestionnaire, token: string) {
    console.log(tbMedicalQuestionnaire)
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/add-tb-targeted-medical-questionnaire-form`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(tbMedicalQuestionnaire)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save tb targeted medical questionnaire.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving tb targeted medical questionnaire:", error.message);
        throw error;
    }
}

export async function editTBMedicalQuestionnaire(tbMedicalQuestionnaire: TBMedicalQuestionnaire, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/edit-tb-targeted-medical-questionnaire-form`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(tbMedicalQuestionnaire)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to edit tb targeted medical questionnaire.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error editing tb targeted medical questionnaire:", error.message);
        throw error;
    }
}

export async function submitTBMedicalQuestionnaire(tbMedicalQuestionnaire: TBMedicalQuestionnaire, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/submit-tb-targeted-medical-questionnaire-form`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(tbMedicalQuestionnaire)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit tb targeted medical questionnaire.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting tb targeted medical questionnaire:", error.message);
        throw error;
    }
}

export async function getTBMedicalQuestionnaire(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/additional-documents/retireve-tb-targeted-medical-questionnaire-form`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit tb targeted medical questionnaire.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting tb targeted medical questionnaire:", error.message);
        throw error;
    }
}

// Tax Withholding
export async function saveTaxWithholding(taxWithholding: TaxWithholding, token: string) {
    try {

        console.log("Tax withholding: ", taxWithholding)

        const response = await fetch(`${API_BASE_URL}/api/v1/tax-withholding/add-document`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(taxWithholding)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to save tax withholding.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error saving tax withholding:", error.message);
        throw error;
    }
}

export async function editTaxWithholding(taxWithholding: TaxWithholding, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/tax-withholding/edit-info`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(taxWithholding)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to edit tax withholding.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error editing tax withholding:", error.message);
        throw error;
    }
}

export async function submitTaxWithholding(taxWithholding: TaxWithholding, token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/tax-withholding/submit-document`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(taxWithholding)
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit tax withholding.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting tax withholding:", error.message);
        throw error;
    }
}

export async function getTaxWithholding(token: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/tax-withholding/retireve-document`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        // Read the response body regardless of the status
        const responseData = await response.json();

        if (!response.ok) {
            // Extract and handle the error message from the response body
            console.error("Error details from the response:", responseData);
            throw new Error(responseData.message || "Failed to submit tax withholding.");
        }

        return responseData; // Return the response data if successful

    } catch (error: any) {
        console.error("Error submitting tax withholding:", error.message);
        throw error;
    }
}

// Dashboard
export async function getAllOnboardingCandidates(
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

        // Create URLSearchParams object with required and optional parameters
        const queryParams = new URLSearchParams({
            page: page.toString(),
            // sortingOptions: filters.sortingOptions,
            // ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
            // ...(filters.fromDate && { fromDate: filters.fromDate }),
            // ...(filters.toDate && { toDate: filters.toDate }),
            // ...(filters.presetTimeFrame && { presetTimeFrame: filters.presetTimeFrame }),
        }).toString();

        // Construct the full URL with query parameters
        const url = `${API_BASE_URL}/api/v1/hires/list-all-hires?${queryParams}`;

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
            const errorData = await response.json();
            const errorMessage = errorData.message || "Something went wrong";
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Return the applicants data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting hires:", error.message);
        throw error;
    }
}

export async function getSingleOnboardingCandidate(
    onboardingId: string,
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
        const url = `${API_BASE_URL}/api/v1/onboardings/list-all-hires/${onboardingId}?${queryParams}`;

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
            const errorData = await response.json();
            const errorMessage = errorData.message || "Something went wrong";
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Return the applicants data
        return data; // Adjust according to the actual data structure returned
    } catch (error: any) {
        console.error("Error getting hires:", error.message);
        throw error;
    }
}
