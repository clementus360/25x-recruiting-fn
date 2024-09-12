import React, { useRef, useState } from 'react';
import SignaturePad from 'react-signature-canvas';


const SignatureForm = ({ onClose }: { onClose: () => void }) => {
    const signaturePadRef = useRef<SignaturePad>(null);
    const [isAgreed, setIsAgreed] = useState<boolean | null>(null);
    const [name, setName] = useState<string>('');

    const handleSave = () => {
        return
    };

    const handleClear = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Information Notice */}
            <div className="border p-4 text-sm text-gray-600">
                You have been authorized to complete online documents in connection with either your employment or contractor agreement and receive legal notices throughout your employment or contractor agreement electronically. During this process, you will be asked to &quot;sign&quot; one or more of the online documents with an electronic signature. Please read the following carefully regarding the electronic signature/notice Process.
                <br /><br />
                To create your electronic signature, sign your name in the box, type your name into &quot;Signed by&quot;, and click both the &quot;I Agree&quot; box and the &quot;Submit&quot; button appearing at the bottom of the page.
                <br /><br />
                Your electronic signature will be applied when you click &quot;I Agree&quot; on certain additional documents in the onboarding or employment process.
                <br /><br />
                Once the signature process is completed, your electronic signature will be binding as if you had physically signed the document by hand.
                <br /><br />
                If you do not agree to sign the document electronically, click the &quot;I Do Not Agree&quot; box and the &quot;Submit&quot; button. Paper copies may be available for you to complete at no charge by sending a request to support@myemployeejourney.com. The paper copies will be sent to you in the method provided by your employer representative and proper identification will be required before such information is provided.
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
                <div className="flex flex-col items-center gap-4 mt-4">

                    <div className='flex flex-col'>
                        <div className='flex w-full justify-between'>
                            <p className='text-sm text-grey'>Add your signature</p>
                            <button onClick={handleClear} className='text-sm text-blue-400 underline'>Clear signature</button>
                        </div>

                        <SignaturePad
                            ref={signaturePadRef}
                            canvasProps={{ className: 'signature-pad h-24 border' }}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border px-2 py-1 rounded-md"
                    />

                    <div className="flex gap-4">
                        <button
                            onClick={handleSave}
                            className="bg-primary text-white px-4 py-2 rounded-md"
                        >
                            Save Signature
                        </button>
                    </div>
                </div>
            )}

            {/* Show message if user does not agree */}
            {isAgreed === false && (
                <div className="text-red-500 mt-4">
                    You must agree to continue with the electronic signature process.
                </div>
            )}

            <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
                Cancel
            </button>


        </div>
    );
};

export default SignatureForm;
