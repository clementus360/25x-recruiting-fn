import { useError } from '@/context/ErrorContext';
import { useSuccess } from '@/context/SuccessContext';
import { getAccessToken } from '@/data/cookies';
import { dataURLToBlob, saveSignature, uploadSignature } from '@/data/onboarding';
import React, { useEffect, useRef, useState } from 'react';
import { Oval } from 'react-loader-spinner';
import SignaturePad from 'react-signature-canvas';

const SignatureForm = ({ onClose }: { onClose: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const { setError } = useError();
    const { setSuccess } = useSuccess();
    const signaturePadRef = useRef<SignaturePad>(null);
    const [isAgreed, setIsAgreed] = useState<boolean | null>(null);
    const [name, setName] = useState<string>('');

    useEffect(() => {
        // Check both the name and if the signature pad is empty
        if (name.trim() === "" || signaturePadRef.current?.isEmpty()) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [name, signaturePadRef.current]); // Track both `name` and signature pad state

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleSave = async () => {
        if (name.trim() === "") {
            setError("Name is required.");
            return;
        }

        setLoading(true);

        try {
            const token = getAccessToken();
            if (!token) {
                return;
            }

            const signatureData = signaturePadRef.current?.toDataURL(); // get the base64 signature
            if (!signatureData) {
                setError("No signature detected.");
                return;
            }

            const signatureBlob = dataURLToBlob(signatureData);

            const signature = await uploadSignature(signatureBlob, name);

            await saveSignature(signature, token)

            setSuccess("Signature saved successfully");
            onClose()
        } catch (err: any) {
            setError(err.message || "Failed to save signature");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
            setDisabled(true); // Disable save button again after clearing signature
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Information Notice */}
            <div className="border p-4 text-sm text-gray-600">
                You have been authorized to complete online documents in connection with either your employment or contractor agreement and receive legal notices throughout your employment or contractor agreement electronically. During this process, you will be asked to &apos;sign&apos; one or more of the online documents with an electronic signature. Please read the following carefully regarding the electronic signature/notice Process.
                <br /><br />
                To create your electronic signature, sign your name in the box, type your name into &apos;Signed by&apos;, and click both the &apos;I Agree&apos; box and the &apos;Submit&apos; button appearing at the bottom of the page.
                <br /><br />
                Your electronic signature will be applied when you click &apos;I Agree&apos; on certain additional documents in the onboarding or employment process.
                <br /><br />
                Once the signature process is completed, your electronic signature will be binding as if you had physically signed the document by hand.
                <br /><br />
                If you do not agree to sign the document electronically, click the &apos;I Do Not Agree&apos; box and the &apos;Submit&apos; button. Paper copies may be available for you to complete at no charge by sending a request to support@myemployeejourney.com. The paper copies will be sent to you in the method provided by your employer representative and proper identification will be required before such information is provided.
                <br /><br />
                After you complete a document that requires your electronic signature and/or once all the documents have been completed and signed, you may immediately view, download or print the documents, or at a later time by logging in again using your Username and password.
                <br /><br />
                Click here for the hardware/software requirements needed to access and retain the electronic records, this includes documents that may be presented to you for signature. You may send additional inquiries to: support@myemployeejourney.com.
                <br /><br />
                If at any point you would like to withdraw your consent for your electronic signature, or if you need to update information needed to contact you electronically, send us an email to support@myemployeejourney.com (this is not a secure e-mail). Indicate in the body of your email message that you are withdrawing your consent to receive electronic documents. You do not need to provide us with an explanation for your decision. Any withdrawal of consent will be effective as of the date it is received.
                <br /><br />
                You consent to provide an electronic signature rather than a handwritten signature in connection with any application, background screening, employment/onboarding, or transition/employee journey documents and whenever you sign documents on this website.
            </div>

            {/* Agreement Selection */}
            <div className="flex gap-2">
                <div>
                    <label className="mr-2">
                        <input
                            type="radio"
                            name="agreement"
                            value="agree"
                            checked={isAgreed === true}
                            onChange={() => setIsAgreed(true)}
                            className="mr-1"
                        />
                        I Agree
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="agreement"
                            value="disagree"
                            checked={isAgreed === false}
                            onChange={() => setIsAgreed(false)}
                            className="mr-1"
                        />
                        I Do Not Agree
                    </label>
                </div>
            </div>

            {/* Show Signature Pad and Name Input if Agreed */}
            {isAgreed && (
                <div className="flex flex-col items-center gap-4 mt-4 w-full">

                    <div className='flex flex-col'>
                        <div className='flex w-full justify-between'>
                            <p className='text-sm text-grey'>Add your signature</p>
                            <button onClick={handleClear} className='text-sm text-blue-400 underline'>Clear signature</button>
                        </div>

                        <SignaturePad
                            ref={signaturePadRef}
                            canvasProps={{ className: 'signature-pad w-96 h-24 border' }}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={handleNameChange}
                        className="border px-2 py-1 w-96 rounded-md"
                    />
                </div>
            )}

            {/* Show message if user does not agree */}
            {isAgreed === false && (
                <div className="text-red-500 mt-4">
                    You must agree to continue with the electronic signature process.
                </div>
            )}

            <div className="flex gap-4 w-full items-end justify-end">
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Cancel
                </button>
                <button
                    className="flex gap-2 items-center justify-center bg-primary disabled:cursor-not-allowed disabled:bg-gray-400 hover:bg-opacity-80 cursor-pointer text-white font-semibold px-4 py-2 rounded-md"
                    onClick={handleSave}
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
                    <p>{loading ? "Saving..." : "Save Signature"}</p>
                </button>

            </div>
        </div>
    );
};

export default SignatureForm;
